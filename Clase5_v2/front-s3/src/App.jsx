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

    try {
      setMensaje("Aqui, solicito acceso a AWS...");

      const apiResponse = await fetch('https://dtr90xthjg.execute-api.us-east-2.amazonaws.com/carga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: `${nombre}-${file.name}`, 
          fileType: file.type 
        }),
      });

      const apiData = await apiResponse.json();

      if (!apiResponse.ok) throw new Error(apiData.message || "Error al obtener URL");

      setMensaje("S3: Subiendo archivo directamente...");

      const uploadResponse = await fetch(apiData.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type, 
        },
        body: file, 
      });

      if (uploadResponse.ok) {
        setMensaje(`Imagen disponible en: ${apiData.fileUrl}`);
        setNombre('');
        setFile(null);
      } else {
        throw new Error("S3 rechazó el archivo");
      }

    } catch (error) {
      setMensaje("Ocurrió un error en el proceso");
      console.error("Detalle del error:", error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Registro de Usuarios</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Nombre del Usuario:</label>
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

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cargar Imagen
        </button>

      </form>
      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  )
}

export default App