// src/data/mockProperties.js
// Datos ficticios de inmuebles.

export const mockProperties = [
  {
    id: 'prop-001',
    direccion: 'Bv. Pellegrini 2845, Piso 6 "A", Santa Fe',
    tipo: 'Departamento',
    propietario_id: 'client-001', // Ricardo Mendoza
    inquilino_id: 'client-004',   // Ana Carolina Vázquez
    estado_contrato: 'Vigente',
    monto_alquiler: 385000,
    fecha_vencimiento: '2026-09-30',
    proxima_accion: 'Ajuste IPC trimestral',
    observaciones: 'Cochera fija nº 12. Expensas a cargo del inquilino.',
    presupuestos: [],
  },
  {
    id: 'prop-002',
    direccion: 'San Martín 2780, Local 3, Santa Fe',
    tipo: 'Local Comercial',
    propietario_id: 'client-003', // Bertolino
    inquilino_id: 'client-002',   // Pérez Salvatierra
    estado_contrato: 'Por Vencer',
    monto_alquiler: 720000,
    fecha_vencimiento: '2026-07-15',
    proxima_accion: 'Renovación contractual',
    observaciones: 'Local sobre peatonal. Renovación probable.',
    presupuestos: [],
  },
  {
    id: 'prop-003',
    direccion: 'Rivadavia 3450, Santa Fe',
    tipo: 'Casa',
    propietario_id: 'client-005', // Hugo Frattini
    inquilino_id: null,
    estado_contrato: 'Sin Inquilino',
    monto_alquiler: 0,
    fecha_vencimiento: '2026-06-30',
    proxima_accion: 'Publicar en inmobiliaria',
    observaciones: 'Casa de 3 dorm. con patio. En refacción.',
    presupuestos: [
      { fecha: '2026-06-01', monto: 480000, detalle: 'Pintura interior completa' },
      { fecha: '2026-06-10', monto: 150000, detalle: 'Reparación baño principal' },
    ],
  },
]