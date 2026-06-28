// src/schemas/eventSchema.js

import { z } from 'zod'

export const eventSchema = z.object({

  titulo: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres'),

  fecha: z
    .string()
    .min(1, 'La fecha es obligatoria'),

  hora: z
    .string()
    .optional(),

  tipo: z.enum(
    ['reunion', 'vencimiento', 'cobro', 'audiencia', 'inspeccion'],
    { errorMap: () => ({ message: 'Seleccioná un tipo de evento' }) }
  ),

  descripcion: z
    .string()
    .optional(),

  client_id: z
    .string()
    .optional()
    .nullable(),

  property_id: z
    .string()
    .optional()
    .nullable(),
})