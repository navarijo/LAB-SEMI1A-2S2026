const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'ejemplo',
    port: 3306,
    ssl: {
        rejectUnauthorized: false // Esto es para que indique que no valide el SSL
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado exitosamente a Azure MySQL.');
});

app.post('/carga_estudiante', (req, res) => {
    const { nombre, curso } = req.body;

    if (!nombre || !curso) {
        return res.status(400).json({ error: 'Faltan campos: nombre y curso son obligatorios' });
    }

    const sql = 'INSERT INTO estudiante (nombre, curso) VALUES (?, ?)';
    db.query(sql, [nombre, curso], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            mensaje: 'Estudiante cargado exitosamente', 
            id: result.insertId 
        });
    });
});

app.get('/mostrar_estudiantes', (req, res) => {
    const sql = 'SELECT * FROM estudiante';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de CloudCinema corriendo en http://localhost:${PORT}`);
});