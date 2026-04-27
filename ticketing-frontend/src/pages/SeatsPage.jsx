import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import SeatGrid from "../components/SeatGrid";

export default function SeatsPage() {
  const { eventId } = useParams();
  const [seats, setSeats] = useState([]);

  const loadSeats = () => {
    api.get(`/events/${eventId}/seats`)
      .then(res => setSeats(res.data));
  };

  useEffect(() => {
    loadSeats();
  }, []);

  return (
    <div>
      <h2>Butacas</h2>
      <SeatGrid seats={seats} reload={loadSeats} />
    </div>
  );
}