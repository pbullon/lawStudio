// src/store/authStore.js
// Reemplazá todo el contenido anterior

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set) => ({

      user:      null,
      isLoading: false,
      error:     null,

      // ── Login real con Supabase ────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true, error: null })

        // 1. Autenticamos con Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) {
          set({
            isLoading: false,
            error: 'Credenciales incorrectas. Verificá tu email y contraseña.',
          })
          return { success: false }
        }

        // 2. Buscamos el perfil del usuario en public.users
        // para obtener el nombre y el rol
        const { data: perfil, error: perfilError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (perfilError || !perfil) {
          set({ isLoading: false, error: 'No se pudo cargar el perfil del usuario.' })
          return { success: false }
        }

        // 3. Guardamos el perfil completo en el store
        set({
          user: {
            id:     perfil.id,
            nombre: perfil.nombre,
            email:  perfil.email,
            rol:    perfil.rol,
            activo: perfil.activo,
          },
          isLoading: false,
          error: null,
        })

        return { success: true }
      },

      // ── Logout real ────────────────────────────────────────────
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, error: null })
      },

      // ── Registro real ──────────────────────────────────────────
      // El trigger de Supabase crea automáticamente el perfil
      register: async (nombre, email, password) => {
        set({ isLoading: true, error: null })

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nombre } // Estos datos los lee el trigger
          }
        })

        if (error) {
          set({ isLoading: false, error: error.message })
          return { success: false }
        }

        set({ isLoading: false })
        return { success: true }
      },

      clearError: () => set({ error: null }),
    }),

    {
      name: 'legal-gestor-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)