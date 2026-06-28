// src/schemas/configSchema.js

import { z } from 'zod'

// Schema para la info del estudio
export const studioInfoSchema = z.object({
  nombre:    z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  telefono:  z.string().min(6, 'El teléfono debe tener al menos 6 caracteres'),
  email:     z.string().email('Ingresá un email válido'),
})

// Schema para cambio de contraseña
export const changePasswordSchema = z.object({
  passwordActual: z
    .string()
    .min(1, 'Ingresá tu contraseña actual'),

  passwordNueva: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),

  confirmarPassword: z.string(),

}).superRefine((data, ctx) => {
  if (data.passwordNueva !== data.confirmarPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Las contraseñas no coinciden',
      path: ['confirmarPassword'],
    })
  }
})