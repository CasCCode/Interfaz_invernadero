import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Helmet } from 'react-helmet';
import './Login.css';

function Login() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      let errorMessage;
      switch(err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no registrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de email inválido';
          break;
        default:
          errorMessage = 'Error al iniciar sesión';
      }
      setError(errorMessage);
    }
    setLoading(false);
  };  

  return (
    <div className="login-container">
      <Helmet>
        <title>Login | GrowSphere</title>
      </Helmet>
      <form onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>

        <div className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;