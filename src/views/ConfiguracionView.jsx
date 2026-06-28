// src/views/ConfiguracionView.jsx

import { useState } from 'react'
import { Save, Eye, EyeOff, Shield, Users, Building, Lock } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAppStore  } from '../store/appStore'
import { studioInfoSchema, changePasswordSchema } from '../schemas/configSchema'
import { mockUsers } from '../data/mockUsers'

// ── Permisos disponibles en el sistema ──────────────────────────────
// Definidos acá para que el ADMIN pueda asignarlos por checkbox
const PERMISOS_DISPONIBLES = [
  { id: 'ver_clientes',        label: 'Ver Clientes'              },
  { id: 'editar_clientes',     label: 'Editar Clientes'           },
  { id: 'ver_inmuebles',       label: 'Ver Inmuebles'             },
  { id: 'editar_inmuebles',    label: 'Editar Inmuebles'          },
  { id: 'ver_agenda',          label: 'Ver Agenda'                },
  { id: 'editar_agenda',       label: 'Editar Agenda'             },
  { id: 'ver_configuracion',   label: 'Ver Configuración'         },
]

// ── Permisos por defecto para el rol ASISTENTE ──────────────────────
const PERMISOS_DEFAULT_ASISTENTE = {
  ver_clientes:     true,
  editar_clientes:  false,
  ver_inmuebles:    true,
  editar_inmuebles: false,
  ver_agenda:       true,
  editar_agenda:    false,
  ver_configuracion: false,
}

