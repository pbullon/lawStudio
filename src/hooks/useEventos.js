// src/hooks/useEventos.js
// Hook para eventos/agenda. Idéntico en estructura a useProperties.js.

import { useState, useEffect } from 'react'
import {
  getEventos,
  crearEvento,
  actualizarEvento
} from '../services/eventosService'

export const useEventos = () => {

  const [eventos,   setEventos]   = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    cargarEventos()
  }, [])

  const cargarEventos = async () => {
    try {
      setIsLoading(true)
      const data = await getEventos()
      setEventos(data)
    } catch (err) {
      setError('No se pudieron cargar los eventos.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const guardarEvento = async (formData, eventoId = null) => {
    try {
      if (eventoId) {
        const actualizado = await actualizarEvento(eventoId, formData)
        setEventos(prev =>
          prev.map(e => e.id === eventoId ? actualizado : e)
        )
      } else {
        const nuevo = await crearEvento(formData)
        setEventos(prev => [...prev, nuevo])
      }
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.message }
    }
  }

  return {
    eventos,
    isLoading,
    error,
    guardarEvento,
    recargar: cargarEventos
  }
}