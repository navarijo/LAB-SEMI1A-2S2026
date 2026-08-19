import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Inicializamos el cliente de S3, Se fijan en poner bien la region en donde esten creando el bucket
const s3Client = new S3Client({ region: "us-east-2" }); 

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const fileName = body.fileName;
        const fileType = body.fileType;

        const bucketName = "ejemplo5lambda";

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: fileType
        });

        // Generamos la URL con el permiso temporal
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        // Devolvemos la URL a nuestra aplicación web
        return {
            statusCode: 200,
            headers: {
                // Es vital mantener los headers CORS si llamas a la API desde localhost
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                message: "URL generada con éxito",
                uploadUrl: uploadUrl,
                fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}` 
            })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno", error: error.message })
        };
    }
};