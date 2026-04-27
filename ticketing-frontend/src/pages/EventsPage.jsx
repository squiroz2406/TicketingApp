import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events").then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      <h1>Eventos</h1>

      {events.map(e => (
        <div key={e.id} onClick={() => navigate(`/events/${e.id}/seats`)}>
          <h3>{e.nombre}</h3>
          <p>{new Date(e.fecha).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}