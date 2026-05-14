import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
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
    <div className="login-page">
      {/* Background elements */}
      <div className="login-background">
        <div className="cinema-reel-1"></div>
        <div className="cinema-reel-2"></div>
        <div className="cinema-reel-3"></div>
      </div>

      <Container className="login-container">
        <Row className="align-items-center justify-content-center min-vh-100">
          <Col md={8} lg={6} xl={5}>
            <div className="login-card">
              {/* Logo/Header */}
              <div className="login-header">
                <div className="logo-cinema">🎬</div>
                <h1 className="cinema-name">CineMark Pro</h1>
                <p className="tagline">Tu cine favorito en línea</p>
              </div>

              {error && (
                <Alert variant="danger" className="auth-alert" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-circle"></i> {error}
                </Alert>
              )}


              {isLogin ? (
                <Form onSubmit={handleLoginSubmit} className="auth-form">
                  <h2 className="form-title">Iniciar Sesión</h2>

                  <Form.Group className="form-group-custom mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="tu@email.com"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-custom mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                      placeholder="Tu contraseña"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-auth-primary w-100 mb-2"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      '→ Iniciar Sesión'
                    )}
                  </Button>


                  <div className="toggle-form-section">
                    <p className="toggle-text">¿No tienes cuenta?</p>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                        setError('');
                      }}
                      className="btn-link-auth"
                    >
                      Regístrate aquí →
                    </Button>
                  </div>
                </Form>
              ) : (
                <Form onSubmit={handleRegisterSubmit} className="auth-form">
                  <h2 className="form-title">Crear Cuenta</h2>

                  <Form.Group className="form-group-custom mb-3">
                    <Form.Label>Nombre de Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="userName"
                      value={registerForm.userName}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Tu nombre de usuario"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-custom mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                      placeholder="tu@email.com"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-custom mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Crea una contraseña"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-custom mb-4">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      placeholder="Confirma tu contraseña"
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-auth-primary w-100 mb-3"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Registrando...
                      </>
                    ) : (
                      '→ Registrarse'
                    )}
                  </Button>

                  <div className="toggle-form-section">
                    <p className="toggle-text">¿Ya tienes cuenta?</p>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setError('');
                      }}
                      className="btn-link-auth"
                    >
                      Inicia sesión aquí →
                    </Button>
                  </div>
                </Form>
              )}

              {/* Footer */}
              <div className="login-footer">
                <p>🎫 Reserva tus entradas al cine de manera fácil y rápida</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
