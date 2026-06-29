// src/views/InmueblesView.jsx

import { useState, useMemo } from 'react'
import { Search, Plus, Pencil, FileText } from 'lucide-react'
import { useProperties } from '../hooks/useProperties'
import { useClientes }   from '../hooks/useClientes'
import InmuebleModal      from '../components/inmuebles/InmuebleModal.jsx'

// ── Helper: badge de estado ──────────────────────────────────────────
const BadgeEstado = ({ estado }) => {
  const estilos = {
    'Vigente':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Por Vencer':     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Vencido':        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'En Negociación': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Sin Inquilino':  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${estilos[estado] ?? estilos['Sin Inquilino']}`}>
      {estado}
    </span>
  )
}

// ── Componente principal ─────────────────────────────────────────────
const InmueblesView = () => {

  const [busqueda,    setBusqueda]    = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')

  // Estado del modal
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null)
  const [modalAbierto,         setModalAbierto]         = useState(false)
  const [tabInicialModal, setTabInicialModal] = useState('contrato')

  const { propiedades, isLoading, guardarPropiedad } = useProperties()
  const { clientes }                                 = useClientes()

  const getNombreCliente = (id) => {
  if (!id) return '—'
  const cliente = clientes.find(c => c.id === id)
  return cliente?.nombre_completo ?? '—'
}

  // ── Opciones de filtro de estado ─────────────────────────────────
  const ESTADOS = ['Todos', 'Vigente', 'Por Vencer', 'Vencido', 'En Negociación', 'Sin Inquilino']

  // ── Filtrado combinado: búsqueda + estado ────────────────────────
  // useMemo recalcula solo cuando cambian busqueda o filtroEstado
  const inmueblesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim()

    return propiedades.filter(inmueble => {

      // Filtro por estado
      const pasaEstado = filtroEstado === 'Todos' || inmueble.estado_contrato === filtroEstado

      // Filtro por búsqueda — buscamos en dirección y nombres de cliente
      const nombrePropietario = getNombreCliente(inmueble.propietario_id).toLowerCase()
      const nombreInquilino   = getNombreCliente(inmueble.inquilino_id).toLowerCase()

      const pasaBusqueda = !termino ||
        inmueble.direccion.toLowerCase().includes(termino) ||
        inmueble.tipo.toLowerCase().includes(termino)      ||
        nombrePropietario.includes(termino)                ||
        nombreInquilino.includes(termino)

      return pasaEstado && pasaBusqueda
    })
  }, [busqueda, filtroEstado])

  // ── Handlers del modal ───────────────────────────────────────────
  const handleNuevoInmueble = () => {
    setInmuebleSeleccionado(null)  // null = modo "nuevo"
    setModalAbierto(true)
  }

  const handleEditarInmueble = (inmueble, e) => {
    // e.stopPropagation() evita que el click del lápiz
    // dispare también el click de la fila
    e?.stopPropagation()
    setInmuebleSeleccionado(inmueble)
    setTabInicialModal('contrato')
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setInmuebleSeleccionado(null)
    setTabInicialModal('contrato')
  }

  const handleGuardarInmueble = async (datos) => {
    const result = await guardarPropiedad(datos, inmuebleSeleccionado?.id)
  if (result.success) {
    handleCerrarModal()
  }
  }

  // ── Estado de carga ───────────────────────────────────────────────
