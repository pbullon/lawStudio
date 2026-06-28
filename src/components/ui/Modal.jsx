// src/components/ui/Modal.jsx
// Componente genérico y reutilizable.
// Recibe "titulo", "isOpen", "onClose" y "children" (el contenido interior).
// No sabe nada del dominio del negocio — solo maneja la estructura visual.

import { X } from 'lucide-react'
import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, titulo, children, maxWidth = 'max-w-2xl' }) => {

  // ── Cerrar con tecla Escape ──────────────────────────────────
  // useEffect registra el listener cuando el modal se abre
  // y lo limpia cuando se cierra (cleanup function del return)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ── Bloquear scroll del body cuando el modal está abierto ────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    // Cleanup: restaurar el scroll si el componente se desmonta
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Si el modal está cerrado, no renderizamos nada
  if (!isOpen) return null

  return (
    // ── Overlay oscuro ───────────────────────────────────────
    // fixed inset-0: cubre toda la pantalla
    // onClick en el overlay cierra el modal al hacer click afuera
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* ── Contenedor del modal ── */}
      {/* e.stopPropagation() evita que el click DENTRO del modal
          burbujee al overlay y lo cierre accidentalmente */}
      <div
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header del modal ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {titulo}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Contenido (viene de afuera via children) ── */}
        {/* overflow-y-auto: scroll interno si el contenido es muy largo */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  )
}

export default Modal