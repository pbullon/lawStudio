// src/schemas/loginSchema.js
// Zod define la "forma" y las reglas que deben cumplir los datos del formulario.
// Si los datos no cumplen las reglas, Zod devuelve mensajes de error claros.

import { z } from 'zod'

export const loginSchema = z.object({

  email: z
    .string()
    .min(1, 'El email es obligatorio')      // No puede estar vacío
    .email('Ingresá un email válido'),       // Debe tener formato email

  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

})