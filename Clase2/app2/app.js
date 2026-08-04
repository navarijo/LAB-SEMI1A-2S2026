const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const estudiantes = [];

app.get('/', (req, res) => {
    
    let miTarjetita = estudiantes.map(nombre => `
        <div class="card">
            <div class="avatar">${nombre.charAt(0).toUpperCase()}</div>
            <div class="info">${nombre}</div>
        </div>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Asistencia</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; display: flex; flex-direction: column; align-items: center; padding: 20px; }
            h1 { color: #333; }
            
            form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; gap: 10px; margin-bottom: 30px; }
            input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; width: 200px; }
            button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.3s; }
            button:hover { background-color: #0056b3; }

            .grid { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; max-width: 800px; }
            
            .card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); display: flex; align-items: center; gap: 15px; min-width: 150px; animation: fadeIn 0.5s ease; }
            .avatar { width: 40px; height: 40px; background-color: #6c5ce7; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; }
            .info { font-weight: 500; color: #333; }

        </style>
    </head>
    <body>
        <h1>Registro de Estudiantes</h1>
        
        <form action="/add" method="POST">
            <input type="text" name="nombre" placeholder="Ingresa tu nombre" required autocomplete="off">
            <button type="submit">Registrarme</button>
        </form>

        <div class="grid">
            ${miTarjetita} </div>

    </body>
    </html>
    `;
    
    res.send(html);
});

app.post('/add', (req, res) => {
    const nombre = req.body.nombre;
    if (nombre) {
        estudiantes.push(nombre); 
    }
    res.redirect('/'); 
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
