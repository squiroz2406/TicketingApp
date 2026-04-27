import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import SeatsPage from "./pages/SeatsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events/:eventId/seats" element={<SeatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}