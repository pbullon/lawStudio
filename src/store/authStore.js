// src/store/authStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'  // Persiste en localStorage
import { mockUsers } from '../data/mockUsers'

// "persist" envuelve el store y lo guarda automáticamente en localStorage.
// Así si el usuario recarga la página, la sesión se mantiene.
export const useAuthStore = create(
  persist(
    (set) => ({

      // ── Estado inicial ──────────────────────────────
      user: null,      // { id, nombre, email, rol }
      isLoading: false,
      error: null,

      // ── Acción: login ───────────────────────────────
      // Simula una llamada a Supabase. Cuando conectemos el backend
      // real, solo cambia el interior de esta función.
      login: async (email, password) => {

        // 1. Activamos el loading para mostrar spinner en la UI
        set({ isLoading: true, error: null })

        // 2. Simulamos el delay de una llamada a API real
        await new Promise(resolve => setTimeout(resolve, 800))

        // 3. Buscamos el usuario en los datos mock
        const foundUser = mockUsers.find(
          u => u.email === email && u.password === password
        )

        if (foundUser) {
          // 4a. Login exitoso — guardamos el usuario en el estado
          //     IMPORTANTE: nunca guardamos la contraseña en el estado
          const { password: _, ...userWithoutPassword } = foundUser
          set({
            user: userWithoutPassword,
            isLoading: false,
            error: null,
          })
          return { success: true }

        } else {
          // 4b. Login fallido — guardamos el mensaje de error
          set({
            user: null,
            isLoading: false,
            error: 'Credenciales incorrectas. Verificá tu email y contraseña.',
          })
          return { success: false }
        }
      },

      // ── Acción: logout ──────────────────────────────
      logout: () => {
        set({ user: null, error: null })
      },

      // ── Helper: limpiar error ───────────────────────
      clearError: () => set({ error: null }),

    }),

    // Configuración de "persist": qué guardar y con qué nombre en localStorage
    {
      name: 'legal-gestor-auth',   // Clave en localStorage
      partialize: (state) => ({ user: state.user }), // Solo persiste el user, no el loading ni el error
    }
  )
)