import api from "../api/client";

export default function SeatGrid({ seats, reload }) {

  const reservar = async (seatId) => {
    try {
      await api.post("/reservations", {
        SeatIds: [seatId],
        UserId: 1
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

  const mapStatusToColor = (status) => {
    if (!status) return "green";
    const s = status.toLowerCase();
    if (s === 'available') return "green";
    if (s === 'reserved') return "orange";
    if (s === 'sold') return "red";
    return "gray";
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
            backgroundColor: mapStatusToColor(seat.status),
            cursor: "pointer"
          }}
        >
          {seat.seatNumber || seat.numero}
        </div>
      ))}
    </div>
  );
}