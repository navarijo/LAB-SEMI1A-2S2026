import { useState } from 'react';

const Chatbot = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [historial, setHistorial] = useState([
    { emisor: 'bot', texto: '¡Hola! Soy el asistente de la Facultad. ¿En qué te ayudo?' }
  ]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevoHistorial = [...historial, { emisor: 'usuario', texto: mensaje }];
    setHistorial(nuevoHistorial);
    setMensaje('');

    try {
      const response = await fetch('http://localhost:4000/chat-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: mensaje, sessionId: 'usuario-123' }) // ID para la sesión
      });

      const data = await response.json();

      if (response.ok && data.mensajes) {
        const respuestasBot = data.mensajes.map(msg => ({ emisor: 'bot', texto: msg }));
        setHistorial([...nuevoHistorial, ...respuestasBot]);
      }
    } catch (error) {
      setHistorial([...nuevoHistorial, { emisor: 'bot', texto: 'Error de conexión.' }]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setAbierto(!abierto)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#007bff', color: 'white', border: 'none',
          fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        💬
      </button>

      {abierto && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '300px', height: '400px', backgroundColor: 'white',
          borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          zIndex: 1000, border: '1px solid #ddd'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            Asistente Virtual
          </div>

          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historial.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.emisor === 'usuario' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.emisor === 'usuario' ? '#d1e7dd' : '#f8f9fa',
                padding: '8px 12px', borderRadius: '15px', maxWidth: '80%',
                fontSize: '14px', border: '1px solid #eee'
              }}>
                {msg.texto}
              </div>
            ))}
          </div>

          <form onSubmit={enviarMensaje} style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '10px' }}>
            <input 
              type="text" 
              value={mensaje} 
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
            />
            <button type="submit" style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;