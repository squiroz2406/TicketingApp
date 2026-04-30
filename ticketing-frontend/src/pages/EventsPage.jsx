import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import "./EventsPage.css";

const POSTER_MAP = {
  "Dune: Parte Dos": "https://image.tmdb.org/t/p/w342/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  "Oppenheimer": "https://xl.movieposterdb.com/23_07/2023/15398776/xl_oppenheimer-movie-poster_3a0195ae.jpg?v=2024-11-02%2011:42:33",
  "Killers of the Flower Moon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsL84KStwCnaLjZEVGF7-WcC0cyMFp44Y45w&s",
  "Barbie": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKueimb5cxvI_C6Qg0XcjUzeuxopacmEmVA&s",
  "Godzilla x Kong": "https://image.tmdb.org/t/p/w342/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
  "Avatar 3": "https://image.tmdb.org/t/p/w342/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  "The Flash": "https://static.posters.cz/image/1300/183184.jpg",
  "Spider-Man: Beyond the Spider-Verse": "https://posterspy.com/wp-content/uploads/2025/10/beyondspy.jpg",
  "The Batman": "https://image.tmdb.org/t/p/w342/74xTEgt7R36Fpooo50r9T25onhq.jpg",
  "Top Gun: Maverick": "https://image.tmdb.org/t/p/w342/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
  "Guardians of the Galaxy Vol. 3": "https://image.tmdb.org/t/p/w342/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
  "Black Panther: Wakanda Forever": "https://image.tmdb.org/t/p/w342/sv1xJUazXeYqALzczSZ3O6nkH75.jpg"
};

const CATEGORY_MAP = {
  "Dune: Parte Dos": "Acción",
  "Oppenheimer": "Drama",
  "Killers of the Flower Moon": "Drama",
  "Barbie": "Comedia",
  "Godzilla x Kong": "Acción",
  "Avatar 3": "Acción",
  "The Flash": "Acción",
  "Spider-Man: Beyond the Spider-Verse": "Acción",
  "The Batman": "Acción",
  "Top Gun: Maverick": "Acción",
  "Guardians of the Galaxy Vol. 3": "Acción",
  "Black Panther: Wakanda Forever": "Acción"
};

const CATEGORIES = ["Todos", "Acción", "Drama", "Comedia"];

const createMockSectors = (eventId) => [
  { id: eventId * 10 + 1, name: "14:30", price: 70.0, capacity: 50 },
  { id: eventId * 10 + 2, name: "20:30", price: 90.0, capacity: 50 }
];

