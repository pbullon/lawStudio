// src/components/inmuebles/InmuebleModal.jsx
// ARCHIVO COMPLETO — reemplazá todo el contenido anterior

import { useState } from 'react'
import { Save, FileText } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import { propertySchema } from '../../schemas/propertySchema.js'
import { mockClients } from '../../data/mockClients.js'

// ── Pestañas del modal ───────────────────────────────────────────────
const TABS = [
  { id: 'contrato',     label: 'Contrato'     },
  { id: 'presupuestos', label: 'Presupuestos' },
]

// ── Subcomponentes reutilizables ─────────────────────────────────────
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

// ── Componente principal ─────────────────────────────────────────────
const InmuebleModal = ({ inmueble, isOpen, onClose, onSave, tabInicial = 'contrato' }) => {

  const [tabActiva,   setTabActiva]   = useState(tabInicial)
  const [fieldErrors, setFieldErrors] = useState({})

  // ── Estado del formulario ────────────────────────────────────────
  const [formData, setFormData] = useState(() => ({
    direccion:         inmueble?.direccion         ?? '',
    tipo:              inmueble?.tipo              ?? '',
    propietario_id:    inmueble?.propietario_id    ?? '',
    inquilino_id:      inmueble?.inquilino_id      ?? '',
    estado_contrato:   inmueble?.estado_contrato   ?? 'Sin Inquilino',
    monto_alquiler:    inmueble?.monto_alquiler    ?? 0,
    fecha_vencimiento: inmueble?.fecha_vencimiento ?? '',
    proxima_accion:    inmueble?.proxima_accion    ?? '',
    observaciones:     inmueble?.observaciones     ?? '',
  }))

  // ── Estado de presupuestos — separado porque es un array dinámico ─
  const [presupuestos, setPresupuestos] = useState(
    inmueble?.presupuestos ?? []
  )

  // ── Estado del formulario de nuevo presupuesto ───────────────────
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState({
    fecha: '', monto: '', detalle: ''
  })

  // ── Handler genérico de inputs ───────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Agregar presupuesto ──────────────────────────────────────────
  const handleAgregarPresupuesto = () => {
    if (!nuevoPresupuesto.detalle || !nuevoPresupuesto.monto) return
    setPresupuestos(prev => [...prev, {
      ...nuevoPresupuesto,
      monto: Number(nuevoPresupuesto.monto),
      id: Date.now(),
    }])
    setNuevoPresupuesto({ fecha: '', monto: '', detalle: '' })
  }

  // ── Eliminar presupuesto ─────────────────────────────────────────
  const handleEliminarPresupuesto = (id) => {
    setPresupuestos(prev => prev.filter(p => p.id !== id))
  }

  // ── Guardar con validación Zod ───────────────────────────────────
  const handleSave = () => {
    const result = propertySchema.safeParse(formData)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      setFieldErrors(
        Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.[0]]))
      )
      setTabActiva('contrato')
      return
    }

    onSave({ ...result.data, presupuestos })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={inmueble ? `Inmueble · ${inmueble.direccion}` : 'Nuevo Inmueble'}
      maxWidth="max-w-2xl"
    >

      {/* ── Pestañas ── */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
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

      <div className="p-6">

        {/* PESTAÑA: Contrato */}
        {tabActiva === 'contrato' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Campo label="Dirección *" error={fieldErrors.direccion}>
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                error={fieldErrors.direccion}
                placeholder="Bv. Pellegrini 2845, Piso 6, Santa Fe"
              />
            </Campo>

            <Campo label="Tipo de Propiedad *" error={fieldErrors.tipo}>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                error={fieldErrors.tipo}
              >
                <option value="">Seleccionar...</option>
                {['Departamento', 'Casa', 'Local Comercial', 'Oficina', 'Galpón'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Campo>

            <Campo label="Estado del Contrato">
              <Select
                name="estado_contrato"
                value={formData.estado_contrato}
                onChange={handleChange}
              >
                {['Vigente', 'Por Vencer', 'Vencido', 'En Negociación', 'Sin Inquilino'].map(e => (
                  <option key={e}>{e}</option>
                ))}
              </Select>
            </Campo>

            <Campo label="Propietario *" error={fieldErrors.propietario_id}>
              <Select
                name="propietario_id"
                value={formData.propietario_id}
                onChange={handleChange}
                error={fieldErrors.propietario_id}
              >
                <option value="">Seleccionar cliente...</option>
                {mockClients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre_completo}</option>
                ))}
              </Select>
            </Campo>

            <Campo label="Inquilino">
              <Select
                name="inquilino_id"
                value={formData.inquilino_id ?? ''}
                onChange={handleChange}
              >
                <option value="">Sin inquilino</option>
                {mockClients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre_completo}</option>
                ))}
              </Select>
            </Campo>

            <Campo label="Monto de Alquiler ($)" error={fieldErrors.monto_alquiler}>
              <Input
                type="number"
                name="monto_alquiler"
                value={formData.monto_alquiler}
                onChange={handleChange}
                placeholder="385000"
              />
            </Campo>

            <Campo label="Fecha de Vencimiento">
              <Input
                type="date"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento ?? ''}
                onChange={handleChange}
              />
            </Campo>

            <Campo label="Próxima Acción">
              <Input
                name="proxima_accion"
                value={formData.proxima_accion}
                onChange={handleChange}
                placeholder="Ajuste IPC trimestral"
              />
            </Campo>

            <Campo label="Observaciones">
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={3}
                placeholder="Notas adicionales sobre el inmueble..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white dark:bg-slate-700 outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </Campo>

          </div>
        )}

        {/* PESTAÑA: Presupuestos */}
        {tabActiva === 'presupuestos' && (
          <div className="space-y-4">

            {/* Formulario nuevo presupuesto */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Agregar Presupuesto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="date"
                  value={nuevoPresupuesto.fecha}
                  onChange={e => setNuevoPresupuesto(p => ({ ...p, fecha: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Monto ($)"
                  value={nuevoPresupuesto.monto}
                  onChange={e => setNuevoPresupuesto(p => ({ ...p, monto: e.target.value }))}
                />
                <Input
                  placeholder="Detalle del presupuesto"
                  value={nuevoPresupuesto.detalle}
                  onChange={e => setNuevoPresupuesto(p => ({ ...p, detalle: e.target.value }))}
                />
              </div>
              <button
                onClick={handleAgregarPresupuesto}
                className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-900 dark:bg-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <FileText className="w-4 h-4" />
                Agregar
              </button>
            </div>

            {/* Lista de presupuestos */}
            {presupuestos.length === 0 ? (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">
                No hay presupuestos cargados para este inmueble.
              </p>
            ) : (
              <div className="space-y-2">
                {presupuestos.map((p, i) => (
                  <div
                    key={p.id ?? i}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {p.detalle}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {p.fecha && new Date(p.fecha).toLocaleDateString('es-AR')} · ${Number(p.monto).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminarPresupuesto(p.id ?? i)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors ml-4"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── Footer ── */}
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
          Guardar cambios
        </button>
      </div>

    </Modal>
  )
}

export default InmuebleModal