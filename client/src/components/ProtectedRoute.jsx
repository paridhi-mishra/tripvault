import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p className="center">Loading...</p>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
