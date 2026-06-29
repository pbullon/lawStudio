// src/services/eventosService.js

import { supabase } from '../lib/supabase'

export const getEventos = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('fecha', { ascending: true })

  if (error) throw error
  return data
}

export const crearEvento = async (evento) => {
  const { data, error } = await supabase
    .from('events')
    .insert([evento])
    .select()
    .single()

  if (error) throw error
  return data
}

export const actualizarEvento = async (id, cambios) => {
  const { data, error } = await supabase
    .from('events')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}