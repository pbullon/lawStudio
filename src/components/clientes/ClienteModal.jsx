// src/components/clientes/ClienteModal.jsx
// Modal específico para ver y editar un cliente.
// Recibe el cliente seleccionado y usa el Modal genérico como contenedor.

import { useState } from 'react'
import { Save } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import { clientSchema } from '../../schemas/clientSchema.js'

// ── Definición de las pestañas ───────────────────────────────────────
// Las definimos fuera del componente para que no se recreen en cada render
const TABS = [
  { id: 'personal',   label: 'Personal'          },
  { id: 'laboral',    label: 'Laboral / Familiar' },
  { id: 'legal',      label: 'Observaciones Legales' },
]

// ── Subcomponente: Campo de formulario ───────────────────────────────
// Reutilizable dentro del modal para evitar repetir el mismo HTML
const Campo = ({ label, children, error }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

// ── Subcomponente: Input estándar ────────────────────────────────────
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

// ── Subcomponente: Textarea ──────────────────────────────────────────
const Textarea = ({ error, ...props }) => (
  <textarea
    rows={3}
    className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none transition-colors resize-none
      ${error
        ? 'border-red-400 focus:border-red-500'
        : 'border-slate-200 dark:border-slate-600 focus:border-amber-500'
      }`}
    {...props}
  />
)

// ── Componente principal ─────────────────────────────────────────────
const ClienteModal = ({ cliente, isOpen, onClose, onSave }) => {

  // Pestaña activa
  const [tabActiva, setTabActiva] = useState('personal')

  // Errores de validación Zod por campo
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Estado del formulario ────────────────────────────────────
  // Inicializamos con los datos del cliente recibido,
  // o con valores vacíos si es un cliente nuevo
  const [formData, setFormData] = useState(() => ({
    nombre_completo:    cliente?.nombre_completo    ?? '',
    dni:                cliente?.dni                ?? '',
    cuit_cuil:          cliente?.cuit_cuil          ?? '',
    fecha_nacimiento:   cliente?.fecha_nacimiento   ?? '',
    estado_civil:       cliente?.estado_civil       ?? '',
    nacionalidad:       cliente?.nacionalidad       ?? '',
    profesion:          cliente?.profesion          ?? '',
    domicilio:          cliente?.domicilio          ?? '',
    telefono:           cliente?.telefono           ?? '',
    email:              cliente?.email              ?? '',
    contacto_emergencia: cliente?.contacto_emergencia ?? '',
    empleador:          cliente?.empleador          ?? '',
    puesto:             cliente?.puesto             ?? '',
    antiguedad_años:    cliente?.antiguedad_años    ?? '',
    ingresos_mensuales: cliente?.ingresos_mensuales ?? '',
    conyuge:            cliente?.conyuge            ?? '',
    hijos:              cliente?.hijos              ?? 0,
    objetivo:           cliente?.objetivo           ?? '',
    estrategia:         cliente?.estrategia         ?? '',
    riesgos:            cliente?.riesgos            ?? '',
  }))

  // ── Manejador genérico de cambios ────────────────────────────
  // Un solo handler para todos los inputs — lee el "name" del input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiamos el error del campo cuando el usuario empieza a escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Guardar con validación Zod ───────────────────────────────
  const handleSave = () => {
    const result = clientSchema.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      // Convertimos los arrays de errores a strings simples
      const erroresSimples = Object.fromEntries(
        Object.entries(errors).map(([key, val]) => [key, val?.[0]])
      )
      setFieldErrors(erroresSimples)

      // Si el error está en otra pestaña, la mostramos automáticamente
      if (errors.nombre_completo || errors.email || errors.dni) setTabActiva('personal')
      else if (errors.ingresos_mensuales) setTabActiva('laboral')

      return
    }

    // Si todo es válido, llamamos a onSave con los datos limpios
    onSave(result.data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={cliente ? `Cliente · ${cliente.nombre_completo}` : 'Nuevo Cliente'}
      maxWidth="max-w-3xl"
    >
      {/* ── Pestañas ── */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
              ${tabActiva === tab.id
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido de las pestañas ── */}
      <div className="p-6">

        {/* PESTAÑA A: Personal */}
        {tabActiva === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Campo label="Nombre Completo *" error={fieldErrors.nombre_completo} className="md:col-span-2">
              <Input
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                error={fieldErrors.nombre_completo}
                placeholder="Dr. Juan Pérez"
              />
            </Campo>

            <Campo label="DNI" error={fieldErrors.dni}>
              <Input name="dni" value={formData.dni} onChange={handleChange} placeholder="12.345.678" />
            </Campo>

            <Campo label="CUIT / CUIL" error={fieldErrors.cuit_cuil}>
              <Input name="cuit_cuil" value={formData.cuit_cuil} onChange={handleChange} placeholder="20-12345678-9" />
            </Campo>

            <Campo label="Fecha de Nacimiento">
              <Input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
            </Campo>

            <Campo label="Estado Civil">
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none focus:border-amber-500"
              >
                <option value="">Seleccionar...</option>
                <option>Soltero/a</option>
                <option>Casado/a</option>
                <option>Divorciado/a</option>
                <option>Viudo/a</option>
              </select>
            </Campo>

            <Campo label="Nacionalidad">
              <Input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} placeholder="Argentina" />
            </Campo>

            <Campo label="Profesión">
              <Input name="profesion" value={formData.profesion} onChange={handleChange} placeholder="Contador Público" />
            </Campo>

            <Campo label="Domicilio" error={fieldErrors.domicilio}>
              <Input name="domicilio" value={formData.domicilio} onChange={handleChange} placeholder="Av. San Martín 1234, Santa Fe" />
            </Campo>

            <Campo label="Teléfono">
              <Input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 342 000-0000" />
            </Campo>

            <Campo label="Email" error={fieldErrors.email}>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="cliente@correo.com" error={fieldErrors.email} />
            </Campo>

            <Campo label="Contacto de Emergencia" error={fieldErrors.contacto_emergencia}>
              <Input name="contacto_emergencia" value={formData.contacto_emergencia} onChange={handleChange} placeholder="Nombre · +54 342 000-0000" />
            </Campo>

          </div>
        )}

        {/* PESTAÑA B: Laboral / Familiar */}
        {tabActiva === 'laboral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Campo label="Empleador">
              <Input name="empleador" value={formData.empleador} onChange={handleChange} placeholder="Empresa S.A." />
            </Campo>

            <Campo label="Puesto">
              <Input name="puesto" value={formData.puesto} onChange={handleChange} placeholder="Gerente de Área" />
            </Campo>

            <Campo label="Antigüedad (años)" error={fieldErrors.antiguedad_años}>
              <Input type="number" name="antiguedad_años" value={formData.antiguedad_años} onChange={handleChange} placeholder="5" />
            </Campo>

            <Campo label="Ingresos Mensuales ($)" error={fieldErrors.ingresos_mensuales}>
              <Input type="number" name="ingresos_mensuales" value={formData.ingresos_mensuales} onChange={handleChange} placeholder="500000" />
            </Campo>

            <Campo label="Cónyuge">
              <Input name="conyuge" value={formData.conyuge} onChange={handleChange} placeholder="Nombre completo" />
            </Campo>

            <Campo label="Cantidad de Hijos">
              <Input type="number" name="hijos" value={formData.hijos} onChange={handleChange} placeholder="0" />
            </Campo>

          </div>
        )}

        {/* PESTAÑA C: Observaciones Legales */}
        {tabActiva === 'legal' && (
          <div className="grid grid-cols-1 gap-4">

            <Campo label="Objetivo Legal" error={fieldErrors.objetivo}>
              <Textarea name="objetivo" value={formData.objetivo} onChange={handleChange} placeholder="Describí el objetivo principal del cliente con el estudio..." />
            </Campo>

            <Campo label="Estrategia / Estado del Caso" error={fieldErrors.estrategia}>
              <Textarea name="estrategia" value={formData.estrategia} onChange={handleChange} placeholder="Estado actual y estrategia a seguir..." />
            </Campo>

            <Campo label="Riesgos Identificados" error={fieldErrors.riesgos}>
              <Textarea name="riesgos" value={formData.riesgos} onChange={handleChange} placeholder="Posibles riesgos legales o patrimoniales..." />
            </Campo>

          </div>
        )}

      </div>

      {/* ── Footer con botones ── */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
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
          Guardar cambios
        </button>
      </div>

    </Modal>
  )
}

export default ClienteModal