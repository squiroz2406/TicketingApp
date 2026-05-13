import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { authService } from "../api/authService";
import { reservationService } from "../api/reservationService";
import Navbar from "../components/Navbar";
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
  const { sectorId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null);
  const [reservationMessage, setReservationMessage] = useState('');
  const [reservationError, setReservationError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos = 300 segundos
  const refreshIntervalRef = useRef(null);

  const mapSeatStatus = (backendStatus) => {
    if (!backendStatus) return 'available';
    const status = backendStatus.toLowerCase();
    if (status === 'available') return 'available';
    if (status === 'reserved') return 'occupied';
    if (status === 'sold') return 'occupied';
    return 'occupied';
  };

  const loadSeats = () => {
    api.get(`/sectors/${sectorId}/seats`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSeats(res.data.map(seat => ({
            id: seat.id,
            row: seat.row,
            col: seat.col,
            seatNumber: seat.seatNumber,
            status: mapSeatStatus(seat.status),
            sectorId: seat.sectorId
          })));
        } else {
          setSeats(generateMockSeats(sectorId));
        }
      })
      .catch(err => {
        console.warn("No se pudo conectar al API de butacas, usando datos de prueba", err);
        setSeats(generateMockSeats(sectorId));
      })
      .finally(() => setLoading(false));
  };

  // Temporizador de 5 minutos + Auto-refresh de asientos
  useEffect(() => {
    loadSeats();

    // Polling cada 3 segundos para actualizar disponibilidad
    refreshIntervalRef.current = setInterval(() => {
      api.get(`/sectors/${sectorId}/seats`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            const updatedSeats = res.data.map(seat => ({
              id: seat.id,
              row: seat.row,
              col: seat.col,
              seatNumber: seat.seatNumber,
              status: mapSeatStatus(seat.status),
              sectorId: seat.sectorId
            }));
            
            // Verificar si algún asiento seleccionado ahora está ocupado
            const nowOccupied = selectedSeats.filter(selected => 
              updatedSeats.some(s => s.id === selected.id && s.status === 'occupied')
            );
            
            if (nowOccupied.length > 0) {
              // Remover asientos que ahora están ocupados de la selección
              setSelectedSeats(prev => prev.filter(item => 
                !nowOccupied.some(occ => occ.id === item.id)
              ));
              console.warn(`Asiento(s) ${nowOccupied.map(s => s.label).join(', ')} ya fue/fueron reservado(s)`);
            }
            
            setSeats(updatedSeats);
          }
        })
        .catch(err => console.warn("Error al actualizar asientos", err));
    }, 3000);

    // Timer para el countdown de 5 minutos
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      clearInterval(countdownTimer);
    };
  }, [sectorId, navigate, selectedSeats]);

  const totalPrice = selectedSeats.length * 50;

  const reserveSelectedSeats = async () => {
    if (selectedSeats.length === 0) return;
    setReservationError('');
    setReservationMessage('');

    const user = authService.getUser();
    if (!user?.id || user.id === 0) {
      setReservationError('Usuario no autenticado o userId inválido. Inicia sesión de nuevo.');
      return;
    }

    // Validar que los asientos siguen disponibles antes de reservar
    const currentSeats = new Map(seats.map(s => [s.id, s]));
    const unavailable = selectedSeats.filter(selected => {
      const current = currentSeats.get(selected.id);
      return current && current.status === 'occupied';
    });

    if (unavailable.length > 0) {
      setReservationError(`Los asientos ${unavailable.map(s => s.label).join(', ')} ya fueron reservados.`);
      setSelectedSeats([]);
      return;
    }

    setIsReserving(true);
    try {
      const seatIds = selectedSeats.map(seat => seat.id);
      const response = await reservationService.createReservation(seatIds, user.id);

      if (response.success) {
        setPendingReservation({
          id: response.reservationId,
          seatLabels: selectedSeats.map(seat => seat.label),
          totalPrice,
        });
        setReservationMessage(`Reserva creada correctamente. Reserva ID: ${response.reservationId}`);
        setSelectedSeats([]);
      } else {
        setReservationError(response.message || 'No se pudo crear la reserva.');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setReservationError('Conflicto: Algunas butacas ya estaban reservadas. Intenta de nuevo.');
      } else {
        setReservationError(err.response?.data?.message || 'Error al reservar las butacas.');
      }
      loadSeats();
    } finally {
      setIsReserving(false);
    }
  };

  const confirmPendingReservation = async () => {
    if (!pendingReservation?.id) {
      setReservationError('No hay reserva pendiente para confirmar.');
      return;
    }

    const user = authService.getUser();
    if (!user?.id || user.id === 0) {
      setReservationError('Usuario no autenticado o userId inválido. Inicia sesión de nuevo.');
      return;
    }

    setReservationError('');
    setReservationMessage('');
    setIsConfirming(true);

    try {
      const response = await reservationService.confirmReservation(pendingReservation.id, user.id);
      if (response.success) {
        setReservationMessage('✅ Reserva confirmada correctamente.');
        setPendingReservation(null);
        setSelectedSeats([]);
        loadSeats();
        // Redirigir a eventos después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setReservationError(response.message || 'No se pudo confirmar la reserva.');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setReservationError(err.response?.data?.message || 'Reserva no pudo confirmarse, probablemente ya expiró.');
      } else if (err.response?.status === 400) {
        setReservationError(err.response?.data?.message || 'ID de reserva inválido.');
      } else {
        setReservationError(err.response?.data?.message || 'Error al confirmar la reserva.');
      }
      loadSeats();
    } finally {
      setIsConfirming(false);
    }
  };

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
    <>
      <Navbar />
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
                  {seats.filter(s => s.row === row && s.col <= 5).sort((a, b) => a.col - b.col).map(seat => {
                    const isSelected = selectedSeats.some(item => item.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        className={`seat ${seat.status} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (seat.status === 'available') {
                            setSelectedSeats(prev =>
                              prev.some(item => item.id === seat.id)
                                ? prev.filter(item => item.id !== seat.id)
                                : [...prev, { id: seat.id, label: seat.seatNumber }]
                            );
                          } else if (seat.status === 'occupied') {
                            // Mostrar que el asiento ahora está ocupado
                            alert(`❌ Este asiento (${seat.seatNumber}) ya fue reservado`);
                          }
                        }}
                        disabled={seat.status === 'occupied'}
                        title={seat.seatNumber}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
                </div>

                {/* Pasillo central */}
                <div className="aisle"></div>

                {/* Lado derecho del pasillo (5 asientos) */}
                <div className="seats-section right">
                  {seats.filter(s => s.row === row && s.col > 5).sort((a, b) => a.col - b.col).map(seat => {
                    const isSelected = selectedSeats.some(item => item.id === seat.id);
                    return (
                      <button
                        key={seat.id}
                        className={`seat ${seat.status} ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (seat.status === 'available') {
                            setSelectedSeats(prev =>
                              prev.some(item => item.id === seat.id)
                                ? prev.filter(item => item.id !== seat.id)
                                : [...prev, { id: seat.id, label: seat.seatNumber }]
                            );
                          } else if (seat.status === 'occupied') {
                            alert(`❌ Este asiento (${seat.seatNumber}) ya fue reservado`);
                          }
                        }}
                        disabled={seat.status === 'occupied'}
                        title={seat.seatNumber}
                      >
                        {seat.col}
                      </button>
                    );
                  })}
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
            <p>Butacas: <strong>{selectedSeats.map(seat => seat.label).join(', ') || 'Ninguna'}</strong></p>
            <p>Total a pagar: <strong>${totalPrice.toFixed(2)}</strong></p>
            {pendingReservation && (
              <div style={{ marginTop: '12px', color: '#333' }}>
                <p><strong>Reserva pendiente:</strong> {pendingReservation.id}</p>
                <p><strong>Butacas reservadas:</strong> {pendingReservation.seatLabels.join(', ')}</p>
              </div>
            )}
            {reservationMessage && (
              <p style={{ marginTop: '12px', color: '#22a55d' }}>{reservationMessage}</p>
            )}
            {reservationError && (
              <p style={{ marginTop: '12px', color: '#f44336' }}>{reservationError}</p>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
            <button
              className="confirm-btn"
              disabled={selectedSeats.length === 0 || isReserving || !!pendingReservation}
              onClick={reserveSelectedSeats}
            >
              {isReserving ? 'Reservando...' : `Reservar butacas ($${totalPrice.toFixed(2)})`}
            </button>

            {pendingReservation && (
              <button
                className="confirm-btn"
                disabled={isConfirming}
                onClick={confirmPendingReservation}
                style={{ background: '#f5576c' }}
              >
                {isConfirming ? 'Confirmando...' : 'Confirmar reserva'}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}