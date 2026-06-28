// src/views/LoginView.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Scale } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { loginSchema } from '../schemas/loginSchema'

const LoginView = () => {
  const navigate   = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  // Estado local del formulario (solo vive en este componente)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  // Errores de validación Zod (distintos al error de autenticación)
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Manejador de cambio de inputs ──────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpiamos el error del campo cuando el usuario empieza a corregir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
    if (error) clearError()
  }

  // ── Manejador de envío del formulario ──────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault() // Evita que el navegador recargue la página

    // 1. Validación con Zod
    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      // Zod devuelve los errores en un formato anidado.
      // .flatten() los convierte en un objeto plano { campo: ["mensaje"] }
      const errors = result.error.flatten().fieldErrors
      setFieldErrors({
        email:    errors.email?.[0],
        password: errors.password?.[0],
      })
      return // Detenemos el submit si hay errores de validación
    }

    // 2. Si Zod pasó, intentamos el login
    const { success } = await login(formData.email, formData.password)

    // 3. Si el login fue exitoso, navegamos al dashboard
    if (success) {
      navigate('/dashboard')
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo: Hero ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Scale className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">Estudio Maria de los Angeles Corbat</p>
            <p className="text-slate-400 text-xs tracking-widest uppercase">Legal · Inmobiliario</p>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Gestión de casos e inmuebles
            <br />
            <span className="text-amber-500">con precisión.</span>
          </h1>
          <p className="text-slate-400 mt-6 text-lg leading-relaxed max-w-sm">
            Plataforma de uso interno para la administración de clientes,
            propiedades y datos del estudio.
          </p>
        </div>

        <p className="text-slate-600 text-sm">© 2026 Estudio Corbat · v1.0 · Acceso restringido</p>
      </div>

      {/* ── Panel derecho: Formulario ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-800">
        <div className="w-full max-w-sm">

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Iniciar sesión</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">
            Ingrese sus credenciales para acceder al panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Campo Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Usuario / Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="corbat@estudio.com.ar"
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 dark:text-white dark:bg-slate-700 outline-none transition-colors
                  ${fieldErrors.email
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-600 focus:border-amber-500'
                  }`}
              />
              {/* Mensaje de error de validación Zod */}
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-3 rounded-lg border text-slate-900 dark:text-white dark:bg-slate-700 outline-none transition-colors pr-12
                    ${fieldErrors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-600 focus:border-amber-500'
                    }`}
                />
                {/* Botón ver/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Error de autenticación (del store) */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-amber-500 hover:bg-slate-700 dark:hover:bg-amber-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : 'Ingresar al panel'}
            </button>

          </form>

          {/* Credenciales de prueba */}
          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Credenciales de prueba
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-medium">Titular:</span> corbat@estudio.com.ar / SantaFe2026
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              <span className="font-medium">Asistente:</span> asistente@estudio.com.ar / Asistente2026
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginView