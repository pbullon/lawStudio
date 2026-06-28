// src/schemas/propertySchema.js

import { z } from 'zod'

export const propertySchema = z.object({

  direccion: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),

  tipo: z.enum(
    ['Departamento', 'Casa', 'Local Comercial', 'Oficina', 'Galpón'],
    { errorMap: () => ({ message: 'Seleccioná un tipo de propiedad' }) }
  ),

  propietario_id: z
    .string()
    .min(1, 'Seleccioná un propietario'),

  inquilino_id: z
    .string()
    .optional()
    .nullable(),

  estado_contrato: z.enum([
    'Vigente', 'Por Vencer', 'Vencido', 'En Negociación', 'Sin Inquilino'
  ]),

  monto_alquiler: z
    .coerce.number()
    .min(0, 'El monto no puede ser negativo')
    .default(0),

  fecha_vencimiento: z
    .string()
    .optional()
    .nullable(),

  proxima_accion: z
    .string()
    .optional(),

  observaciones: z
    .string()
    .optional(),
})