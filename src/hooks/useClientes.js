// src/hooks/useClientes.js
// Hook que maneja el estado de clientes con Supabase.
// Los componentes usan este hook — no saben nada de Supabase directamente.

import { useState, useEffect } from 'react'
import { getClientes, crearCliente, actualizarCliente } from '../services/clientesService'

export const useClientes = () => {

  const [clientes,   setClientes]   = useState([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState(null)

  // ── Cargar clientes al montar el hook ───────────────────────────
  useEffect(() => {
    cargarClientes()
  }, []) // [] → solo corre una vez al montar

  const cargarClientes = async () => {
    try {
      setIsLoading(true)
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      setError('No se pudieron cargar los clientes.')
      console.error(err)
    } finally {
      // finally corre siempre — con éxito o con error
      setIsLoading(false)
    }
  }

  const guardarCliente = async (formData, clienteId = null) => {
    try {
      if (clienteId) {
        // Editar existente
        const actualizado = await actualizarCliente(clienteId, formData)
        setClientes(prev =>
          prev.map(c => c.id === clienteId ? actualizado : c)
        )
      } else {
        // Crear nuevo
        const nuevo = await crearCliente(formData)
        setClientes(prev => [...prev, nuevo])
      }
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.message }
    }
  }

  return { clientes, isLoading, error, guardarCliente, recargar: cargarClientes }
}