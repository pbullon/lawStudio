// src/views/DashboardView.jsx

import { Users, Building2, TrendingUp, AlertTriangle, Plus, CheckSquare, Square } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useClientes }   from '../hooks/useClientes'
import { useProperties } from '../hooks/useProperties'
import { useEventos }    from '../hooks/useEventos'

// ── Subcomponente: KPI Card ──────────────────────────────────────────
// Lo definimos acá por ahora. En la Fase 5 lo movemos a components/dashboard/
const KpiCard = ({ icon: Icon, label, value, subtitle, iconBg }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-start gap-4">
    <div className={`w-11 h-11 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
)

const mockTareas = [
  { id: 1, texto: 'Llamar a escribanía Reutemann por escritura Vázquez', hecha: false },
  { id: 2, texto: 'Enviar liquidación de expensas a Mendoza',            hecha: true  },
  { id: 3, texto: 'Preparar carta documento · Galpón Santo Tomé',        hecha: false },
  { id: 4, texto: 'Solicitar libre deuda API · Rivadavia 3450',          hecha: false },
]

// ── Vista principal del Dashboard ────────────────────────────────────
const DashboardView = () => {
  const { user } = useAuthStore()
  const [tareas, setTareas] = useState(mockTareas)

    // ── Datos reales desde Supabase ──────────────────────────────────
  // Llamamos a los tres hooks — cada uno maneja su propio estado de carga
  const { clientes,    isLoading: cargandoClientes    } = useClientes()
  const { propiedades, isLoading: cargandoPropiedades } = useProperties()
  const { eventos,     isLoading: cargandoEventos     } = useEventos()

  // ── Calcular alertas desde eventos reales ────────────────────────
// "hoy" en formato YYYY-MM-DD para comparar con las fechas de eventos
const hoyStr = new Date().toISOString().split('T')[0]

// Fecha límite: hoy + 7 días
const en7Dias = new Date()
en7Dias.setDate(en7Dias.getDate() + 7)
const en7DiasStr = en7Dias.toISOString().split('T')[0]

// Formatear fecha para mostrar en pantalla
const formatearFecha = (fechaStr) => {
  return new Date(fechaStr + 'T00:00:00')
    .toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
}

// Reuniones y audiencias en los próximos 7 días
const reunionesPróximas = eventos.filter(e =>
    (e.tipo === 'reunion' || e.tipo === 'audiencia') &&
    e.fecha >= hoyStr &&
    e.fecha <= en7DiasStr
  )
  .map(e => ({
    id:       e.id,
    titulo:   e.titulo,
    fecha:    formatearFecha(e.fecha),
    urgencia: e.fecha === hoyStr ? 'hoy' : '7d',
  }))

// Vencimientos y cobros que ya pasaron o son hoy
const vencimientosCriticos = eventos
  .filter(e =>
    (e.tipo === 'vencimiento' || e.tipo === 'cobro') &&
    e.fecha <= hoyStr
  )
  .map(e => {
    // Calcular cuántos días hace que venció
    const msVencido  = new Date(hoyStr) - new Date(e.fecha + 'T00:00:00')
    const diasVencido = Math.floor(msVencido / (1000 * 60 * 60 * 24))
    return {
      id:           e.id,
      titulo:       e.titulo,
      fecha:        formatearFecha(e.fecha),
      diasVencido,
    }
  })

  // ── KPIs calculados desde datos reales ──────────────────────────
  // Cada vez que Supabase responda y los arrays se actualicen,
  // estos valores se recalculan automáticamente

  const clientesActivos    = clientes.length

  const propiedadesTotales = propiedades.length

  const rentaActiva = propiedades
    .filter(p => p.estado_contrato === 'Vigente')
    .reduce((sum, p) => sum + (p.monto_alquiler ?? 0), 0)

  // ── Helper: saludo según hora del día ──────────────────────────
  const getSaludo = () => {
    const hora = new Date().getHours()
    if (hora < 12) return 'Buenos días'
    if (hora < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // ── Helper: fecha en español ────────────────────────────────────
  const getFechaHoy = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).toUpperCase()
  }

  // ── Acción: marcar/desmarcar tarea ─────────────────────────────
  const toggleTarea = (id) => {
    setTareas(prev =>
      prev.map(t => t.id === id ? { ...t, hecha: !t.hecha } : t)
    )
  }

  // ── Estado de carga global ────────────────────────────────────────
// El dashboard espera a que TODOS los datos estén listos
  const estaCargando = cargandoClientes || cargandoPropiedades || cargandoEventos

  if (estaCargando) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cargando panel...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
          {getFechaHoy()}
        </p>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {getSaludo()}, {user?.nombre?.split(' ').at(-1)}
          </h1>
          <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Sesión activa · {user?.rol === 'ADMIN' ? 'Titular' : 'Asistente'}
          </span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={Users}
          label="Clientes Activos"
          value={clientesActivos}
          subtitle="Cartera total"
          iconBg="bg-blue-500"
        />
        <KpiCard
          icon={Building2}
          label="Propiedades Registradas"
          value={propiedadesTotales}
          subtitle="2 vencen en 30 días"
          iconBg="bg-amber-500"
        />
        <KpiCard
          icon={TrendingUp}
          label="Renta Mensual Activa"
          value={`$${rentaActiva.toLocaleString('es-AR')}`}
          subtitle="Contratos vigentes"
          iconBg="bg-green-500"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Vencimientos Críticos"
          value={vencimientosCriticos.length}
          subtitle="Próximos 3 días"
          iconBg="bg-red-500"
        />
      </div>

      {/* ── Sección inferior: Alertas + Tareas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Alertas (ocupa 2/3 del ancho) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Alertas y Vencimientos Imperdibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Columna: Reuniones */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Reuniones y Audiencias · 7 días
              </p>
              <div className="space-y-2">
                {reunionesPróximas.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.titulo}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.fecha}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2
                      ${item.urgencia === 'hoy'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.urgencia === 'hoy' ? 'Hoy' : item.urgencia}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna: Vencimientos */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Vencimientos y Pagos
              </p>
              <div className="space-y-2">
                {vencimientosCriticos.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.titulo}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.fecha}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex-shrink-0 ml-2">
                      {item.diasVencido}d vencido
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Tareas del día (ocupa 1/3) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-green-500" />
              Tareas del Día
            </h2>
            <button className="flex items-center gap-1 bg-slate-900 dark:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </button>
          </div>

          <div className="space-y-2">
            {tareas.map(tarea => (
              <button
                key={tarea.id}
                onClick={() => toggleTarea(tarea.id)}
                className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                {tarea.hecha
                  ? <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  : <Square className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                }
                <span className={`text-sm ${tarea.hecha
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {tarea.texto}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardView