import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import SectorsPage from './pages/SectorsPage';
import SeatsPage from './pages/SeatsPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <EventsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:eventId/sectors"
            element={
              <PrivateRoute>
                <SectorsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sectors/:sectorId/seats"
            element={
              <PrivateRoute>
                <SeatsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
