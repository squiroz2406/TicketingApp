import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

// Datos de prueba - Se muestran si el API no responde
const MOCK_EVENTS = [
  {
    id: 1,
    nombre: "Dune: Parte Dos",
    fecha: new Date(2026, 4, 15, 20, 30),
    poster: "https://image.tmdb.org/t/p/w342/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
  },
  {
    id: 2,
    nombre: "Oppenheimer",
    fecha: new Date(2026, 4, 16, 19, 0),
    poster: "https://xl.movieposterdb.com/23_07/2023/15398776/xl_oppenheimer-movie-poster_3a0195ae.jpg?v=2024-11-02%2011:42:33"
  },
  {
    id: 3,
    nombre: "Killers of the Flower Moon",
    fecha: new Date(2026, 4, 17, 21, 0),
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsL84KStwCnaLjZEVGF7-WcC0cyMFp44Y45w&s"
  },
  {
    id: 4,
    nombre: "Barbie",
    fecha: new Date(2026, 4, 18, 18, 30),
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKueimb5cxvI_C6Qg0XcjUzeuxopacmEmVA&s"
  },
  {
    id: 5,
    nombre: "Godzilla x Kong",
    fecha: new Date(2026, 4, 19, 20, 0),
    poster: "https://image.tmdb.org/t/p/w342/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg"
  },
  {
    id: 6,
    nombre: "Avatar 3",
    fecha: new Date(2026, 4, 20, 22, 0),
    poster: "https://image.tmdb.org/t/p/w342/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setEvents(res.data);
        } else {
          // Si el API no retorna datos, usa datos de prueba
          setEvents(MOCK_EVENTS);
        }
      })
      .catch(err => {
        // Si hay error en el API, usa datos de prueba
        console.warn("No se pudo conectar al API, usando datos de prueba", err);
        setEvents(MOCK_EVENTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="events-container">
      {/* Header del Cine */}
      <div className="cinema-header">
        <h1>🎬 CinemaTickets</h1>
        <p>Reserva tus entradas ahora</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <button className="filter-btn active">Todos</button>
        <button className="filter-btn">Acción</button>
        <button className="filter-btn">Drama</button>
        <button className="filter-btn">Comedia</button>
      </div>

      {/* Grid de Películas */}
      <div className="events-grid">
        {loading ? (
          <p className="no-events">Cargando películas...</p>
        ) : events.length === 0 ? (
          <p className="no-events">No hay películas disponibles</p>
        ) : (
          events.map(e => (
            <div key={e.id} className="event-card" onClick={() => navigate(`/events/${e.id}/seats`)}>
              {/* Poster */}
              <div className="movie-poster">
                {e.poster ? (
                  <img src={e.poster} alt={e.nombre} className="poster-image" onError={(img) => img.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="342" height="513"%3E%3Crect fill="%23667eea" width="342" height="513"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="white"%3E🎬%3C/text%3E%3C/svg%3E'} />
                ) : (
                  <div className="poster-placeholder">🎭</div>
                )}
              </div>

              <div className="movie-info">
                <h3>{e.nombre}</h3>
                
                <div className="movie-details">
                  <span className="rating">PG-13</span>
                  <span className="genre">Thriller</span>
                </div>

                <p className="date-time">
                  📅 {new Date(e.fecha).toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                <p className="showtimes">
                  ⏰ 14:30 • 17:00 • 20:30 • 23:00
                </p>

                <div className="availability">
                  <div className="seats-available">
                    <span className="available-count">50 butacas</span>
                    <div className="availability-bar">
                      <div className="filled" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <button className="buy-btn">Comprar Entradas</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}