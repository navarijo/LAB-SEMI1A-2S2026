import { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../cognitoConfig';

const Verificacion = () => {
  const [username, setUsername] = useState(''); 
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      Username: username, // Enviamos el username a Cognito
      Pool: userPool,
    };
    
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(codigo, true, (err, result) => {
      if (err) {
        setMensaje('Error de verificación: ' + (err.message || JSON.stringify(err)));
        return;
      }
      setMensaje('¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.');
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Verificar Cuenta</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Ingresa tu Nombre de Usuario y el código numérico que recibiste en tu correo.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Nombre de Usuario:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />

        <label>Código de Verificación:</label>
        <input 
          type="text" 
          value={codigo} 
          onChange={(e) => setCodigo(e.target.value)} 
          required 
        />

        <button type="submit" style={{ marginTop: '15px', padding: '10px' }}>
          Verificar Código
        </button>
      </form>
      
      {mensaje && (
        <p style={{ marginTop: '20px', fontWeight: 'bold', color: mensaje.includes('Error') ? 'red' : 'green' }}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default Verificacion;