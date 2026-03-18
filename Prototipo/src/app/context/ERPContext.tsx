import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Proyecto,
  Material,
  Carpintero,
  Notificacion,
  RequisicionMaterial,
  OrdenCompra,
  EstadoProyecto,
  TipoNotificacion,
} from "../types";

interface ERPContextType {
  proyectos: Proyecto[];
  materiales: Material[];
  carpinteros: Carpintero[];
  notificaciones: Notificacion[];
  requisiciones: RequisicionMaterial[];
  ordenesCompra: OrdenCompra[];
  crearProyecto: (proyecto: Omit<Proyecto, "id" | "fechaCreacion">) => void;
  actualizarProyecto: (id: string, proyecto: Partial<Proyecto>) => void;
  cambiarEstadoProyecto: (id: string, estado: EstadoProyecto) => void;
  eliminarProyecto: (id: string) => void;
  agregarMaterial: (material: Omit<Material, "id">) => void;
  actualizarMaterial: (id: string, material: Partial<Material>) => void;
  agregarCarpintero: (carpintero: Omit<Carpintero, "id">) => void;
  actualizarCarpintero: (id: string, carpintero: Partial<Carpintero>) => void;
  eliminarCarpintero: (id: string) => void;
  crearRequisicion: (requisicion: Omit<RequisicionMaterial, "id" | "fechaSolicitud">) => void;
  marcarRequisicionRecibida: (id: string) => void;
  crearOrdenCompra: (orden: Omit<OrdenCompra, "id" | "fechaSolicitud" | "estado">) => void;
  completarOrdenCompra: (id: string, fechaRecepcion: Date) => void;
  crearNotificacion: (tipo: TipoNotificacion, mensaje: string, proyectoId: string) => void;
  marcarNotificacionLeida: (id: string) => void;
  descontarMaterialesProyecto: (proyectoId: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const STORAGE_KEYS = {
  proyectos: "erp_proyectos",
  materiales: "erp_materiales",
  carpinteros: "erp_carpinteros",
  notificaciones: "erp_notificaciones",
  requisiciones: "erp_requisiciones",
  ordenesCompra: "erp_ordenes_compra",
};

// Datos iniciales de ejemplo
const materialesIniciales: Material[] = [
  { id: "1", nombre: "Madera MDF 18mm", cantidad: 100, unidad: "m²", stockMinimo: 20, stockActual: 100, proveedor: "Maderera Central" },
  { id: "2", nombre: "Madera Pino", cantidad: 50, unidad: "m²", stockMinimo: 10, stockActual: 50, proveedor: "Maderera Central" },
  { id: "3", nombre: "Barniz transparente", cantidad: 30, unidad: "litros", stockMinimo: 5, stockActual: 30, proveedor: "Pinturas SA" },
  { id: "4", nombre: "Pintura blanca", cantidad: 25, unidad: "litros", stockMinimo: 5, stockActual: 25, proveedor: "Pinturas SA" },
  { id: "5", nombre: "Bisagras metálicas", cantidad: 200, unidad: "piezas", stockMinimo: 50, stockActual: 200, proveedor: "Ferreterías Unidos" },
  { id: "6", nombre: "Tornillos", cantidad: 500, unidad: "piezas", stockMinimo: 100, stockActual: 500, proveedor: "Ferreterías Unidos" },
];

const carpinterosIniciales: Carpintero[] = [
  { id: "1", nombre: "Juan Pérez", disponible: true },
  { id: "2", nombre: "María García", disponible: true },
  { id: "3", nombre: "Carlos López", disponible: true },
  { id: "4", nombre: "Ana Martínez", disponible: true },
  { id: "5", nombre: "Alejandro Martinez", disponible: true},
  { id: "6", nombre: "Gabriel Marquez", disponible: true}
];

// Proyecto de ejemplo precargado
const proyectosIniciales: Proyecto[] = [
  {
    id: "proyecto-demo-1",
    nombre: "Cocina Integral Moderna",
    numeroConceptos: 3,
    carpinteroResponsableId: "1", // Juan Pérez
    estado: "Creado",
    fechaCreacion: new Date("2024-03-01"),
    observaciones: "Proyecto de cocina integral con acabados en MDF blanco. Cliente solicita entrega antes de fin de mes.",
    documentos: [],
    materiales: [
      { materialId: "1", cantidadRequerida: 45 }, // MDF
      { materialId: "4", cantidadRequerida: 8 },  // Pintura blanca
      { materialId: "5", cantidadRequerida: 24 }, // Bisagras
      { materialId: "6", cantidadRequerida: 150 }, // Tornillos
    ],
    conceptos: [
      {
        id: "concepto-1",
        nombre: "Muebles superiores",
        descripcion: "Gabinetes superiores de cocina con puertas y entrepaños",
        fechaInicio: new Date("2024-03-02"),
        fechaEntrega: new Date("2024-03-10"),
        materiales: [
          { materialId: "1", cantidad: 15 }, // MDF 15 m²
          { materialId: "4", cantidad: 3 },  // Pintura 3 litros
          { materialId: "5", cantidad: 8 },  // Bisagras 8 piezas
          { materialId: "6", cantidad: 50 }, // Tornillos 50 piezas
        ],
        estados: [
          { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
          { nombre: "Pintura", tipo: "Pintura", completado: false },
          { nombre: "Instalación", tipo: "Instalacion", completado: false },
          { nombre: "Barniz", tipo: "Barniz", completado: false },
        ],
      },
      {
        id: "concepto-2",
        nombre: "Muebles inferiores",
        descripcion: "Gabinetes inferiores con cajones y puertas",
        fechaInicio: new Date("2024-03-11"),
        fechaEntrega: new Date("2024-03-18"),
        materiales: [
          { materialId: "1", cantidad: 20 }, // MDF 20 m²
          { materialId: "4", cantidad: 3 },  // Pintura 3 litros
          { materialId: "5", cantidad: 12 }, // Bisagras 12 piezas
          { materialId: "6", cantidad: 70 }, // Tornillos 70 piezas
        ],
        estados: [
          { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
          { nombre: "Pintura", tipo: "Pintura", completado: false },
          { nombre: "Instalación", tipo: "Instalacion", completado: false },
          { nombre: "Barniz", tipo: "Barniz", completado: false },
        ],
      },
      {
        id: "concepto-3",
        nombre: "Isla central",
        descripcion: "Isla de cocina con barra desayunador",
        fechaInicio: new Date("2024-03-19"),
        fechaEntrega: new Date("2024-03-25"),
        materiales: [
          { materialId: "1", cantidad: 10 }, // MDF 10 m²
          { materialId: "4", cantidad: 2 },  // Pintura 2 litros
          { materialId: "5", cantidad: 4 },  // Bisagras 4 piezas
          { materialId: "6", cantidad: 30 }, // Tornillos 30 piezas
        ],
        estados: [
          { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
          { nombre: "Pintura", tipo: "Pintura", completado: false },
          { nombre: "Instalación", tipo: "Instalacion", completado: false },
          { nombre: "Barniz", tipo: "Barniz", completado: false },
        ],
      },
    ],
  },
  {
  id: "proyecto-demo-2",
  nombre: "Casa Pinelos",
  numeroConceptos: 13,
  carpinteroResponsableId: "2", // María García
  estado: "Listo para produccion",
  fechaCreacion: new Date("2026-03-18"),
  observaciones: "###",
  documentos: [],
  materiales: [
    { materialId: "1", cantidadRequerida: 45 }, // MDF
    { materialId: "4", cantidadRequerida: 8 },  // Pintura blanca
    { materialId: "5", cantidadRequerida: 24 }, // Bisagras
    { materialId: "6", cantidadRequerida: 150 }, // Tornillos
  ],
  conceptos: [
    {
      id: "concepto-1_1",
      nombre: "P01",
      descripcion: "Acceso PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: true },
        { nombre: "Pintura", tipo: "Pintura", completado: true },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-2_1",
      nombre: "P02",
      descripcion: "Acceso Medio Baño",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: true },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-3_1",
      nombre: "P03A",
      descripcion: "Cocina - Cochera",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-4_1",
      nombre: "P03A",
      descripcion: "Acceso rec 2",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-5_1",
      nombre: "P03A",
      descripcion: "Closet Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-6_1",
      nombre: "P03B",
      descripcion: "Acceso Rec 1",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-7_1",
      nombre: "P04",
      descripcion: "Comedor Cocina CORREDIZA",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-8_1",
      nombre: "P05",
      descripcion: "Sala Fam",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-9_1",
      nombre: "P06",
      descripcion: "Acceso Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-10_1",
      nombre: "P07A",
      descripcion: "Closet Rec 1",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-11_1",
      nombre: "P07B",
      descripcion: "Closet Rec 2",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-12_1",
      nombre: "P08A",
      descripcion: "Acceso Wc Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-13_1",
      nombre: "P08B",
      descripcion: "Lavanderia",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    ]
  },
  {
  id: "proyecto-demo-3",
  nombre: "Casa MG",
  numeroConceptos: 40,
  carpinteroResponsableId: "6",
  estado: "Creado",
  fechaCreacion: new Date("2026-03-18"),
  observaciones: "###",
  documentos: [],
  materiales: [
    { materialId: "1", cantidadRequerida: 45 }, // MDF
    { materialId: "4", cantidadRequerida: 8 },  // Pintura blanca
    { materialId: "5", cantidadRequerida: 24 }, // Bisagras
    { materialId: "6", cantidadRequerida: 150 }, // Tornillos
  ],
  conceptos: [
    {
      id: "concepto-1_2",
      nombre: "CARP-01",
      descripcion: "Puerta PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-2_2",
      nombre: "CARP-02",
      descripcion: "Puerta Corrediza Cocina",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-3_2",
      nombre: "CARP-03",
      descripcion: "Acceso Area Servicio",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-4_2",
      nombre: "CARP-04",
      descripcion: "Acceso Rec Servicio",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-5_2",
      nombre: "CARP-05",
      descripcion: "Baño Rec Servicio",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-6_2",
      nombre: "CARP-06",
      descripcion: "Alacena",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-7_2",
      nombre: "CARP-07",
      descripcion: "Puerta Bajo Escalera (Muro)",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-8_2",
      nombre: "CARP-08",
      descripcion: "Puerta Comedor / Oficina",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-9_2",
      nombre: "CARP-09",
      descripcion: "Acceso Baño Bar",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-10_2",
      nombre: "CARP-10",
      descripcion: "Sala-Comedor Bar",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-11_2",
      nombre: "CARP-11",
      descripcion: "Acceso Gym",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-12_2",
      nombre: "CARP-12",
      descripcion: "Acceso Closet Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-13_2",
      nombre: "CARP-13",
      descripcion: "Gym-Family Room",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-14_2",
      nombre: "CARP-14",
      descripcion: "Acceso Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-15_2",
      nombre: "CARP-15",
      descripcion: "Puerta Bodega PA",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-16_2",
      nombre: "CARP-16",
      descripcion: "Corrediza Escaleras PA",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-17_2",
      nombre: "CARP-17",
      descripcion: "Acceso Rec-01",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-18_2",
      nombre: "CARP-18",
      descripcion: "Closet Rec 01",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-19_2",
      nombre: "CARP-19",
      descripcion: "Acceso Rec 02",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-20_2",
      nombre: "CARP-20",
      descripcion: "Baño Closet Rec 02",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-21_2",
      nombre: "CARP-21",
      descripcion: "Acceso Family Room",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-22_2",
      nombre: "CARP-22",
      descripcion: "Puerta WC Rec 01",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-23_2",
      nombre: "CARP-23",
      descripcion: "Puerta WC Rec 01",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-24_2",
      nombre: "CARP-24",
      descripcion: "Bajo Lavabo Bar",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-25_2",
      nombre: "CARP-25",
      descripcion: "Bajo Lavabo Terraza",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-26_2",
      nombre: "CARP-26",
      descripcion: "Bajo Lavabo Medio Baño",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-27_2",
      nombre: "CARP-27",
      descripcion: "Closet 02",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-28_2",
      nombre: "CARP-28",
      descripcion: "Closet Baño Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-29_2",
      nombre: "CARP-29",
      descripcion: "Closet 01",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-30_2",
      nombre: "CARP-30",
      descripcion: "Bajo Lavabo Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-31_2",
      nombre: "CARP-31",
      descripcion: "Mueble Sala Comedor Bar",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-32_2",
      nombre: "CARP-32",
      descripcion: "Muro Celosía y Repisas",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-33_2",
      nombre: "CARP-33",
      descripcion: "Mueble de TV Sala / Comedor/Bar",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-34_2",
      nombre: "CARP-34",
      descripcion: "Mueble Celosía",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-35_2",
      nombre: "CARP-35",
      descripcion: "Closet PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-36_2",
      nombre: "CARP-36",
      descripcion: "Puerta Abatible Baño Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-37_2",
      nombre: "CARP-37",
      descripcion: "",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-38_2",
      nombre: "CARP-38",
      descripcion: "Mueble Rec PPL 2",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-39_2",
      nombre: "CARP-39",
      descripcion: "Cajonera Rec PPL",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
    {
      id: "concepto-40_2",
      nombre: "CARP-40",
      descripcion: "Mueble Terraza",
      fechaInicio: new Date("2026-03-18"),
      fechaEntrega: new Date("2026-04-01"),
      materiales: [],
      estados: [
        { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
        { nombre: "Pintura", tipo: "Pintura", completado: false },
        { nombre: "Instalación", tipo: "Instalacion", completado: false },
        { nombre: "Barniz", tipo: "Barniz", completado: false },
      ],
    },
]
  },

];

export function ERPProvider({ children }: { children: ReactNode }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.proyectos);
    if (stored) {
      const parsedProyectos = JSON.parse(stored);
      // Migración: Asegurar que todos los conceptos tengan la propiedad materiales
      return parsedProyectos.map((proyecto: Proyecto) => ({
        ...proyecto,
        conceptos: proyecto.conceptos.map((concepto: any) => ({
          ...concepto,
          materiales: concepto.materiales || [], // Si no existe, inicializar como array vacío
        })),
      }));
    }
    return proyectosIniciales;
  });

  const [materiales, setMateriales] = useState<Material[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.materiales);
    return stored ? JSON.parse(stored) : materialesIniciales;
  });

  const [carpinteros, setCarpinteros] = useState<Carpintero[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.carpinteros);
    return stored ? JSON.parse(stored) : carpinterosIniciales;
  });

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.notificaciones);
    return stored ? JSON.parse(stored) : [];
  });

  const [requisiciones, setRequisiciones] = useState<RequisicionMaterial[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.requisiciones);
    return stored ? JSON.parse(stored) : [];
  });

  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ordenesCompra);
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.proyectos, JSON.stringify(proyectos));
  }, [proyectos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.materiales, JSON.stringify(materiales));
  }, [materiales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.carpinteros, JSON.stringify(carpinteros));
  }, [carpinteros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notificaciones, JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.requisiciones, JSON.stringify(requisiciones));
  }, [requisiciones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ordenesCompra, JSON.stringify(ordenesCompra));
  }, [ordenesCompra]);

  // Actualizar automáticamente el estado de los carpinteros según proyectos activos
  useEffect(() => {
    const actualizaciones: { id: string; disponible: boolean }[] = [];
    
    carpinteros.forEach((carpintero) => {
      const proyectosActivos = proyectos.filter(
        (p) =>
          p.carpinteroResponsableId === carpintero.id &&
          p.estado !== "Entregado" &&
          p.estado !== "Terminado"
      );
      const debeEstarDisponible = proyectosActivos.length === 0;
      
      if (carpintero.disponible !== debeEstarDisponible) {
        actualizaciones.push({ id: carpintero.id, disponible: debeEstarDisponible });
      }
    });

    if (actualizaciones.length > 0) {
      setCarpinteros((prev) =>
        prev.map((c) => {
          const actualizacion = actualizaciones.find((a) => a.id === c.id);
          return actualizacion ? { ...c, disponible: actualizacion.disponible } : c;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyectos]);

  const crearProyecto = (proyecto: Omit<Proyecto, "id" | "fechaCreacion">) => {
    const nuevoProyecto: Proyecto = {
      ...proyecto,
      id: Date.now().toString(),
      fechaCreacion: new Date(),
    };
    setProyectos((prev) => [...prev, nuevoProyecto]);
    crearNotificacion("Cambio de estado", `Proyecto "${proyecto.nombre}" creado`, nuevoProyecto.id);
  };

  const actualizarProyecto = (id: string, proyecto: Partial<Proyecto>) => {
    setProyectos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...proyecto } : p))
    );
  };

  const cambiarEstadoProyecto = (id: string, estado: EstadoProyecto) => {
    const proyecto = proyectos.find((p) => p.id === id);
    if (proyecto) {
      actualizarProyecto(id, { estado });
      crearNotificacion("Cambio de estado", `Proyecto "${proyecto.nombre}" cambió a ${estado}`, id);
    }
  };

  const eliminarProyecto = (id: string) => {
    setProyectos((prev) => prev.filter((p) => p.id !== id));
    crearNotificacion("Cambio de estado", `Proyecto "${id}" eliminado`, id);
  };

  const agregarMaterial = (material: Omit<Material, "id">) => {
    const nuevoMaterial: Material = {
      ...material,
      id: Date.now().toString(),
    };
    setMateriales((prev) => [...prev, nuevoMaterial]);
  };

  const actualizarMaterial = (id: string, material: Partial<Material>) => {
    setMateriales((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...material } : m))
    );
  };

  const agregarCarpintero = (carpintero: Omit<Carpintero, "id">) => {
    const nuevoCarpintero: Carpintero = {
      ...carpintero,
      id: Date.now().toString(),
    };
    setCarpinteros((prev) => [...prev, nuevoCarpintero]);
  };

  const actualizarCarpintero = (id: string, carpintero: Partial<Carpintero>) => {
    setCarpinteros((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...carpintero } : c))
    );
  };

  const eliminarCarpintero = (id: string) => {
    setCarpinteros((prev) => prev.filter((c) => c.id !== id));
  };

  const crearRequisicion = (requisicion: Omit<RequisicionMaterial, "id" | "fechaSolicitud">) => {
    const nuevaRequisicion: RequisicionMaterial = {
      ...requisicion,
      id: Date.now().toString(),
      fechaSolicitud: new Date(),
      recibido: false,
    };
    setRequisiciones((prev) => [...prev, nuevaRequisicion]);

    const material = materiales.find((m) => m.id === requisicion.materialId);
    const proyecto = proyectos.find((p) => p.id === requisicion.proyectoId);
    if (material && proyecto) {
      crearNotificacion(
        "Material faltante",
        `Se requieren ${requisicion.cantidad} ${material.unidad} de ${material.nombre} para proyecto "${proyecto.nombre}"`,
        requisicion.proyectoId
      );
    }
  };

  const marcarRequisicionRecibida = (id: string) => {
    const requisicion = requisiciones.find((r) => r.id === id);
    if (requisicion) {
      setRequisiciones((prev) =>
        prev.map((r) => (r.id === id ? { ...r, recibido: true } : r))
      );

      const material = materiales.find((m) => m.id === requisicion.materialId);
      const proyecto = proyectos.find((p) => p.id === requisicion.proyectoId);

      if (material) {
        actualizarMaterial(material.id, {
          stockActual: material.stockActual + requisicion.cantidad,
        });
      }

      if (material && proyecto) {
        crearNotificacion(
          "Material recibido",
          `Recibidos ${requisicion.cantidad} ${material.unidad} de ${material.nombre} para proyecto "${proyecto.nombre}"`,
          requisicion.proyectoId
        );
      }
    }
  };

  const crearOrdenCompra = (orden: Omit<OrdenCompra, "id" | "fechaSolicitud" | "estado">) => {
    const nuevaOrden: OrdenCompra = {
      ...orden,
      id: Date.now().toString(),
      fechaSolicitud: new Date(),
      estado: "Pendiente",
    };
    setOrdenesCompra((prev) => [...prev, nuevaOrden]);

    const material = materiales.find((m) => m.id === orden.materialId);
    if (material) {
      // Crear una notificación genérica sin proyecto específico
      crearNotificacion(
        "Orden de compra",
        `Orden de compra creada: ${orden.cantidad} ${material.unidad} de ${material.nombre}`,
        "" // Sin proyecto asociado
      );
    }
  };

  const completarOrdenCompra = (id: string, fechaRecepcion: Date) => {
    const orden = ordenesCompra.find((o) => o.id === id);
    if (orden) {
      setOrdenesCompra((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: "Completada", fechaRecepcion } : o))
      );

      const material = materiales.find((m) => m.id === orden.materialId);

      if (material) {
        actualizarMaterial(material.id, {
          stockActual: material.stockActual + orden.cantidad,
        });
        
        // Crear una notificación genérica sin proyecto específico
        crearNotificacion(
          "Material recibido",
          `Orden completada: Recibidos ${orden.cantidad} ${material.unidad} de ${material.nombre}`,
          "" // Sin proyecto asociado
        );
      }
    }
  };

  const crearNotificacion = (tipo: TipoNotificacion, mensaje: string, proyectoId: string) => {
    const nuevaNotificacion: Notificacion = {
      id: Date.now().toString(),
      tipo,
      mensaje,
      proyectoId,
      fecha: new Date(),
      leida: false,
    };
    setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
  };

  const marcarNotificacionLeida = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const descontarMaterialesProyecto = (proyectoId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (proyecto) {
      // Primero, descontar materiales a nivel de proyecto
      proyecto.materiales.forEach((materialProyecto) => {
        const material = materiales.find((m) => m.id === materialProyecto.materialId);
        if (material) {
          actualizarMaterial(material.id, {
            stockActual: material.stockActual - materialProyecto.cantidadRequerida,
          });
        }
      });
      
      // Luego, descontar materiales a nivel de concepto (si existen)
      proyecto.conceptos.forEach((concepto) => {
        concepto.materiales.forEach((materialConcepto) => {
          const material = materiales.find((m) => m.id === materialConcepto.materialId);
          if (material) {
            actualizarMaterial(material.id, {
              stockActual: material.stockActual - materialConcepto.cantidad,
            });
          }
        });
      });
      
      crearNotificacion(
        "Cambio de estado",
        `Se descontaron los materiales para el proyecto "${proyecto.nombre}"`,
        proyectoId
      );
    }
  };

  return (
    <ERPContext.Provider
      value={{
        proyectos,
        materiales,
        carpinteros,
        notificaciones,
        requisiciones,
        ordenesCompra,
        crearProyecto,
        actualizarProyecto,
        cambiarEstadoProyecto,
        eliminarProyecto,
        agregarMaterial,
        actualizarMaterial,
        agregarCarpintero,
        actualizarCarpintero,
        eliminarCarpintero,
        crearRequisicion,
        marcarRequisicionRecibida,
        crearOrdenCompra,
        completarOrdenCompra,
        crearNotificacion,
        marcarNotificacionLeida,
        descontarMaterialesProyecto,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error("useERP debe ser usado dentro de un ERPProvider");
  }
  return context;
}