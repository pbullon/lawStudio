// src/services/propiedadesService.js

import { supabase } from '../lib/supabase'

export const getPropiedades = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const crearPropiedad = async (propiedad) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([propiedad])
    .select()
    .single()

  if (error) throw error
  return data
}

export const actualizarPropiedad = async (id, cambios) => {
  const { data, error } = await supabase
    .from('properties')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}