export type EstadoProyecto =
  | "Creado"
  | "Pendiente de materiales"
  | "Listo para produccion"
  | "En produccion"
  | "En pausa"
  | "Terminado"
  | "En revision"
  | "Listo para entrega"
  | "Entregado";

export type EstadoProduccion = "Fabricacion" | "Pintura" | "Instalacion" | "Barniz";

export type TipoNotificacion =
  | "Material faltante"
  | "Material recibido"
  | "Fecha de entrega próxima"
  | "Cambio de estado"
  | "Orden de compra";

export type EstadoOrdenCompra = "Pendiente" | "Completada";

export interface Material {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  stockMinimo: number;
  stockActual: number;
  proveedor?: string;
  costoPromedio?: number;
}

export interface Carpintero {
  id: string;
  nombre: string;
  disponible: boolean;
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: "Plano" | "Diseño" | "Especificación" | "Otro";
  url: string;
  fechaSubida: Date;
}

export interface EstadoConcepto {
  nombre: string; // Nombre personalizado del estado
  tipo: EstadoProduccion; // Tipo base al que está ligado
  completado: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface Concepto {
  id: string;
  nombre: string; // Nombre del concepto
  descripcion: string;
  fechaInicio: Date;
  fechaEntrega: Date;
  estados: EstadoConcepto[];
  materiales: { materialId: string; cantidad: number }[]; // Materiales específicos del concepto
}

export interface Proyecto {
  id: string;
  nombre: string;
  numeroConceptos: number;
  carpinteroResponsableId: string; // ID del carpintero responsable
  conceptos: Concepto[];
  materiales: { materialId: string; cantidadRequerida: number }[];
  estado: EstadoProyecto;
  documentos: Documento[];
  fechaCreacion: Date;
  fechaEstimadaMateriales?: Date;
  fechaEntrega?: Date; // Fecha real de entrega al cliente
  observaciones?: string;
}

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  mensaje: string;
  proyectoId: string;
  fecha: Date;
  leida: boolean;
}

export interface RequisicionMaterial {
  id: string;
  proyectoId: string;
  materialId: string;
  cantidad: number;
  fechaSolicitud: Date;
  fechaEstimadaLlegada?: Date;
  recibido: boolean;
}

export interface OrdenCompra {
  id: string;
  materialId: string;
  cantidad: number;
  unidad: string;
  costo: number;
  estado: EstadoOrdenCompra;
  fechaSolicitud: Date;
  fechaRecepcion?: Date;
  solicitadoPor: string;
}