// src/components/layout/AppLayout.jsx
// Este componente es el "esqueleto" de todas las páginas internas.
// El Navbar siempre está arriba, y el contenido cambia según la ruta.

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

const AppLayout = () => {
  return (
    // min-h-screen: asegura que la página ocupe toda la altura
    // bg-slate-50 dark:bg-slate-900: fondo claro/oscuro según el tema
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Navbar fijo en la parte superior */}
      <Navbar />

      {/* Contenido de la página actual */}
      {/* pt-16: padding top para que el contenido no quede debajo del navbar fijo */}
      <main className="pt-16">
        <Outlet />
      </main>

    </div>
  )
}

export default AppLayout