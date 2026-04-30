import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import './LoginPage.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(loginForm.email, loginForm.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Error en el login');
      }
    } catch (err) {
      setError(err.message || 'Error en la petición');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.register(
        registerForm.userName,
        registerForm.email,
        registerForm.password,
        registerForm.confirmPassword
      );
      if (result.success) {
        setError('');
        setIsLogin(true);
        setLoginForm({
          email: registerForm.email,
          password: registerForm.password,
        });
      } else {
        setError(result.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err.message || 'Error en la petición');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">TicketingApp</h1>
        
        {error && <div className="error-message">{error}</div>}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <h2>Iniciar Sesión</h2>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                placeholder="Tu contraseña"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <p className="toggle-form">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="link-button"
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <h2>Registrarse</h2>

            <div className="form-group">
              <label htmlFor="userName">Nombre de Usuario</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={registerForm.userName}
                onChange={handleRegisterChange}
                required
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Correo Electrónico</label>
              <input
                type="email"
                id="register-email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Contraseña</label>
              <input
                type="password"
                id="register-password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
                placeholder="Crea una contraseña"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                required
                placeholder="Confirma tu contraseña"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <p className="toggle-form">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="link-button"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
