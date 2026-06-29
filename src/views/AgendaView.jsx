// src/views/AgendaView.jsx

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useEventos } from '../hooks/useEventos'
import EventoModal from '../components/agenda/EventoModal.jsx'

// ── Helper: colores por tipo de evento ──────────────────────────────
// Cada tipo tiene su propio color para que el ojo los distinga rápido
const COLORES_TIPO = {
  reunion:     'bg-slate-800 text-white dark:bg-slate-600',
  vencimiento: 'bg-red-500 text-white',
  cobro:       'bg-green-500 text-white',
  audiencia:   'bg-amber-500 text-white',
  inspeccion:  'bg-blue-500 text-white',
}

// ── Helper: nombre del tipo en español ──────────────────────────────
const NOMBRES_TIPO = {
  reunion:     'Reunión',
  vencimiento: 'Vencimiento',
  cobro:       'Cobro',
  audiencia:   'Audiencia',
  inspeccion:  'Inspección',
}

// ── Helper: días del mes ─────────────────────────────────────────────
// Devuelve un array con todos los días que hay que renderizar
// incluyendo los días "de relleno" del mes anterior y siguiente
// para que la grilla siempre empiece en Lunes
const getDiasDelMes = (año, mes) => {
  // Primer y último día del mes actual
  const primerDia = new Date(año, mes, 1)
  const ultimoDia = new Date(año, mes + 1, 0)

  // getDay() devuelve 0=Domingo, 1=Lunes... Necesitamos que Lunes sea 0
  // Esta fórmula convierte el sistema de JS (domingo=0) a europeo (lunes=0)
  const primerDiaSemana = (primerDia.getDay() + 6) % 7

  const dias = []

  // Días del mes anterior para rellenar la primera semana
  for (let i = primerDiaSemana - 1; i >= 0; i--) {
    const fecha = new Date(año, mes, -i)
    dias.push({ fecha, esDelMesActual: false })
  }

  // Días del mes actual
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    dias.push({ fecha: new Date(año, mes, d), esDelMesActual: true })
  }

  // Días del mes siguiente para completar la última semana
  const diasRestantes = 7 - (dias.length % 7)
  if (diasRestantes < 7) {
    for (let d = 1; d <= diasRestantes; d++) {
      dias.push({ fecha: new Date(año, mes + 1, d), esDelMesActual: false })
    }
  }

  return dias
}

