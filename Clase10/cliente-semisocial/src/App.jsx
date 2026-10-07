import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registro from './components/Registro';
import Verificacion from './components/Verificacion';
import Login from './components/Login';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
        
        
        <nav style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/" style={{ padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Iniciar Sesión
          </Link>
          <Link to="/registro" style={{ padding: '8px 16px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Registrarse
          </Link>
          <Link to="/verificacion" style={{ padding: '8px 16px', background: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px' }}>
            Verificar Cuenta
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verificacion" element={<Verificacion />} />
        </Routes>
      </div>
      <Chatbot />
    </Router>
  );
}

export default App;