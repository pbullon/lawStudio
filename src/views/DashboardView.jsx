// src/views/DashboardView.jsx

import { Users, Building2, TrendingUp, AlertTriangle, Plus, CheckSquare, Square } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { mockClients }    from '../data/mockClients'
import { mockProperties } from '../data/mockProperties'

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

// ── Datos mock de eventos/alertas ────────────────────────────────────
const mockAlerts = {
  reuniones: [
    { id: 1, titulo: 'Firma boleto · A. Vázquez',       fecha: '24 de jun de 2026', urgencia: 'hoy' },
    { id: 2, titulo: 'Reunión Bertolino · Cartera 2026', fecha: '01 de jul de 2026', urgencia: '7d'  },
  ],
  vencimientos: [
    { id: 3, titulo: 'Vencimiento contrato · Galpón Santo Tomé', fecha: '17 de jun de 2026', diasVencido: 7  },
    { id: 4, titulo: 'Cobro alquiler · Bv. Pellegrini 2845',     fecha: '20 de jun de 2026', diasVencido: 4  },
    { id: 5, titulo: 'Cobro alquiler · Of. Freyre 3100',         fecha: '20 de jun de 2026', diasVencido: 4  },
    { id: 6, titulo: 'Vencimiento contrato · San Martín 2780',   fecha: '22 de jun de 2026', diasVencido: 2  },
  ],
}

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

  // ── Cálculos de KPIs desde mock data ───────────────────────────
  const clientesActivos   = mockClients.length
  const propiedadesTotales = mockProperties.length
  const rentaActiva = mockProperties
    .filter(p => p.estado_contrato === 'Vigente')
    .reduce((sum, p) => sum + p.monto_alquiler, 0)
  const vencimientosCriticos = mockAlerts.vencimientos.length

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
          value={vencimientosCriticos}
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
                {mockAlerts.reuniones.map(item => (
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
                {mockAlerts.vencimientos.map(item => (
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