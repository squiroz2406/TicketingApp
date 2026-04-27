import api from "../api/client";

export default function SeatGrid({ seats, reload }) {

  const reservar = async (seatId) => {
    try {
      await api.post("/reservations", {
        seatId: seatId,
        userId: 1
      });

      alert("Reserva exitosa");
      reload();

    } catch (err) {
      if (err.response?.status === 409) {
        alert("Butaca ocupada");
      } else {
        alert("Error");
      }
    }
  };

  const getColor = (estado) => {
    switch (estado) {
      case 0: return "green";     // available
      case 1: return "orange";    // reserved
      case 2: return "red";       // sold
      default: return "gray";
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)" }}>
      {seats.map(seat => (
        <div
          key={seat.id}
          onClick={() => reservar(seat.id)}
          style={{
            width: 35,
            height: 35,
            margin: 3,
            backgroundColor: getColor(seat.estado),
            cursor: "pointer"
          }}
        >
          {seat.numero}
        </div>
      ))}
    </div>
  );
}