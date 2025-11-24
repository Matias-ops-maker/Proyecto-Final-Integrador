import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api.js';
import '../../styles/auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', formData);

      if (response.data && response.data.token) {
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (response.data.user.rol === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      
      if (err.response) {
        
        const status = err.response.status;
        const errorMessage = err.response.data?.error || err.response.data?.message;
        
        if (status === 400) {
          setError(errorMessage || 'Datos de entrada inválidos');
        } else if (status === 401) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (status === 429) {
          setError('Demasiados intentos. Intenta de nuevo más tarde.');
        } else if (status >= 500) {
          setError('Error del servidor. Intenta de nuevo más tarde.');
        } else {
          setError(errorMessage || 'Error al iniciar sesión');
        }
      } else if (err.request) {
        
        setError('No se puede conectar al servidor. Verifica tu conexión e intenta de nuevo.');
      } else {
        
        setError('Error inesperado. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="back-link">← Volver al inicio</Link>
          <h1>🏪 RepuestosAuto</h1>
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta para gestionar tus compras</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-links">
          <p>¿No tienes cuenta? <Link to="/auth/register">Regístrate aquí</Link></p>
          <p><Link to="/auth/forgot">¿Olvidaste tu contraseña?</Link></p>
        </div>

        <div className="demo-accounts">
          <h4>🧪 Cuentas de prueba:</h4>
          <div className="demo-list">
            <div className="demo-account">
              <strong>👤 Usuario:</strong> juan@gmail.com / user123
            </div>
            <div className="demo-account">
              <strong>🔐 Admin:</strong> admin@repuestos.com / admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

