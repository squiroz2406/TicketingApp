import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>🎬 CinemaTickets</h1>
        </div>
        <div className="navbar-user">
          {user && <span className="user-email">{user.email}</span>}
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
