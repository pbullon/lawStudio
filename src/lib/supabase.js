// src/lib/supabase.js
// Punto de conexión único con Supabase.
// Todos los módulos importan desde acá — nunca crean su propio cliente.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación temprana — si faltan las variables, el error es claro
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verificá el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)