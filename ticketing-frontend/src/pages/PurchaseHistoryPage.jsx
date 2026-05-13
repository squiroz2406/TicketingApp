import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authService } from "../api/authService";
import { purchaseService } from "../api/purchaseService";
import { Container, Button, Spinner, Card } from "react-bootstrap";
import "./PurchaseHistoryPage.css";

export default function PurchaseHistoryPage() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const loadPurchases = () => {
      try {
        const userPurchases = purchaseService.getUserPurchases(user.id);
        setPurchases(userPurchases);
      } catch (error) {
        console.warn("Error loading purchases:", error);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [user, navigate]);

  const downloadReceipt = (purchase) => {
    const receiptHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante - ${purchase.movie}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #0f3460;
      color: #1a1a2e;
      margin: 0;
      padding: 20px;
    }
    .receipt {
      background: white;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      border-top: 5px solid #d4165f;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #ffc107;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #d4165f;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      color: #1a1a2e;
      margin: 0;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #d4165f;
      text-transform: uppercase;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .label {
      color: #666;
      font-weight: 500;
    }
    .value {
      color: #1a1a2e;
      font-weight: bold;
    }
    .movie-name {
      font-size: 18px;
      color: #d4165f;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .price-total {
      background: #ffc107;
      color: #1a1a2e;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      border-top: 2px solid #ffc107;
      padding-top: 20px;
      margin-top: 30px;
      font-size: 12px;
      color: #666;
    }
    .qr-placeholder {
      text-align: center;
      margin: 20px 0;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">🎬 CineMark Pro</div>
      <h1 class="title">COMPROBANTE DE COMPRA</h1>
    </div>
    
    <div class="section">
      <div class="section-title">Película</div>
      <div class="movie-name">${purchase.movie}</div>
    </div>

    <div class="section">
      <div class="section-title">Detalles de la Compra</div>
      <div class="info-row">
        <span class="label">Horario:</span>
        <span class="value">${purchase.time || 'No especificado'}</span>
      </div>
      <div class="info-row">
        <span class="label">Fecha de Compra:</span>
        <span class="value">${purchase.date}</span>
      </div>
      <div class="info-row">
        <span class="label">Butacas:</span>
        <span class="value">${purchase.seats}</span>
      </div>
      <div class="info-row">
        <span class="label">Cantidad de Entradas:</span>
        <span class="value">${purchase.seats.split(',').length}</span>
      </div>
    </div>

    <div class="price-total">
      Total: $${purchase.price}
    </div>

    <div class="section">
      <div class="section-title">ID de Transacción</div>
      <div class="info-row">
        <span class="label">ID:</span>
        <span class="value">${purchase.id}</span>
      </div>
    </div>

    <div class="footer">
      <p>Comprobante generado el ${new Date().toLocaleString('es-AR')}</p>
      <p>Gracias por su compra en CineMark Pro</p>
      <p>Presentar este comprobante en la sala de cine</p>
    </div>
  </div>
</body>
</html>
    `;

    // Crear blob y descargar
    const blob = new Blob([receiptHTML], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Comprobante-${purchase.movie.replace(/\s+/g, '-')}-${purchase.date}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="purchase-history-page">
        <Container className="py-5">
          <div className="history-header">
            <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
            <h1> Historial de Compras</h1>
            <p className="user-info">Usuario: <strong>{user.email}</strong></p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-3">Cargando historial...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="empty-state">
              <p className="no-purchases">No tienes compras registradas</p>
              <Button 
                variant="danger" 
                size="lg"
                onClick={() => navigate('/')}
              >
                Ir a comprar entradas
              </Button>
            </div>
          ) : (
            <div className="purchases-grid">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="purchase-card">
                  <Card.Body>
                    <div className="purchase-content">
                      <div className="movie-info">
                        <h5 className="movie-name">{purchase.movie}</h5>
                        <div className="purchase-meta">
                          <span className="meta-badge time">🕐 {purchase.time || 'Sin horario'}</span>
                          <span className="meta-badge date">📅 {purchase.date}</span>
                          <span className="meta-badge seats">🎫 {purchase.seats}</span>
                        </div>
                      </div>
                      <div className="price-section">
                        <span className="price-label">Total</span>
                        <span className="price-amount">${purchase.price}</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="download-btn"
                        onClick={() => downloadReceipt(purchase)}
                      >
                        📥 Descargar Comprobante
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
