import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import Navbar from "../components/Navbar";
import "./EventsPage.css";

export default function SectorsPage() {
  const { eventId } = useParams();
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events/${eventId}/sectors`)
      .then(res => {
        setSectors(res.data || []);
      })
      .catch(() => {
        setSectors([]);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  return (
    <>
      <Navbar />
      <div className="events-container">
        {/* Hero Section */}
        <div className="cinema-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Selecciona tu Horario</h1>
            <p className="hero-subtitle">Elige el sector y hora perfecta para disfrutar la película</p>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ position: 'relative', marginTop: '-60px', paddingLeft: '2rem', zIndex: 10 }}>
          <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
        </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.1rem' }}>Cargando horarios...</p>
        </div>
      ) : sectors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p style={{ fontSize: '1.1rem' }}>No hay horarios disponibles para este evento</p>
        </div>
      ) : (
        <div style={{ padding: '2rem' }}>
          <div className="sectors-grid">
            {sectors.map(sector => (
              <div key={sector.id} className="sector-card" onClick={() => navigate(`/sectors/${sector.id}/seats`)}>
                <div className="sector-header">
                  <h3 className="sector-name">{sector.name}</h3>
                  <div className="sector-price-badge">${sector.price.toFixed(2)}</div>
                </div>
                <div className="sector-details">
                  <div className="detail-item">
                    <span className="detail-icon">🪑</span>
                    <div>
                      <p className="detail-label">Capacidad</p>
                      <p className="detail-value">{sector.capacity} butacas</p>
                    </div>
                  </div>
                </div>
                <button className="sector-button">Ver Disponibilidad</button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
