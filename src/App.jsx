// src/App.jsx — versión actualizada

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginView     from './views/LoginView.jsx'
import DashboardView from './views/DashboardView.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AppLayout      from './components/layout/AppLayout.jsx'
import ClientesView    from './views/ClientesView.jsx'
import AgendaView      from './views/AgendaView.jsx'
import InmueblesView    from './views/InmueblesView.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginView />} />

        {/* ProtectedRoute verifica la sesión */}
        {/* AppLayout agrega el Navbar a todas las rutas hijas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/clientes" element={<ClientesView />} />
            <Route path="/agenda" element={<AgendaView />} />
            <Route path="/inmuebles" element={<InmueblesView />} />
            {/* Próximas rutas van acá adentro */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App