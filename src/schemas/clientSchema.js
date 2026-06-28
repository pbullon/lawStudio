// src/schemas/clientSchema.js

import { z } from 'zod'

export const clientSchema = z.object({

  // ── Pestaña A: Personal ─────────────────────────────
  nombre_completo: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),

  dni: z
    .string()
    .optional(),

  cuit_cuil: z
    .string()
    .optional(),

  fecha_nacimiento: z
    .string()
    .optional(),

  estado_civil: z
    .enum(['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a'])
    .optional(),

  nacionalidad: z
    .string()
    .optional(),

  profesion: z
    .string()
    .optional(),

  domicilio: z
    .string()
    .optional(),

  telefono: z
    .string()
    .optional(),

  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),  // Permite campo vacío sin error

  contacto_emergencia: z
    .string()
    .optional(),

  // ── Pestaña B: Laboral/Familiar ─────────────────────
  empleador:         z.string().optional(),
  puesto:            z.string().optional(),
  antiguedad_años:   z.coerce.number().optional(),  // coerce convierte string a número
  ingresos_mensuales: z.coerce.number().optional(),
  conyuge:           z.string().optional(),
  hijos:             z.coerce.number().default(0),

  // ── Pestaña C: Observaciones legales ────────────────
  objetivo:    z.string().optional(),
  estrategia:  z.string().optional(),
  riesgos:     z.string().optional(),
})