// src/utils/notificaciones.js
// Funciones utilitarias para calcular eventos próximos.
// Las separamos del componente para que sean fáciles de testear
// y reutilizables en otros lugares (ej: el Dashboard).

import { mockEvents } from '../data/mockEvents'

// ── Colores y etiquetas por tipo ─────────────────────────────────────
export const TIPO_CONFIG = {
  reunion:     { label: 'Reunión',     color: 'bg-slate-700 text-white'  },
  vencimiento: { label: 'Vencimiento', color: 'bg-red-500 text-white'    },
  cobro:       { label: 'Cobro',       color: 'bg-green-500 text-white'  },
  audiencia:   { label: 'Audiencia',   color: 'bg-amber-500 text-white'  },
  inspeccion:  { label: 'Inspección',  color: 'bg-blue-500 text-white'   },
}

// ── Helper: obtener eventos de los próximos N días ───────────────────
export const getEventosProximos = (dias = 3) => {
  const hoy    = new Date()
  hoy.setHours(0, 0, 0, 0) // Normalizamos a medianoche para comparar solo fechas

  const limite = new Date(hoy)
  limite.setDate(hoy.getDate() + dias) // Fecha límite = hoy + N días

  return mockEvents
    .filter(evento => {
      const fechaEvento = new Date(evento.fecha + 'T00:00:00')
      // Incluimos eventos desde hoy hasta el límite
      return fechaEvento >= hoy && fechaEvento <= limite
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) // Ordenamos por fecha
}

// ── Helper: etiqueta de cuándo es el evento ──────────────────────────
export const getEtiquetaDia = (fechaStr) => {
  const hoy    = new Date()
  const manana = new Date()
  manana.setDate(hoy.getDate() + 1)

  const fecha = new Date(fechaStr + 'T00:00:00')

  const mismaFecha = (a, b) =>
    a.getDate()     === b.getDate()  &&
    a.getMonth()    === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  if (mismaFecha(fecha, hoy))    return { texto: 'Hoy',    urgente: true  }
  if (mismaFecha(fecha, manana)) return { texto: 'Mañana', urgente: true  }

  // Si no es hoy ni mañana, mostramos la fecha corta
  return {
    texto: fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    urgente: false,
  }
}