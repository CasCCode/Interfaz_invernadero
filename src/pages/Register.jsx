import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push('Mínimo 6 caracteres');
    if (!/\d/.test(password)) errors.push('Al menos un número');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Al menos un carácter especial');
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Email inválido';
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) newErrors.password = passwordErrors;
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = ['Las contraseñas no coinciden'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        nombre: nombre.trim(),
        email: email.toLowerCase(),
        fechaRegistro: new Date(),
        invernaderos: []
      });

      navigate('/');

    } catch (error) {
      let errorMessage = 'Error al registrar. Intente nuevamente.';
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El email ya está registrado';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil';
          break;
      }
      setErrors({ general: [errorMessage] });
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Crear Cuenta</h2>
        
        {errors.general && (
          <div className="error-message">{errors.general.join(', ')}</div>
        )}

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrors(prev => ({ ...prev, nombre: null }));
            }}
            className={errors.nombre ? 'error' : ''}
            disabled={loading}
          />
          {errors.nombre && <div className="field-error">{errors.nombre}</div>}
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: null }));
            }}
            className={errors.email ? 'error' : ''}
            disabled={loading}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: null }));
            }}
            className={errors.password ? 'error' : ''}
            disabled={loading}
          />
          {errors.password && (
            <div className="field-error">
              <strong>Requisitos:</strong>
              <ul>
                {errors.password.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
            className={errors.confirmPassword ? 'error' : ''}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <div className="field-error">
              {errors.confirmPassword.join(', ')}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;