const MOCK_EVENTS = [
  {
    id: 1,
    nombre: "Dune: Parte Dos",
    fecha: new Date(2026, 4, 15, 20, 30),
    poster: POSTER_MAP["Dune: Parte Dos"],
    venue: "Sala 1",
    category: CATEGORY_MAP["Dune: Parte Dos"],
    sectors: createMockSectors(1)
  },
  {
    id: 2,
    nombre: "Oppenheimer",
    fecha: new Date(2026, 4, 16, 19, 0),
    poster: POSTER_MAP["Oppenheimer"],
    venue: "Sala 2",
    category: CATEGORY_MAP["Oppenheimer"],
    sectors: createMockSectors(2)
  },
  {
    id: 3,
    nombre: "Killers of the Flower Moon",
    fecha: new Date(2026, 4, 17, 21, 0),
    poster: POSTER_MAP["Killers of the Flower Moon"],
    venue: "Sala 3",
    category: CATEGORY_MAP["Killers of the Flower Moon"],
    sectors: createMockSectors(3)
  },
  {
    id: 4,
    nombre: "Barbie",
    fecha: new Date(2026, 4, 18, 18, 30),
    poster: POSTER_MAP["Barbie"],
    venue: "Sala 1",
    category: CATEGORY_MAP["Barbie"],
    sectors: createMockSectors(4)
  },
  {
    id: 5,
    nombre: "Godzilla x Kong",
    fecha: new Date(2026, 4, 19, 20, 0),
    poster: POSTER_MAP["Godzilla x Kong"],
    venue: "Sala 2",
    category: CATEGORY_MAP["Godzilla x Kong"],
    sectors: createMockSectors(5)
  },
  {
    id: 6,
    nombre: "Avatar 3",
    fecha: new Date(2026, 4, 20, 22, 0),
    poster: POSTER_MAP["Avatar 3"],
    venue: "Sala 4",
    category: CATEGORY_MAP["Avatar 3"],
    sectors: createMockSectors(6)
  },
  {
    id: 7,
    nombre: "The Flash",
    fecha: new Date(2026, 4, 21, 17, 0),
    poster: POSTER_MAP["The Flash"],
    venue: "Sala 5",
    category: CATEGORY_MAP["The Flash"],
    sectors: createMockSectors(7)
  },
  {
    id: 8,
    nombre: "Spider-Man: Beyond the Spider-Verse",
    fecha: new Date(2026, 4, 22, 20, 30),
    poster: POSTER_MAP["Spider-Man: Beyond the Spider-Verse"],
    venue: "Sala 3",
    category: CATEGORY_MAP["Spider-Man: Beyond the Spider-Verse"],
    sectors: createMockSectors(8)
  },
  {
    id: 9,
    nombre: "The Batman",
    fecha: new Date(2026, 4, 23, 19, 30),
    poster: POSTER_MAP["The Batman"],
    venue: "Sala 6",
    category: CATEGORY_MAP["The Batman"],
    sectors: createMockSectors(9)
  },
  {
    id: 10,
    nombre: "Top Gun: Maverick",
    fecha: new Date(2026, 4, 24, 21, 0),
    poster: POSTER_MAP["Top Gun: Maverick"],
    venue: "Sala 7",
    category: CATEGORY_MAP["Top Gun: Maverick"],
    sectors: createMockSectors(10)
  },
  {
    id: 11,
    nombre: "Guardians of the Galaxy Vol. 3",
    fecha: new Date(2026, 4, 25, 18, 0),
    poster: POSTER_MAP["Guardians of the Galaxy Vol. 3"],
    venue: "Sala 8",
    category: CATEGORY_MAP["Guardians of the Galaxy Vol. 3"],
    sectors: createMockSectors(11)
  },
  {
    id: 12,
    nombre: "Black Panther: Wakanda Forever",
    fecha: new Date(2026, 4, 26, 20, 0),
    poster: POSTER_MAP["Black Panther: Wakanda Forever"],
    venue: "Sala 9",
    category: CATEGORY_MAP["Black Panther: Wakanda Forever"],
    sectors: createMockSectors(12)
  }
];

const getPoster = (name) => POSTER_MAP[name] || "";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getEventCategory = (name) => CATEGORY_MAP[name] || "General";

  const createEventFromApi = (event) => ({
    id: event.id,
    nombre: event.name,
    fecha: event.eventDate,
    poster: getPoster(event.name),
    venue: event.venue,
    category: getEventCategory(event.name),
    sectors: event.sectors || []
  });

  useEffect(() => {
    api.get("/events")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setEvents(res.data.map(createEventFromApi));
        } else {
          setEvents([]);
        }
      })
      .catch(err => {
        console.warn("No se pudo conectar al API, usando datos de prueba", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = selectedCategory === "Todos"
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="events-container">
      {/* Header del Cine */}
      <div className="cinema-header">
        <h1>🎬 CinemaTickets</h1>
        <p>Reserva tus entradas ahora</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid de Películas */}
      <div className="events-grid">
        {loading ? (
          <p className="no-events">Cargando películas...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="no-events">No hay películas disponibles para esta categoría</p>
        ) : (
          filteredEvents.map(e => (
            <div key={e.id} className="event-card" onClick={() => navigate(`/events/${e.id}/sectors`)}>
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
                  <span className="genre">{e.category || 'General'}</span>
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
                  ⏰ {e.sectors?.map(sector => sector.name).join(' • ') || 'Horario no disponible'}
                </p>

                <div className="availability">
                  <div className="seats-available">
                    {(() => {
                      const totalCapacity = e.sectors?.reduce((total, sector) => total + (sector.capacity ?? 0), 0) || 0;
                      const totalAvailable = e.sectors?.reduce((total, sector) => total + (sector.availableSeats ?? 0), 0) || 0;
                      const percentageAvailable = totalCapacity > 0 ? Math.round((totalAvailable / totalCapacity) * 100) : 0;
                      return (
                        <>
                          <span className="available-count">{totalAvailable} butacas disponibles</span>
                          <div className="availability-bar">
                            <div className="filled" style={{ width: `${percentageAvailable}%` }}></div>
                          </div>
                        </>
                      );
                    })()}
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