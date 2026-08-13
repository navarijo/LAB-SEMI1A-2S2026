import { useState } from 'react'
import './App.css'

function App() {
  const [nombre, setNombre] = useState('')
  const [file, setFile] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !file) {
      alert("Por favor completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('foto', file); 

    try {
      setMensaje("Enviando...");
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`¡Éxito! Guardado en BD ID: ${data.dbId}. Ruta S3: ${data.s3Path}`);
        setNombre('');
        setFile(null);
      } else {
        setMensaje(`Error: ${data.message}`);
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Registro Estudiante</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Nombre Completo:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Foto de Perfil:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Enviar a la Nube
        </button>

      </form>
      
      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  )
}

export default App