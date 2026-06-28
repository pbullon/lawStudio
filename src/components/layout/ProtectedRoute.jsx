// src/components/layout/ProtectedRoute.jsx

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

// Este componente actúa como un "portero".
// Si hay un usuario en el store → deja pasar (renderiza <Outlet />).
// Si no hay usuario → redirige al login.
//
// <Outlet /> es un placeholder de React Router: renderiza
// el componente hijo que corresponde a la ruta activa.

const ProtectedRoute = () => {
  const user = useAuthStore(state => state.user)

  if (!user) {
    // "replace" evita que el usuario pueda volver atrás
    // con el botón del navegador después de ser redirigido
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute