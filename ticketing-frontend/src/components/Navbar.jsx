import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { purchaseService } from '../api/purchaseService';
import { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadPurchaseHistory();
    }
  }, [user?.id]);

  const loadPurchaseHistory = () => {
    try {
      const purchases = purchaseService.getLatestPurchases(user.id, 3);
      setPurchaseHistory(purchases);
    } catch (error) {
      console.warn("Error loading purchases:", error);
      setPurchaseHistory([]);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleViewAllPurchases = () => {
    navigate('/purchase-history');
  };

  // Re-load purchases when the page comes into focus (for real-time updates)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        loadPurchaseHistory();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id]);

  return (
    <BootstrapNavbar bg="dark" expand="lg" sticky="top" className="navbar-custom">
      <Container fluid>
        <BootstrapNavbar.Brand href="/" className="brand-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CineMark Pro</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {user && (
              <>
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle 
                    variant="dark" 
                    id="dropdown-history"
                    className="dropdown-toggle-custom"
                  >
                    <i className="bi bi-ticket-perforated"></i> Mis compras
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-dark dropdown-custom">
                    <Dropdown.Header className="text-warning">
                      Mis Compras Recientes
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    
                    {purchaseHistory.length > 0 ? (
                      purchaseHistory.map((purchase) => (
                        <Dropdown.Item key={purchase.id} className="purchase-item">
                          <div className="purchase-details">
                            <div className="movie-title">{purchase.movie}</div>
                            <div className="purchase-info">
                              <small className="time">🕐 {purchase.time || 'Sin horario'}</small>
                              <small className="date">📅 {purchase.date}</small>
                              <small className="seats">🎫 {purchase.seats}</small>
                              <small className="price text-warning">${purchase.price}</small>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled>No hay compras registradas</Dropdown.Item>
                    )}
                    
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleViewAllPurchases} className="view-all">
                      Ver todas las compras →
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle 
                    variant="dark" 
                    id="dropdown-user"
                    className="dropdown-toggle-custom user-toggle"
                  >
                    <i className="bi bi-person-circle"></i> {user.email?.split('@')[0]}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-dark dropdown-custom">
                    <Dropdown.Header>
                      {user.email}
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/profile">
                      <i className="bi bi-person"></i> Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item href="#/settings">
                      <i className="bi bi-gear"></i> Configuración
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
