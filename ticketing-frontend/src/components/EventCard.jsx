import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event.id}/seats`)}
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        margin: "10px",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
    >
      <h3>{event.nombre}</h3>
      <p>{new Date(event.fecha).toLocaleDateString()}</p>
    </div>
  );
}