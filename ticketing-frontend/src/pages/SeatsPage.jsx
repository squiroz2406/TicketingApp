import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import SeatGrid from "../components/SeatGrid";
import "./SeatsPage.css";

// Datos de prueba para butacas con disposición de cine (50 butacas)
const generateMockSeats = (eventId) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 10; // 5 a cada lado del pasillo central
  
  for (let row of rows) {
    for (let col = 1; col <= seatsPerRow; col++) {
      const seatNumber = `${row}${col}`;
      // Hacer algunos asientos disponibles, algunos ocupados
      const status = Math.random() > 0.6 ? 'occupied' : 'available';
      
      seats.push({
        id: `${eventId}-${seatNumber}`,
        seatNumber,
        row,
        col,
        status,
        price: 50,
        eventId
      });
    }
  }
  
  return seats;
};

export default function SeatsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos = 300 segundos

  const loadSeats = () => {
    api.get(`/events/${eventId}/seats`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSeats(res.data);
        } else {
          // Si no hay datos del API, usa datos de prueba
          setSeats(generateMockSeats(eventId));
        }
      })
      .catch(err => {
        // Si hay error, usa datos de prueba
        console.warn("No se pudo conectar al API de butacas, usando datos de prueba", err);
        setSeats(generateMockSeats(eventId));
      })
      .finally(() => setLoading(false));
  };

  // Temporizador de 5 minutos
  useEffect(() => {
    loadSeats();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Cuando llega a 0, redirigir
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [eventId, navigate]);

  // Calcular total de butacas seleccionadas
  const totalPrice = selectedSeats.length * 50;

  // Convertir segundos a formato MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Determinar color del temporizador según el tiempo restante
  const getTimerColor = () => {
    if (timeLeft <= 60) return '#f5576c'; // Rojo si menos de 1 minuto
    if (timeLeft <= 120) return '#ff9800'; // Naranja si menos de 2 minutos
    return '#4CAF50'; // Verde
  };

  return (
    <div className="seats-container">
      {/* Header */}
      <div className="seats-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
        <h1>🎬 Selecciona tus Butacas</h1>
        
        {/* Temporizador */}
        <div className="timer" style={{ borderColor: getTimerColor(), color: getTimerColor() }}>
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeLeft)}</span>
          <span className="timer-label">Tiempo restante</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="legend">
        <div className="legend-item">
          <div className="seat-legend available"></div>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend selected"></div>
          <span>Seleccionada</span>
        </div>
        <div className="legend-item">
          <div className="seat-legend occupied"></div>
          <span>Ocupada</span>
        </div>
      </div>

      {/* Pantalla */}
      <div className="screen">
        <p>🎥 PANTALLA 🎥</p>
      </div>

      {/* Grid de butacas */}
      <div className="seat-grid-wrapper">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Cargando butacas...</p>
        ) : seats.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No hay butacas disponibles</p>
        ) : (
          <div className="cinema-layout">
            {['A', 'B', 'C', 'D', 'E'].map(row => (
              <div key={row} className="cinema-row">
                <span className="row-label">{row}</span>
                
                {/* Lado izquierdo del pasillo (5 asientos) */}
                <div className="seats-section left">
                  {seats.filter(s => s.row === row && s.col <= 5).map(seat => (
                    <button
                      key={seat.id}
                      className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                      onClick={() => {
                        if (seat.status === 'available') {
                          setSelectedSeats(prev =>
                            prev.includes(seat.seatNumber)
                              ? prev.filter(s => s !== seat.seatNumber)
                              : [...prev, seat.seatNumber]
                          );
                        }
                      }}
                      disabled={seat.status === 'occupied'}
                      title={seat.seatNumber}
                    >
                      {seat.col}
                    </button>
                  ))}
                </div>

                {/* Pasillo central */}
                <div className="aisle"></div>

                {/* Lado derecho del pasillo (5 asientos) */}
                <div className="seats-section right">
                  {seats.filter(s => s.row === row && s.col > 5).map(seat => (
                    <button
                      key={seat.id}
                      className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                      onClick={() => {
                        if (seat.status === 'available') {
                          setSelectedSeats(prev =>
                            prev.includes(seat.seatNumber)
                              ? prev.filter(s => s !== seat.seatNumber)
                              : [...prev, seat.seatNumber]
                          );
                        }
                      }}
                      disabled={seat.status === 'occupied'}
                      title={seat.seatNumber}
                    >
                      {seat.col}
                    </button>
                  ))}
                </div>

                <span className="row-label">{row}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="booking-summary">
        <div className="summary-content">
          <div className="seats-info">
            <p>Butacas seleccionadas: <strong>{selectedSeats.length}</strong></p>
            <p>Butacas: <strong>{selectedSeats.join(', ') || 'Ninguna'}</strong></p>
            <p>Total a pagar: <strong>${totalPrice.toFixed(2)}</strong></p>
          </div>
          <button className="confirm-btn" disabled={selectedSeats.length === 0}>
            Confirmar Compra (${totalPrice.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}