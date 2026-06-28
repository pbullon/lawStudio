// src/store/appStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({

      // ── Estado: modo oscuro ─────────────────────────
      isDarkMode: false,

      // ── Acción: alternar tema ───────────────────────
      toggleDarkMode: () => {
        set(state => {
          const newMode = !state.isDarkMode

          // Tailwind usa la clase "dark" en el <html> para activar
          // el modo oscuro. La agregamos o quitamos directamente acá.
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }

          return { isDarkMode: newMode }
        })
      },

      // ── Estado: info del estudio (para el botón "Copiar" del Navbar) ──
      studioInfo: {
        nombre: 'Estudio Castellanos Legal & Inmobiliario',
        direccion: 'San Martín 1642, Santa Fe, Argentina',
        telefono: '+54 342 400-0000',
        email: 'contacto@castellanos.com.ar',
      },

      setStudioInfo: (info) => set({ studioInfo: info }),

    }),
    {
      name: 'legal-gestor-app',
      // Al cargar la app, sincronizamos la clase "dark" del HTML
      // con el valor guardado en localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)