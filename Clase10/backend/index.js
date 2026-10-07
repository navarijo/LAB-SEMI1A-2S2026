import express from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// ---LEX---
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { ConfirmSignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';


dotenv.config();
const app = express();
const port = 4000;

app.use(cors());
// Aumentamos el límite para permitir el peso de las imágenes en base64
app.use(express.json({ limit: '10mb' })); 

// cliente chat
const lexClient = new LexRuntimeV2Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.BPK,
    secretAccessKey: process.env.BSK
  }
});
// ------

const s3Client = new S3Client({
  region: process.env.BREGION,
  credentials: {
    accessKeyId: process.env.BPK,
    secretAccessKey: process.env.BSK
  }
});

// El cliente de cognito ojo aqui, no necesita credenciales IAM para la función de SignUp público
const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.BREGION 
});

app.post("/registrar-usuario", async (req, res) => {
  const { username, nombre, correo, DPI, clave, imagenBase64 } = req.body;

  try {
    const bufferImg = Buffer.from(imagenBase64, "base64");
    const nombreImagen = uuidv4() + ".jpg";
    
    const s3Params = {
      Bucket: process.env.BNAME,
      Key: `Fotos/${nombreImagen}`,
      Body: bufferImg,
      ContentType: "image/jpeg" 
    };
    
    await s3Client.send(new PutObjectCommand(s3Params));
    const imageUrl = `https://${process.env.BNAME}.s3.us-east-2.amazonaws.com/Fotos/${nombreImagen}`;

    const cognitoParams = {
      ClientId: process.env.CLIENTITO, 
      Username: username,              
      Password: clave,                 
      UserAttributes: [
        { Name: 'name', Value: nombre },
        { Name: 'email', Value: correo },
        { Name: 'custom:dpi', Value: String(DPI) },
        { Name: 'picture', Value: imageUrl } 
      ]
    };

    await cognitoClient.send(new SignUpCommand(cognitoParams));

    // GUARDAR ---
    /* const StringConnection = "INSERT INTO Usuarios (Nombre, Correo, DPI, Clave, Imagen) VALUES (?, ?, ?, ?, ?)";
      await connection.query(StringConnection, [nombre, correo, DPI, hash(clave), imageUrl]);
    */

    res.status(200).json({ message: "Usuario registrado exitosamente", status: "200" });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: error.message || "Error al registrar en el servidor", status: "500" });
  }
});

// verificando usuario
app.post("/verificar-usuario", async (req, res) => {
  const { username, codigo } = req.body;

  try {
    const params = {
      ClientId: process.env.CLIENTITO,
      Username: username,
      ConfirmationCode: codigo
    };

    await cognitoClient.send(new ConfirmSignUpCommand(params));
    
    res.status(200).json({ message: "Cuenta verificada exitosamente", status: "200" });
  } catch (error) {
    console.error("Error en verificación:", error);
    res.status(400).json({ message: error.message || "Código inválido o expirado", status: "400" });
  }
});

// LOGIN
app.post("/ingreso-usuario", async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.CLIENTITO,
      AuthParameters: {
        USERNAME: usuario,
        PASSWORD: clave
      }
    };
    // auth
    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    // tokens de sesion
    const idToken = response.AuthenticationResult.IdToken;
    const accessToken = response.AuthenticationResult.AccessToken;

    /* const StringConnection = "SELECT idUsuario, Nombre, Correo, Imagen FROM Usuarios WHERE Nombre = ? OR Correo = ?";
      const [resultado] = await connection.query(StringConnection, [usuario, usuario]);
      
      Resultado si el usuario existe y la contraseña es correcta [Ya salio!]
    */

    res.status(200).json({ 
      message: "Inicio de sesión exitoso", 
      JWT: idToken,
      AccessToken: accessToken,
      status: "200" 
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(400).json({ message: "Credenciales incorrectas o cuenta sin verificar.", status: "400" });
  }
});

app.post("/chat-bot", async (req, res) => {
  const { texto, sessionId } = req.body;

  try {
    const params = {
      botId: process.env.LEX_BOT_ID,
      botAliasId: process.env.LEX_BOT_ALIAS_ID,
      localeId: process.env.LEX_LOCALE_ID,
      // Ojo que aqui pueden usar un sessionId fijo o dinamico, asi mantienen su sesion activa
      sessionId: sessionId || "sesion-estudiante-1", 
      text: texto
    };

    const command = new RecognizeTextCommand(params);
    const response = await lexClient.send(command);

    // Lex puede devolver múltiples mensajes, los extraemos
    const mensajes = response.messages ? response.messages.map(m => m.content) : [];
    
    res.status(200).json({ mensajes, status: "200" });
  } catch (error) {
    console.error("Error con Lex:", error);
    res.status(500).json({ message: "Error al comunicarse con el bot", status: "500" });
  }
});

app.listen(port, () => {
  console.log(`Backend de Semi-Social corriendo en el puerto ${port}`);
});