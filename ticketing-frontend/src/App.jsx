import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import SectorsPage from './pages/SectorsPage';
import SeatsPage from './pages/SeatsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:eventId/sectors" element={<SectorsPage />} />
          <Route path="/sectors/:sectorId/seats" element={<SeatsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
