import { Navigate } from 'react-router-dom';
import { authService } from '../api/authService';

function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
