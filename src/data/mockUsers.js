// src/data/mockUsers.js
// Simula los usuarios registrados en el sistema.
// Las contraseñas en un sistema real NUNCA se guardan en texto plano.
// Supabase maneja el hashing automáticamente — esto es solo para desarrollo.

export const mockUsers = [
  {
    id: 'user-001',
    nombre: 'Dra. Maria de los Angeles Corbat',
    email: 'corbat@estudio.com.ar',
    password: 'SantaFe2026', // Solo para mock — jamás en producción
    rol: 'ADMIN',
    activo: true,
  },
  {
    id: 'user-002',
    nombre: 'Asistente',
    email: 'asistente@estudio.com.ar',
    password: 'Asistente2026',
    rol: 'ASISTENTE',
    activo: true,
  },
]