import { useState } from 'react';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Iniciando sesión...");

    try {
      const response = await fetch('http://localhost:4000/ingreso-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
      });

      const data = await response.json();

      if (response.ok && data.status === "200") {
        setMensaje("¡Inicio de sesión exitoso!");
        console.log("Token recibido (Guárdalo en LocalStorage o Context):", data.JWT);
        
        alert("Todo bien")
      } else {
        setMensaje(data.message || "Credenciales incorrectas.");
        alert("Todo mal")
      }
    } catch (error) {
      setMensaje("Error de conexión con el servidor backend.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Nombre de Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} required />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Ingresar
        </button>
      </form>
      
      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensaje}</p>}
    </div>
  );
};

export default Login;