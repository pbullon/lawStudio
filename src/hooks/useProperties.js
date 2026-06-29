// src/hooks/useProperties.js
// Hook que maneja el estado de propiedades con Supabase.
// Sigue el mismo patrón que useClientes.js — consistencia intencional.

import { useState, useEffect } from 'react'
import {
  getPropiedades,
  crearPropiedad,
  actualizarPropiedad
} from '../services/propiedadesService'

export const useProperties = () => {

  const [propiedades, setPropiedades] = useState([])
  const [isLoading,   setIsLoading]   = useState(true)
  const [error,       setError]       = useState(null)

  // ── Cargar propiedades al montar el hook ──────────────────────────
  useEffect(() => {
    cargarPropiedades()
  }, [])

  const cargarPropiedades = async () => {
    try {
      setIsLoading(true)
      const data = await getPropiedades()
      setPropiedades(data)
    } catch (err) {
      setError('No se pudieron cargar las propiedades.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const guardarPropiedad = async (formData, propiedadId = null) => {
    try {
      if (propiedadId) {
        // ── Editar existente ────────────────────────────────────────
        const actualizada = await actualizarPropiedad(propiedadId, formData)
        // Reemplazamos el objeto viejo en el array local — sin re-fetch
        setPropiedades(prev =>
          prev.map(p => p.id === propiedadId ? actualizada : p)
        )
      } else {
        // ── Crear nueva ─────────────────────────────────────────────
        const nueva = await crearPropiedad(formData)
        // Agregamos al inicio del array (más reciente primero)
        setPropiedades(prev => [nueva, ...prev])
      }
      return { success: true }
    } catch (err) {
      console.error(err)
      return { success: false, error: err.message }
    }
  }

  return {
    propiedades,
    isLoading,
    error,
    guardarPropiedad,
    recargar: cargarPropiedades
  }
}