import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="fullpage-loading">Cargando...</div>;
  }

  if (!currentUser?.uid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Renderiza las rutas anidadas protegidas
  return <Outlet />;
}