// src/services/clientesService.js

import { supabase } from '../lib/supabase'

// ── Obtener todos los clientes ───────────────────────────────────────
export const getClientes = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('activo', true)
    .order('nombre_completo', { ascending: true })

  if (error) throw error
  return data
}

// ── Crear cliente ────────────────────────────────────────────────────
export const crearCliente = async (cliente) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([cliente])
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Actualizar cliente ───────────────────────────────────────────────
export const actualizarCliente = async (id, cambios) => {
  const { data, error } = await supabase
    .from('clients')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Eliminar cliente (soft delete) ───────────────────────────────────
// No borramos el registro — lo marcamos como inactivo
// para mantener el historial
export const eliminarCliente = async (id) => {
  const { error } = await supabase
    .from('clients')
    .update({ activo: false })
    .eq('id', id)

  if (error) throw error
}