// ── Subcomponentes ───────────────────────────────────────────────────
const Campo = ({ label, children, error }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

const Input = ({ error, ...props }) => (
  <input
    className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none transition-colors
      ${error
        ? 'border-red-400 focus:border-red-500'
        : 'border-slate-200 dark:border-slate-600 focus:border-amber-500'
      }`}
    {...props}
  />
)

// ── Sección con título y borde ───────────────────────────────────────
const Seccion = ({ titulo, icono: Icono, children }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
      <Icono className="w-4 h-4 text-amber-500" />
      {titulo}
    </h2>
    {children}
  </div>
)

// ── Componente principal ─────────────────────────────────────────────
const ConfiguracionView = () => {

  const { user }                       = useAuthStore()
  const { studioInfo, setStudioInfo }  = useAppStore()

  // Solo el ADMIN ve todo — el ASISTENTE solo ve "Cambiar Contraseña"
  const esAdmin = user?.rol === 'ADMIN'

  // ── Estado: Info del estudio ─────────────────────────────────────
  const [studioForm,      setStudioForm]      = useState(studioInfo)
  const [studioErrors,    setStudioErrors]    = useState({})
  const [studioGuardado,  setStudioGuardado]  = useState(false)

  // ── Estado: Cambio de contraseña ─────────────────────────────────
  const [passForm,        setPassForm]        = useState({ passwordActual: '', passwordNueva: '', confirmarPassword: '' })
  const [passErrors,      setPassErrors]      = useState({})
  const [showPassActual,  setShowPassActual]  = useState(false)
  const [showPassNueva,   setShowPassNueva]   = useState(false)
  const [passGuardada,    setPassGuardada]    = useState(false)

  // ── Estado: Permisos del rol ASISTENTE ───────────────────────────
  const [permisos, setPermisos] = useState(PERMISOS_DEFAULT_ASISTENTE)

  // ── Estado: Usuarios (mock) ──────────────────────────────────────
  const [usuarios, setUsuarios] = useState(
    mockUsers.map(u => ({ ...u, activo: true }))
  )

  // ── Handler: guardar info del estudio ────────────────────────────
  const handleGuardarStudio = () => {
    const result = studioInfoSchema.safeParse(studioForm)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setStudioErrors(
        Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.[0]]))
      )
      return
    }

    // Actualizamos el appStore — el Navbar lo va a reflejar automáticamente
    setStudioInfo(result.data)
    setStudioErrors({})
    setStudioGuardado(true)
    setTimeout(() => setStudioGuardado(false), 3000)
  }

  // ── Handler: cambiar contraseña ──────────────────────────────────
  const handleCambiarPassword = () => {
    const result = changePasswordSchema.safeParse(passForm)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setPassErrors(
        Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.[0]]))
      )
      return
    }

    // En producción: llamada a Supabase auth.updateUser()
    console.log('Contraseña cambiada')
    setPassForm({ passwordActual: '', passwordNueva: '', confirmarPassword: '' })
    setPassErrors({})
    setPassGuardada(true)
    setTimeout(() => setPassGuardada(false), 3000)
  }

  // ── Handler: toggle permiso ──────────────────────────────────────
  const handleTogglePermiso = (permisoId) => {
    setPermisos(prev => ({ ...prev, [permisoId]: !prev[permisoId] }))
  }

  // ── Handler: toggle usuario activo ──────────────────────────────
  const handleToggleUsuario = (userId) => {
    // El ADMIN no puede desactivarse a sí mismo
    if (userId === user.id) return
    setUsuarios(prev =>
      prev.map(u => u.id === userId ? { ...u, activo: !u.activo } : u)
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* ── Encabezado ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Configuración
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {esAdmin
            ? 'Panel de control del sistema. Acceso completo como Administrador.'
            : 'Podés cambiar tu contraseña desde acá.'
          }
        </p>
      </div>

      {/* ── SECCIÓN 1: Info del Estudio — solo ADMIN ── */}
      {esAdmin && (
        <Seccion titulo="Información del Estudio Jurídico" icono={Building}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Campo label="Nombre Completo" error={studioErrors.nombre}>
              <Input
                value={studioForm.nombre}
                onChange={e => setStudioForm(p => ({ ...p, nombre: e.target.value }))}
                error={studioErrors.nombre}
                placeholder="Estudio Castellanos Legal & Inmobiliario"
              />
            </Campo>

            <Campo label="Email" error={studioErrors.email}>
              <Input
                type="email"
                value={studioForm.email}
                onChange={e => setStudioForm(p => ({ ...p, email: e.target.value }))}
                error={studioErrors.email}
                placeholder="contacto@castellanos.com.ar"
              />
            </Campo>

            <Campo label="Dirección" error={studioErrors.direccion}>
              <Input
                value={studioForm.direccion}
                onChange={e => setStudioForm(p => ({ ...p, direccion: e.target.value }))}
                error={studioErrors.direccion}
                placeholder="San Martín 1642, Santa Fe"
              />
            </Campo>

            <Campo label="Teléfono" error={studioErrors.telefono}>
              <Input
                value={studioForm.telefono}
                onChange={e => setStudioForm(p => ({ ...p, telefono: e.target.value }))}
                error={studioErrors.telefono}
                placeholder="+54 342 400-0000"
              />
            </Campo>

          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleGuardarStudio}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-amber-500 hover:opacity-90 text-white rounded-lg transition-opacity"
            >
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>

            {/* Feedback visual de guardado exitoso */}
            {studioGuardado && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Información actualizada
              </span>
            )}
          </div>
        </Seccion>
      )}

      {/* ── SECCIÓN 2: Gestión de Usuarios — solo ADMIN ── */}
      {esAdmin && (
        <Seccion titulo="Gestión de Usuarios" icono={Users}>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                  {['Usuario', 'Email', 'Rol', 'Estado', 'Acción'].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-100 dark:border-slate-700/50 ${index === usuarios.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {u.nombre}
                      {u.id === user.id && (
                        <span className="ml-2 text-xs text-amber-500">(vos)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${u.rol === 'ADMIN'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${u.activo
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {/* El ADMIN no puede desactivarse a sí mismo */}
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleUsuario(u.id)}
                          className={`text-xs font-medium transition-colors
                            ${u.activo
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-green-500 hover:text-green-700'
                            }`}
                        >
                          {u.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Seccion>
      )}

      {/* ── SECCIÓN 3: Roles y Permisos — solo ADMIN ── */}
      {esAdmin && (
        <Seccion titulo="Roles y Permisos" icono={Shield}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Configurá los permisos del rol <span className="font-semibold text-slate-700 dark:text-slate-300">ASISTENTE</span>.
            El rol ADMIN siempre tiene acceso completo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PERMISOS_DISPONIBLES.map(permiso => (
              <label
                key={permiso.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={permisos[permiso.id] ?? false}
                  onChange={() => handleTogglePermiso(permiso.id)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {permiso.label}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={() => console.log('Permisos guardados:', permisos)}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-amber-500 hover:opacity-90 text-white rounded-lg transition-opacity"
          >
            <Save className="w-4 h-4" />
            Guardar permisos
          </button>
        </Seccion>
      )}

      {/* ── SECCIÓN 4: Cambiar Contraseña — todos los usuarios ── */}
      <Seccion titulo="Cambiar Contraseña" icono={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">

          <Campo label="Contraseña Actual" error={passErrors.passwordActual}>
            <div className="relative">
              <Input
                type={showPassActual ? 'text' : 'password'}
                value={passForm.passwordActual}
                onChange={e => setPassForm(p => ({ ...p, passwordActual: e.target.value }))}
                error={passErrors.passwordActual}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassActual(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Campo>

          {/* Columna vacía para alinear el grid */}
          <div className="hidden md:block" />

          <Campo label="Nueva Contraseña" error={passErrors.passwordNueva}>
            <div className="relative">
              <Input
                type={showPassNueva ? 'text' : 'password'}
                value={passForm.passwordNueva}
                onChange={e => setPassForm(p => ({ ...p, passwordNueva: e.target.value }))}
                error={passErrors.passwordNueva}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassNueva(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Campo>

          <Campo label="Confirmar Contraseña" error={passErrors.confirmarPassword}>
            <Input
              type="password"
              value={passForm.confirmarPassword}
              onChange={e => setPassForm(p => ({ ...p, confirmarPassword: e.target.value }))}
              error={passErrors.confirmarPassword}
              placeholder="••••••••"
            />
          </Campo>

        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleCambiarPassword}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-amber-500 hover:opacity-90 text-white rounded-lg transition-opacity"
          >
            <Save className="w-4 h-4" />
            Cambiar contraseña
          </button>

          {passGuardada && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Contraseña actualizada
            </span>
          )}
        </div>
      </Seccion>

    </div>
  )
}

export default ConfiguracionView