// ── Helper: formatear fecha como YYYY-MM-DD ──────────────────────────
// Necesitamos este formato para comparar con las fechas del mockEvents
const formatFecha = (fecha) => {
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ── Nombres de meses y días en español ──────────────────────────────
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// ── Componente principal ─────────────────────────────────────────────
const AgendaView = () => {

  const hoy = new Date()

  // Mes y año que estamos viendo — navegamos con las flechas
  const [mesActual, setMesActual] = useState(hoy.getMonth())
  const [añoActual, setAñoActual] = useState(hoy.getFullYear())

  // Estado del modal
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [fechaInicialModal,  setFechaInicialModal]  = useState('')
  const [modalAbierto,       setModalAbierto]       = useState(false)

  const { eventos, guardarEvento } = useEventos()

  // ── Navegación entre meses ───────────────────────────────────────
  const irAlMesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11)
      setAñoActual(a => a - 1)
    } else {
      setMesActual(m => m - 1)
    }
  }

  const irAlMesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0)
      setAñoActual(a => a + 1)
    } else {
      setMesActual(m => m + 1)
    }
  }

  const irAHoy = () => {
    setMesActual(hoy.getMonth())
    setAñoActual(hoy.getFullYear())
  }

  // ── Días del mes actual (con useMemo) ───────────────────────────
  const dias = useMemo(
    () => getDiasDelMes(añoActual, mesActual),
    [añoActual, mesActual]
  )

  // ── Índice de eventos por fecha ──────────────────────────────────
  // Construimos un objeto { "2026-06-17": [evento1, evento2] }
  // para buscar eventos de un día en O(1) en lugar de filtrar el array completo
  const eventosPorFecha = useMemo(() => {
    return eventos.reduce((acc, evento) => {
      if (!acc[evento.fecha]) acc[evento.fecha] = []
      acc[evento.fecha].push(evento)
      return acc
    }, {})
  }, [])

  // ── Handlers del modal ───────────────────────────────────────────
  const handleClickDia = (fecha) => {
    setEventoSeleccionado(null)
    setFechaInicialModal(formatFecha(fecha))
    setModalAbierto(true)
  }

  const handleClickEvento = (evento, e) => {
    e.stopPropagation() // Evita que dispare el click del día
    setEventoSeleccionado(evento)
    setFechaInicialModal(evento.fecha)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setEventoSeleccionado(null)
    setFechaInicialModal('')
  }

  const handleGuardarEvento = async (datos) => {
    const result = await guardarEvento(datos, eventoSeleccionado?.id)
      if (result.success) {
      handleCerrarModal()
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Agenda
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calendario unificado de reuniones, vencimientos y pagos.
          </p>
        </div>

        {/* Navegación de mes */}
        <div className="flex items-center gap-2">
          <button
            onClick={irAlMesAnterior}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-base font-bold text-slate-900 dark:text-white min-w-[160px] text-center">
            {MESES[mesActual]} {añoActual}
          </span>

          <button
            onClick={irAlMesSiguiente}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={irAHoy}
            className="ml-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* ── Grilla del calendario ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Cabecera: días de la semana */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
          {DIAS_SEMANA.map(dia => (
            <div
              key={dia}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Celdas de días */}
        <div className="grid grid-cols-7">
          {dias.map(({ fecha, esDelMesActual }, index) => {
            const fechaStr    = formatFecha(fecha)
            const esHoy       = fechaStr === formatFecha(hoy)
            const eventosDia  = eventosPorFecha[fechaStr] ?? []

            return (
              <div
                key={index}
                onClick={() => handleClickDia(fecha)}
                className={`
                  min-h-[100px] p-2 border-b border-r border-slate-100 dark:border-slate-700/50
                  cursor-pointer transition-colors
                  ${esDelMesActual
                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    : 'bg-slate-50/50 dark:bg-slate-800/30'
                  }
                  ${index % 7 === 6 ? 'border-r-0' : ''}
                `}
              >
                {/* Número del día */}
                <div className="flex justify-center mb-1">
                  <span className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${esHoy
                      ? 'bg-amber-500 text-white font-bold'
                      : esDelMesActual
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-slate-300 dark:text-slate-600'
                    }
                  `}>
                    {fecha.getDate()}
                  </span>
                </div>

                {/* Pills de eventos */}
                <div className="space-y-0.5">
                  {eventosDia.slice(0, 3).map(evento => (
                    <button
                      key={evento.id}
                      onClick={(e) => handleClickEvento(evento, e)}
                      className={`
                        w-full text-left text-[11px] font-medium px-1.5 py-0.5 rounded truncate
                        ${COLORES_TIPO[evento.tipo] ?? 'bg-slate-200 text-slate-700'}
                      `}
                      title={evento.titulo}
                    >
                      {evento.titulo}
                    </button>
                  ))}

                  {/* Si hay más de 3 eventos, mostrar "+N más" */}
                  {eventosDia.length > 3 && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 px-1.5">
                      +{eventosDia.length - 3} más
                    </p>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* ── Leyenda de colores ── */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {Object.entries(NOMBRES_TIPO).map(([tipo, nombre]) => (
          <div key={tipo} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${COLORES_TIPO[tipo]}`} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{nombre}</span>
          </div>
        ))}
      </div>

      {/* ── Botón flotante: Nuevo evento ── */}
      <button
        onClick={() => {
          setEventoSeleccionado(null)
          setFechaInicialModal(formatFecha(hoy))
          setModalAbierto(true)
        }}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-colors z-40"
      >
        <Plus className="w-5 h-5" />
        Nuevo Evento
      </button>

      {/* ── Modal ── */}
      <EventoModal
        key={`${eventoSeleccionado?.id}-${fechaInicialModal}`}
        evento={eventoSeleccionado}
        fechaInicial={fechaInicialModal}
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSave={handleGuardarEvento}
      />

    </div>
  )
}

export default AgendaView