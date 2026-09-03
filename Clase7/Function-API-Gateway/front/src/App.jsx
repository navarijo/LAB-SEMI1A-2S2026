import { useState } from 'react' 
import './App.css'

function App() {
  const [estudianteInput, setEstudianteInput] = useState('')
  const [listaEstudiantes, setListaEstudiantes] = useState([])
  const [mensaje, setMensaje] = useState('')

  const API_URL = 'Aqui ponen la URL del API Management'

  const obtenerRegistros = async () => {
    try {
      setMensaje("Cargando registros...")
      const response = await fetch(API_URL, {
        method: 'GET',
      })
      const data = await response.json()

      if (response.ok) {
        setListaEstudiantes(data.estudiantes || [])
        setMensaje("Registros actualizados.")
      } else {
        setMensaje("Error al obtener los registros.")
      }
    } catch (error) {
      setMensaje("Error de conexión con el API Gateway")
      console.error(error)
    }
  }

  const enviarRegistro = async () => {
    if (!estudianteInput) {
      alert("Por favor ingresa el nombre y carné del estudiante")
      return
    }

    try {
      setMensaje("Enviando...")
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estudiante: estudianteInput }), 
      })

      if (response.ok) {
        setMensaje("¡Éxito! Estudiante agregado.")
        setEstudianteInput('') 
        
      } else {
        setMensaje("Error al guardar el estudiante.")
      }
    } catch (error) {
      setMensaje("Error de conexión con el API Gateway")
      console.error(error)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Gestión de Grupo</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Estudiante:</label>
          <input 
            type="text" 
            value={estudianteInput} 
            onChange={(e) => setEstudianteInput(e.target.value)} 
            placeholder="Ej. Juan Pérez - 202100000"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            onClick={enviarRegistro} 
            style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', flex: 1, cursor: 'pointer' }}>
            Enviar (PUT)
          </button>
          
          <button 
            type="button" 
            onClick={obtenerRegistros} 
            style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', flex: 1, cursor: 'pointer' }}>
            Registros (GET)
          </button>
        </div>

      </div>
      
      {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#555' }}>{mensaje}</p>}

      <hr style={{ margin: '20px 0' }} />

      <h2>Mi team</h2>
      <ul style={{ textAlign: 'left' }}>
        {listaEstudiantes.length > 0 ? (
          listaEstudiantes.map((estudiante, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{estudiante}</li>
          ))
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Presiona "Registros" para ver el listado.</p>
        )}
      </ul>

    </div>
  )
}

export default App