// src/views/ClientesView.jsx

import { useState, useMemo } from 'react'
import { Search, Plus, Pencil } from 'lucide-react'
import { useClientes } from '../hooks/useClientes'
import ClienteModal from '../components/clientes/ClienteModal.jsx'

// ── Helper: genera iniciales y color de avatar ───────────────────────
// Cada cliente tiene un color distinto según su nombre
// para que la tabla sea más fácil de escanear visualmente
const getAvatarColor = (nombre) => {
  const colores = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-rose-500',  'bg-amber-500',  'bg-cyan-500',
  ]
  // Usamos el código ASCII de la primera letra para elegir un color
  // Siempre va a ser el mismo color para el mismo nombre
  const index = nombre.charCodeAt(0) % colores.length
  return colores[index]
}

const getInitials = (nombre) => {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

// ── Componente principal ─────────────────────────────────────────────
const ClientesView = () => {

    // Estado local para el buscador
    const { clientes, isLoading, error, guardarCliente } = useClientes()
    const [busqueda, setBusqueda] = useState('')

    // 2. Agregar estado dentro del componente ClientesView
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
    const [modalAbierto, setModalAbierto] = useState(false)

    // El useMemo ahora filtra "clientes" en lugar de "mockClients"
    const clientesFiltrados = useMemo(() => {
      const termino = busqueda.toLowerCase().trim()
      if (!termino) return clientes
      return clientes.filter(cliente =>
        cliente.nombre_completo.toLowerCase().includes(termino) ||
        cliente.dni?.toLowerCase().includes(termino)            ||
        cliente.cuit_cuil?.toLowerCase().includes(termino)      ||
        cliente.email?.toLowerCase().includes(termino)          ||
        cliente.profesion?.toLowerCase().includes(termino)
      )
    }, [busqueda, clientes]) // ← "clientes" reemplaza "mockClients"

     // 3. Handler para abrir el modal
    const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente)
    setModalAbierto(true)
    }

    const handleCerrarModal = () => {
    setModalAbierto(false)
    setClienteSeleccionado(null)
    }

    // 4. Handler para guardar (por ahora solo log — en Fase final conecta con Supabase)
    const handleGuardarCliente = async (datos) => {
      const resultado = await guardarCliente(datos, clienteSeleccionado?.id)
      if (resultado.success) {
        handleCerrarModal()
      }
    }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* ── Encabezado ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Base de Datos de Clientes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} registrado{clientesFiltrados.length !== 1 ? 's' : ''} en el estudio.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-amber-500 hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-lg transition-opacity text-sm">
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* ── Barra de búsqueda ── */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, DNI, CUIT, email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-amber-500 transition-colors text-sm"
        />
      </div>

      
  
      {/* ── Tabla ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* ── Estado de carga previo a la tabla ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 text-sm">{error}</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {['Cliente', 'DNI / CUIT', 'Profesión', 'Contacto', 'Objetivo', ''].map(col => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No se encontraron clientes para "{busqueda}"
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  onClick={() => handleEditarCliente(cliente)} // ← Abre el modal al clickear la fila
                  className={`
                    border-b border-slate-100 dark:border-slate-700/50
                    hover:bg-slate-50 dark:hover:bg-slate-700/30
                    transition-colors
                    ${index === clientesFiltrados.length - 1 ? 'border-b-0' : ''}
                  `}
                >
                  {/* Cliente */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${getAvatarColor(cliente.nombre_completo)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">
                          {getInitials(cliente.nombre_completo)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {cliente.nombre_completo}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {cliente.domicilio || '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* DNI / CUIT */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{cliente.dni || '—'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{cliente.cuit_cuil || '—'}</p>
                  </td>

                  {/* Profesión */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {cliente.profesion || '—'}
                    </span>
                  </td>

                  {/* Contacto */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{cliente.telefono || '—'}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{cliente.email || '—'}</p>
                  </td>

                  {/* Objetivo */}
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {cliente.objetivo || '—'}
                    </p>
                  </td>

                  {/* Acción: botón lápiz */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleEditarCliente(cliente)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar cliente"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table> 
        )}
      </div>
      

      {/* ── Modal de cliente ── */}
      {/* Va FUERA de la tabla pero DENTRO del div principal */}
      <ClienteModal
        cliente={clienteSeleccionado}
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onSave={handleGuardarCliente}
      />

    </div>
  )
}

export default ClientesView