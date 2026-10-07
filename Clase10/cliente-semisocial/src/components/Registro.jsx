import { useState } from 'react';
import Escaneo from './escaneo'; // Importamos tu componente

const Registro = () => {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    correo: '',
    DPI: '',
    password: '',
    confirmPassword: ''
  });
  
  const [imagenBase64, setImagenBase64] = useState(null);
  const [isTakePhoto, setIsTakePhoto] = useState(false); // Estado para controlar si se tomó la foto
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
    
    // Validamos usando el estado que maneja tu componente Escaneo
    if (!isTakePhoto || imagenBase64 === null) {
      setMensaje("Asegúrate de tomar o importar una fotografía.");
      return;
    }

    try {
      setMensaje("Procesando registro...");

      const response = await fetch('http://localhost:4000/registrar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          nombre: formData.nombre,
          correo: formData.correo,
          DPI: formData.DPI,
          clave: formData.password,
          imagenBase64: imagenBase64 
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "200") {
        setMensaje("¡Usuario registrado exitosamente! Revisa tu correo electrónico.");
      } else {
        setMensaje(data.message || "Error al registrar el usuario.");
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor backend.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registro Semi-Social</h2>
      
      <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" name="username" placeholder="Nombre de usuario (Para Login)" value={formData.username} onChange={handleChange} required />
        <input type="text" name="nombre" placeholder="Nombre Completo" value={formData.nombre} onChange={handleChange} required />
        <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} required />
        <input type="number" name="DPI" placeholder="DPI" value={formData.DPI} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} required />

        {/* Instanciamos tu componente original */}
        <Escaneo handleSetImage={setImagenBase64} setIsTakePhoto={setIsTakePhoto} />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Registrarme
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
};

export default Registro;