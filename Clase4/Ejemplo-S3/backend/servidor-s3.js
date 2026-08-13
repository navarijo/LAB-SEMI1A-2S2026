require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const db = require('./conexiondb'); 

const app = express();
app.use(cors());
app.use(express.json());

// configuracion de S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
});

// almacenamiento en memoria RAM temporal para multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('foto'), async (req, res) => {
    try {
        const { nombre } = req.body;
        const file = req.file;

        if (!file || !nombre) {
            return res.status(400).json({ message: 'Faltan datos (nombre o foto)' });
        }

        const fileName = `Mis_Fotos/${Date.now()}_${file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const query = 'INSERT INTO Estudiantes (nombre, foto) VALUES (?, ?)';
        const [result] = await db.execute(query, [nombre, fileName]);

        res.status(200).json({ 
            message: 'Archivo subido y registrado', 
            s3Path: fileName,
            dbId: result.insertId 
        });

    } catch (error) {
        console.error('Error en el proceso:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
});

app.get('/estudiantes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Estudiantes ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});