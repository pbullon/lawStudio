// src/components/agenda/EventoModal.jsx

import { useState } from 'react'
import { Save } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import { eventSchema } from '../../schemas/eventSchema.js'
import { mockClients }    from '../../data/mockClients.js'
import { mockProperties } from '../../data/mockProperties.js'

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

const Select = ({ error, children, ...props }) => (
  <select
    className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none transition-colors
      ${error
        ? 'border-red-400 focus:border-red-500'
        : 'border-slate-200 dark:border-slate-600 focus:border-amber-500'
      }`}
    {...props}
  >
    {children}
  </select>
)

const EventoModal = ({ evento, fechaInicial, isOpen, onClose, onSave }) => {

  const [fieldErrors, setFieldErrors] = useState({})

  const [formData, setFormData] = useState(() => ({
    titulo:      evento?.titulo      ?? '',
    fecha:       evento?.fecha       ?? fechaInicial ?? '',
    hora:        evento?.hora        ?? '',
    tipo:        evento?.tipo        ?? 'reunion',
    descripcion: evento?.descripcion ?? '',
    client_id:   evento?.client_id   ?? '',
    property_id: evento?.property_id ?? '',
  }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSave = () => {
    const result = eventSchema.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFieldErrors(
        Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.[0]]))
      )
      return
    }

    onSave(result.data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={evento ? 'Editar Evento' : 'Nuevo Evento'}
      maxWidth="max-w-lg"
    >
      <div className="p-6 space-y-4">

        <Campo label="Título *" error={fieldErrors.titulo}>
          <Input
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            error={fieldErrors.titulo}
            placeholder="Reunión con cliente · Tema"
          />
        </Campo>

        <div className="grid grid-cols-2 gap-4">
          <Campo label="Fecha *" error={fieldErrors.fecha}>
            <Input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              error={fieldErrors.fecha}
            />
          </Campo>

          <Campo label="Hora">
            <Input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
            />
          </Campo>
        </div>

        <Campo label="Tipo de Evento *" error={fieldErrors.tipo}>
          <Select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="reunion">Reunión</option>
            <option value="vencimiento">Vencimiento</option>
            <option value="cobro">Cobro</option>
            <option value="audiencia">Audiencia</option>
            <option value="inspeccion">Inspección</option>
          </Select>
        </Campo>

        <Campo label="Cliente vinculado">
          <Select name="client_id" value={formData.client_id ?? ''} onChange={handleChange}>
            <option value="">Sin cliente vinculado</option>
            {mockClients.map(c => (
              <option key={c.id} value={c.id}>{c.nombre_completo}</option>
            ))}
          </Select>
        </Campo>

        <Campo label="Inmueble vinculado">
          <Select name="property_id" value={formData.property_id ?? ''} onChange={handleChange}>
            <option value="">Sin inmueble vinculado</option>
            {mockProperties.map(p => (
              <option key={p.id} value={p.id}>{p.direccion}</option>
            ))}
          </Select>
        </Campo>

        <Campo label="Descripción / Notas">
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Notas adicionales sobre el evento..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </Campo>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-amber-500 hover:opacity-90 text-white rounded-lg transition-opacity"
        >
          <Save className="w-4 h-4" />
          {evento ? 'Guardar cambios' : 'Crear evento'}
        </button>
      </div>

    </Modal>
  )
}

export default EventoModal