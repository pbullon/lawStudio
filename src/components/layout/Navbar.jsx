// src/components/layout/Navbar.jsx

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Scale, LayoutDashboard, Users, Building2,
  Calendar, Sun, Moon, Bell, Copy, LogOut, ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'

const Navbar = () => {
  const navigate = useNavigate()

  // Traemos lo que necesitamos de cada store
  // Solo nos suscribimos a los campos que usamos — optimización básica de Zustand
  const { user, logout }           = useAuthStore()
  const { isDarkMode, toggleDarkMode, studioInfo } = useAppStore()

  // Estado local para el dropdown del perfil
  const [profileOpen, setProfileOpen] = useState(false)

  // ── Acción: cerrar sesión ────────────────────────────────────
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ── Acción: copiar info del estudio al portapapeles ──────────
  const handleCopyInfo = () => {
    const text = `${studioInfo.nombre}\n${studioInfo.direccion}\n${studioInfo.telefono}\n${studioInfo.email}`
    navigator.clipboard.writeText(text)
    // En la Fase 5 agregamos un toast de confirmación
    alert('Información copiada al portapapeles')
  }

  // ── Helper: iniciales del usuario para el avatar ─────────────
  const getInitials = (nombre) => {
    if (!nombre) return 'U'
    return nombre
      .split(' ')
      .slice(0, 2)              // Tomamos las primeras 2 palabras
      .map(word => word[0])     // Primera letra de cada una
      .join('')
      .toUpperCase()
  }

  // ── Links de navegación ──────────────────────────────────────
  // Los definimos como array para poder mapearlos
  // y evitar repetir código para cada link
  const navLinks = [
    { to: '/dashboard', label: 'Panel',     icon: LayoutDashboard },
    { to: '/clientes',  label: 'Clientes',  icon: Users },
    { to: '/inmuebles', label: 'Inmuebles', icon: Building2 },
    { to: '/agenda',    label: 'Agenda',    icon: Calendar },
  ]

  return (
    // fixed: el navbar se queda fijo al hacer scroll
    // z-50: siempre por encima del resto del contenido
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 flex items-center px-6 gap-6">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 mr-4">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Scale className="text-white w-4 h-4" />
        </div>
        <div className="hidden md:block">
          <p className="text-white font-bold text-sm leading-tight">Estudio Castellanos</p>
          <p className="text-slate-400 text-[10px] tracking-widest uppercase">Legal · Inmobiliario</p>
        </div>
      </div>

      {/* ── Links de navegación ── */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              // NavLink recibe una función que nos dice si la ruta está activa
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-slate-700 text-white'           // Estado activo
                : 'text-slate-400 hover:text-white hover:bg-slate-800'  // Estado normal
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* ── Spacer: empuja los controles a la derecha ── */}
      <div className="flex-1" />

      {/* ── Controles lado derecho ── */}
      <div className="flex items-center gap-2">

        {/* Botón copiar info del estudio */}
        <button
          onClick={handleCopyInfo}
          title="Copiar información del estudio"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Toggle modo oscuro */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Campana de notificaciones (funcionalidad completa en Fase 5) */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          {/* Badge con número de notificaciones */}
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            4
          </span>
        </button>

        {/* Dropdown de perfil */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {/* Avatar con iniciales */}
            <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {getInitials(user?.nombre)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-semibold leading-tight">
                {user?.nombre?.split(' ').slice(0, 2).join(' ')}
              </p>
              <p className="text-amber-500 text-[10px] uppercase tracking-wider">
                {user?.rol}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Menú desplegable */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar