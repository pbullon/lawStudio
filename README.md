# CRM-Law

Documento de referencia para el proyecto "CRM-Law": una aplicación frontend construida con Vite + React pensada para gestionar clientes, inmuebles y agenda, con integración a Supabase.

**Estado:** Código base del frontend (Vite, React, Tailwind, Supabase)

---

**Índice**

- **Descripción**: breve descripción del proyecto.
- **Tecnologías**: stack principal.
- **Inicio rápido**: preparación y arranque local.
- **Instalación**: dependencias, variables de entorno y scripts.
- **Estructura de carpetas**: descripción de la organización del código.
- **Cómo contribuir**: pautas básicas para contribuir.
- **Contacto y licencia**

---

## Descripción

`CRM-Law` es una interfaz de administración para despacho/gestión inmobiliaria y de clientes. Provee vistas para: tablero, clientes, inmuebles, agenda y configuración.

El frontend está organizado con componentes reutilizables, validaciones con `zod`, gestión de estado ligera con `zustand` y persistencia/autenticación mediante Supabase.

---

## **Tecnologías**

- **Framework:** Vite + React
- **UI:** Tailwind CSS (configurada vía plugin)
- **Estado:** `zustand`
- **Validación:** `zod`
- **BBDD / Auth:** Supabase (`@supabase/supabase-js`)
- **Ruteo:** `react-router-dom`
- **Linting:** ESLint

Archivos de interés: [package.json](package.json), [vite.config.js](vite.config.js)

---

## **Inicio rápido**

Requisitos previos:

- Node.js 18+ (recomendado)
- npm o pnpm

Clonar y ejecutar en modo desarrollo:

```bash
git clone <repo-url>
cd crm-law
npm install
# configurar .env (ver ejemplo abajo)
npm run dev
```

La app se servirá por defecto en `http://localhost:5173` (o el puerto que indique Vite).

---

## **Instalación y scripts**

Instalar dependencias:

```bash
npm install
```

Scripts disponibles (definidos en [package.json](package.json)):

- `npm run dev` : Ejecuta Vite en modo desarrollo.
- `npm run build` : Genera la versión de producción.
- `npm run preview` : Sirve la build estática localmente.
- `npm run lint` : Ejecuta ESLint sobre el código.

Variables de entorno (archivo `.env`)

La aplicación usa variables de entorno con prefijo `VITE_` para exponerlas al frontend. Crea un archivo `.env` en la raíz con al menos las siguientes variables:

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
# Opcional: otras variables de configuración
```

Estas claves se consumen en [src/lib/supabase.js](src/lib/supabase.js).

---

## **Estructura de carpetas**

La estructura principal del proyecto y su finalidad:

- **/** : raíz del proyecto
  - [package.json](package.json) : dependencias y scripts
  - [vite.config.js](vite.config.js) : configuración de Vite
- **/public** : recursos estáticos servidos por Vite
- **/src** : código fuente principal
  - [main.jsx](src/main.jsx) : punto de entrada de la app
  - [App.jsx](src/App.jsx) : componente raíz
  - **/assets** : imágenes y activos estáticos usados por componentes
  - **/components** : componentes UI organizados por dominio
    - **/layout** : `AppLayout`, `Navbar`, `ProtectedRoute`, `NotificacionesPanel` (estructura y navegación)
    - **/ui** : componentes de interfaz reutilizables (`Button`, `Input`, `Modal`, `Badge`)
    - **/dashboard** : componentes del tablero (`KpiCard`, `AlertList`)
    - **/clientes**, **/inmuebles**, **/agenda** : modales y componentes específicos de cada dominio (ej.: `ClienteModal.jsx`, `InmuebleModal.jsx`, `EventoModal.jsx`)
  - **/views** : vistas principales que representan rutas (`DashboardView.jsx`, `ClientesView.jsx`, `AgendaView.jsx`, `InmueblesView.jsx`, `ConfiguracionView.jsx`, `LoginView.jsx`)
  - **/data** : datos mock para desarrollo y pruebas (`mockClients.js`, `mockEvents.js`, `mockProperties.js`, `mockUsers.js`)
  - **/hooks** : hooks personalizados (ej.: `useClientes.js`)
  - **/lib** : utilitarios y clientes externos (ej.: [src/lib/supabase.js](src/lib/supabase.js))
  - **/schemas** : definiciones de `zod` para validaciones de formularios y datos (ej.: `clientSchema.js`, `eventSchema.js`, `propertySchema.js`)
  - **/services** : capa de comunicación con la API/Supabase (ej.: `clientesService.js`, `eventosService.js`, `propiedadesService.js`)
  - **/store** : tiendas de estado con `zustand` (`appStore.js`, `authStore.js`)
  - **/utils** : utilidades generales (ej.: `notificaciones.js`)

---

## **Flujo y convenciones**

- Validaciones: se centralizan en `src/schemas` usando `zod`.
- Conexión con Supabase: `src/lib/supabase.js` exporta el cliente configurado a partir de las variables `VITE_SUPABASE_*`.
- Servicios: las funciones que consultan/actualizan datos viven en `src/services` para aislar la lógica de red.

---

## **Despliegue**

Generar producción:

```bash
npm run build
```

El contenido generado queda en la carpeta `dist/`. Puedes servirlo con cualquier proveedor estático o usar `npm run preview` para una vista local previa:

```bash
npm run preview
```

Notas: Asegúrate de configurar las variables de entorno en el entorno de despliegue (por ejemplo, en la plataforma de hosting que uses) para que la app pueda inicializar Supabase correctamente.

---

## **Cómo contribuir**

- Fork y crea una rama con un nombre descriptivo: `feature/mi-cambio` o `fix/bug`.
- Asegúrate de ejecutar `npm run lint` y probar la funcionalidad localmente.
- Abre un pull request con descripción clara de los cambios.

Para cambios mayores (nuevas rutas, modelos o esquema de datos), añade notas en el PR sobre la migración de datos y actualización de variables de entorno.

---

## **Contacto y licencia**

Si necesitas más detalles, házmelo saber abriendo un issue o contactando al mantenedor del repositorio.

Licencia: Añade aquí la licencia del proyecto si aplica (por ejemplo MIT).
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
