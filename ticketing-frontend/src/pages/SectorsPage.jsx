import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
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
    <div className="events-container">
      <div className="cinema-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
        <h1>Selecciona un horario</h1>
        <p>Elige el sector/hora para la película</p>
      </div>

      {loading ? (
        <p className="no-events">Cargando horarios...</p>
      ) : sectors.length === 0 ? (
        <p className="no-events">No hay horarios disponibles para este evento</p>
      ) : (
        <div className="events-grid">
          {sectors.map(sector => (
            <div key={sector.id} className="event-card" onClick={() => navigate(`/sectors/${sector.id}/seats`)}>
              <div className="movie-info">
                <h3>Horario: {sector.name}</h3>
                <p>Precio: ${sector.price.toFixed(2)}</p>
                <p>Capacidad: {sector.capacity} butacas</p>
                <button className="buy-btn">Ver butacas</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
