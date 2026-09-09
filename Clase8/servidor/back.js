const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'db-practica2.cfekwm0cokq2.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Ejemplo_2026',
    database: 'Ejem',
    port: 3306
});

app.post('/images', (req, res) => {
    const { nombre, tipo, url } = req.body;

    const query = "INSERT INTO archivos (nombre, tipo, url) VALUES (?, ?, ?)";
    
    db.execute(query, [nombre, tipo, url], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al guardar en RDS" });
        }
        res.status(201).json({ message: "Guardado en RDS exitosamente", id: result.insertId });
    });
});

app.listen(3000, () => {
    console.log('Servidor VM corriendo en puerto 3000');
});