if (isLoading) {
  return (
    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
      Cargando propiedades...
    </div>
  )
}

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Inmuebles
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {inmueblesFiltrados.length} propiedad{inmueblesFiltrados.length !== 1 ? 'es' : ''} en administración.
        </p>
      </div>

      {/* ── Barra de herramientas: búsqueda + filtro de estado ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">

        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar dirección, propietario, inquilino..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-amber-500 transition-colors text-sm"
          />
        </div>

        {/* Filtro por estado */}
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-colors text-sm"
        >
          {ESTADOS.map(e => (
            <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e}</option>
          ))}
        </select>

      </div>

      {/* ── Tabla densa ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[900px]">

          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {[
                'Dirección', 'Tipo', 'Propietario', 'Inquilino',
                'Alquiler ($)', 'Estado', 'Próxima Acción',
                'Vencimiento','Presupuesto', 'Observaciones', ''
              ].map(col => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {inmueblesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No se encontraron inmuebles para los filtros aplicados.
                </td>
              </tr>
            ) : (
              inmueblesFiltrados.map((inmueble, index) => (
                <tr
                  key={inmueble.id}
                  onClick={() => handleEditarInmueble(inmueble)}
                  className={`
                    border-b border-slate-100 dark:border-slate-700/50
                    hover:bg-slate-50 dark:hover:bg-slate-700/30
                    transition-colors cursor-pointer
                    ${index === inmueblesFiltrados.length - 1 ? 'border-b-0' : ''}
                  `}
                >

                  {/* Dirección */}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 max-w-[180px]">
                      {inmueble.direccion}
                    </p>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {inmueble.tipo}
                    </span>
                  </td>

                  {/* Propietario */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {getNombreCliente(inmueble.propietario_id)}
                    </span>
                  </td>

                  {/* Inquilino */}
                  <td className="px-4 py-3">
                    <span className={`text-sm whitespace-nowrap ${
                      inmueble.inquilino_id
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-300 dark:text-slate-600 italic'
                    }`}>
                      {getNombreCliente(inmueble.inquilino_id)}
                    </span>
                  </td>

                  {/* Monto */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                      {inmueble.monto_alquiler > 0
                        ? `$${inmueble.monto_alquiler.toLocaleString('es-AR')}`
                        : <span className="text-slate-300 dark:text-slate-600">$0</span>
                      }
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <BadgeEstado estado={inmueble.estado_contrato} />
                  </td>

                  {/* Próxima acción */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 max-w-[140px] block">
                      {inmueble.proxima_accion || '—'}
                    </span>
                  </td>

                  {/* Vencimiento */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {inmueble.fecha_vencimiento
                        ? new Date(inmueble.fecha_vencimiento).toLocaleDateString('es-AR', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : '—'
                      }
                    </span>
                  </td>

                    {/* Presupuestos */}
                    <td className="px-4 py-3">
                    <button
                        onClick={(e) => {
                        e.stopPropagation() // Evita que dispare el click de la fila
                        setInmuebleSeleccionado(inmueble)
                        setTabInicialModal('presupuestos') // ← Abre directo en esa pestaña
                        setModalAbierto(true)
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        title="Ver presupuestos"
                    >
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        {inmueble.presupuestos?.length > 0
                        ? <span className="text-amber-600 dark:text-amber-400 font-semibold">
                            {inmueble.presupuestos.length} archivo{inmueble.presupuestos.length !== 1 ? 's' : ''}
                            </span>
                        : <span>Sin archivos</span>
                        }
                    </button>
                    </td>    

                  {/* Observaciones */}
                  <td className="px-4 py-3 max-w-[160px]">
                    <p className="text-sm text-slate-400 dark:text-slate-500 truncate">
                      {inmueble.observaciones || '—'}
                    </p>
                  </td>

                  {/* Acción: lápiz */}
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => handleEditarInmueble(inmueble, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar inmueble"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Botón flotante: Nuevo inmueble ── */}
      <button
        onClick={handleNuevoInmueble}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-colors z-40"
      >
        <Plus className="w-5 h-5" />
        Nuevo
      </button>

      {/* ── Modal ── */}
      <InmuebleModal
        key={`${inmuebleSeleccionado?.id}-${tabInicialModal}`}
        inmueble={inmuebleSeleccionado}
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSave={handleGuardarInmueble}
        tabInicial={tabInicialModal}
      />

    </div>
  )
}

export default InmueblesView