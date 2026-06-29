// src/components/layout/NotificacionesPanel.jsx
// Panel desplegable que muestra los eventos próximos.
// Se monta dentro del Navbar.

import { useEffect, useRef } from 'react'
import { Bell, Calendar, X } from 'lucide-react'
import { getEventosProximos, getEtiquetaDia, TIPO_CONFIG } from '../../utils/notificaciones'

const NotificacionesPanel = ({ isOpen, onClose }) => {

  const panelRef = useRef(null)

  // ── Cerrar al hacer click afuera ────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const handleClickAfuera = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickAfuera)
    return () => document.removeEventListener('mousedown', handleClickAfuera)
  }, [isOpen, onClose])

  const eventos = getEventosProximos(3)

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
    >

      {/* ── Header del panel ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Próximos 3 días
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Lista de eventos ── */}
      <div className="max-h-[400px] overflow-y-auto">
        {eventos.length === 0 ? (

          // Estado vacío
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No hay eventos en los próximos 3 días.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {eventos.map(evento => {
              const etiqueta = getEtiquetaDia(evento.fecha)
              const config   = TIPO_CONFIG[evento.tipo] ?? TIPO_CONFIG.reunion

              return (
                <div
                  key={evento.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >

                  {/* Indicador de tipo */}
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.color.split(' ')[0]}`} />

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {evento.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded
                        ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Etiqueta de día */}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0
                    ${etiqueta.urgente
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                    {etiqueta.texto}
                  </span>

                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {eventos.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            {eventos.length} evento{eventos.length !== 1 ? 's' : ''} próximo{eventos.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

    </div>
  )
}

export default NotificacionesPanel