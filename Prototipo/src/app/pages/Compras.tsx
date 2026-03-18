import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../components/ui/dialog";
import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Package, Calendar, ArrowRight, AlertCircle, ShoppingCart, X, Trash2 } from "lucide-react";
import { Proyecto, Concepto, EstadoConcepto, EstadoProduccion, OrdenCompra } from "../types";
import { toast } from "sonner";
import { Resizable } from "re-resizable";

const ESTADO_COLORS: Record<string, string> = {
  Creado: "#94a3b8",
  "Pendiente de materiales": "#f59e0b",
  "Listo para produccion": "#3b82f6",
  "En produccion": "#8b5cf6",
  "En pausa": "#ef4444",
  Terminado: "#10b981",
  "En revision": "#6366f1",
  "Listo para entrega": "#059669",
  Entregado: "#047857",
};

const ESTADOS_PRODUCCION: EstadoProduccion[] = ["Fabricacion", "Pintura", "Instalacion", "Barniz"];

export function Compras() {
  const {
    proyectos,
    materiales,
    carpinteros,
    ordenesCompra,
    crearProyecto,
    actualizarProyecto,
    cambiarEstadoProyecto,
    eliminarProyecto,
    crearRequisicion,
    crearOrdenCompra,
    completarOrdenCompra,
    agregarMaterial,
    descontarMaterialesProyecto,
  } = useERP();

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showMaterialesDialog, setShowMaterialesDialog] = useState(false);
  const [showOrdenCompraDialog, setShowOrdenCompraDialog] = useState(false);
  const [showCompletarOrdenDialog, setShowCompletarOrdenDialog] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);
  const [showMaterialesFaltantesDialog, setShowMaterialesFaltantesDialog] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

  // Form states para proyecto
  const [nombre, setNombre] = useState("");
  const [numeroConceptos, setNumeroConceptos] = useState("1");
  const [carpinteroResponsableId, setCarpinteroResponsableId] = useState("");
  const [fechaEntregaProyecto, setFechaEntregaProyecto] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<
    { materialId: string; cantidadRequerida: number }[]
  >([]);
  const [conceptos, setConceptos] = useState<
    {
      nombre: string;
      descripcion: string;
    }[]
  >([{ nombre: "", descripcion: "" }]);

  // Form states para orden de compra
  const [materialOrdenId, setMaterialOrdenId] = useState("");
  const [cantidadOrden, setCantidadOrden] = useState("");
  const [costoOrden, setCostoOrden] = useState("");
  const [fechaRecepcionOrden, setFechaRecepcionOrden] = useState("");

  // Form states para nuevo material
  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);
  const [nuevoMaterialNombre, setNuevoMaterialNombre] = useState("");
  const [nuevoMaterialUnidad, setNuevoMaterialUnidad] = useState("");
  const [nuevoMaterialStock, setNuevoMaterialStock] = useState("");
  const [nuevoMaterialStockMin, setNuevoMaterialStockMin] = useState("");
  const [nuevoMaterialProveedor, setNuevoMaterialProveedor] = useState("");

  const handleCrearProyecto = () => {
    if (!nombre || !numeroConceptos || !carpinteroResponsableId || !fechaEntregaProyecto) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const numConceptos = parseInt(numeroConceptos);
    if (conceptos.length !== numConceptos) {
      toast.error(`Debes definir ${numConceptos} concepto(s)`);
      return;
    }

    for (const concepto of conceptos) {
      if (!concepto.nombre || !concepto.descripcion) {
        toast.error("Todos los conceptos deben tener nombre y descripción");
        return;
      }
    }

    // Crear estados estándar para cada concepto
    const estadosEstandar: EstadoConcepto[] = [
      { nombre: "Fabricación", tipo: "Fabricacion", completado: false },
      { nombre: "Pintura", tipo: "Pintura", completado: false },
      { nombre: "Instalación", tipo: "Instalacion", completado: false },
      { nombre: "Barniz", tipo: "Barniz", completado: false },
    ];

    const conceptosProyecto: Concepto[] = conceptos.map((concepto, index) => ({
      id: `${Date.now()}-${index}`,
      nombre: concepto.nombre,
      descripcion: concepto.descripcion,
      fechaInicio: new Date(),
      fechaEntrega: new Date(fechaEntregaProyecto),
      estados: estadosEstandar,
      materiales: [], // Inicializar con array vacío
    }));

    const nuevoProyecto: Omit<Proyecto, "id" | "fechaCreacion"> = {
      nombre,
      numeroConceptos: numConceptos,
      carpinteroResponsableId,
      conceptos: conceptosProyecto,
      materiales: materialesSeleccionados,
      estado: "Creado",
      documentos: [],
      observaciones,
    };

    crearProyecto(nuevoProyecto);
    toast.success("Proyecto creado exitosamente");
    resetForm();
    setIsCreatingProject(false);
  };

  const resetForm = () => {
    setNombre("");
    setNumeroConceptos("1");
    setCarpinteroResponsableId("");
    setFechaEntregaProyecto("");
    setObservaciones("");
    setMaterialesSeleccionados([]);
    setConceptos([{ nombre: "", descripcion: "" }]);
  };

  const actualizarNumeroConceptos = (num: string) => {
    const n = parseInt(num) || 1;
    setNumeroConceptos(num);
    const newConceptos = Array.from({ length: n }, (_, i) => conceptos[i] || { nombre: "", descripcion: "" });
    setConceptos(newConceptos);
  };

  const actualizarConcepto = (index: number, campo: string, valor: any) => {
    const newConceptos = [...conceptos];
    newConceptos[index] = { ...newConceptos[index], [campo]: valor };
    setConceptos(newConceptos);
  };

  const agregarMaterialProyecto = (materialId: string) => {
    if (!materialesSeleccionados.find((m) => m.materialId === materialId)) {
      setMaterialesSeleccionados([...materialesSeleccionados, { materialId, cantidadRequerida: 1 }]);
    }
  };

  const actualizarCantidadMaterial = (materialId: string, cantidad: number) => {
    setMaterialesSeleccionados(
      materialesSeleccionados.map((m) =>
        m.materialId === materialId ? { ...m, cantidadRequerida: cantidad } : m
      )
    );
  };

  const eliminarMaterial = (materialId: string) => {
    setMaterialesSeleccionados(materialesSeleccionados.filter((m) => m.materialId !== materialId));
  };

  const validarMateriales = (proyecto: Proyecto) => {
    const materialesFaltantes: { materialId: string; cantidad: number }[] = [];
    
    // Primero validar materiales a nivel de proyecto
    proyecto.materiales.forEach((mat) => {
      const material = materiales.find((m) => m.id === mat.materialId);
      if (material && material.stockActual < mat.cantidadRequerida) {
        const existente = materialesFaltantes.find((mf) => mf.materialId === mat.materialId);
        if (existente) {
          existente.cantidad += mat.cantidadRequerida - material.stockActual;
        } else {
          materialesFaltantes.push({
            materialId: mat.materialId,
            cantidad: mat.cantidadRequerida - material.stockActual,
          });
        }
      }
    });
    
    // Luego validar materiales a nivel de concepto (si existen)
    proyecto.conceptos.forEach((concepto) => {
      concepto.materiales.forEach((mat) => {
        const material = materiales.find((m) => m.id === mat.materialId);
        if (material && material.stockActual < mat.cantidad) {
          // Buscar si ya existe este material en faltantes para sumar cantidades
          const existente = materialesFaltantes.find((mf) => mf.materialId === mat.materialId);
          if (existente) {
            existente.cantidad += mat.cantidad - material.stockActual;
          } else {
            materialesFaltantes.push({
              materialId: mat.materialId,
              cantidad: mat.cantidad - material.stockActual,
            });
          }
        }
      });
    });
    
    return materialesFaltantes;
  };

  const solicitarMateriales = (proyectoId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const materialesFaltantes = validarMateriales(proyecto);

    if (materialesFaltantes.length > 0) {
      materialesFaltantes.forEach((mat) => {
        crearRequisicion({
          proyectoId,
          materialId: mat.materialId,
          cantidad: mat.cantidad,
          recibido: false,
        });
      });
      cambiarEstadoProyecto(proyectoId, "Pendiente de materiales");
      toast.success("Requisiciones de materiales creadas");
    } else {
      // Descontar los materiales del stock
      descontarMaterialesProyecto(proyectoId);
      cambiarEstadoProyecto(proyectoId, "Listo para produccion");
      toast.success("Materiales descontados - Proyecto listo para producción");
    }
  };

  const handleEnviarAProduccion = (proyectoId: string) => {
    // Descontar los materiales del stock
    descontarMaterialesProyecto(proyectoId);
    // Cambiar el estado a "Listo para producción"
    cambiarEstadoProyecto(proyectoId, "Listo para produccion");
    toast.success("Materiales descontados - Proyecto listo para producción");
  };

  const handleCrearOrdenCompra = () => {
    if (!materialOrdenId || !cantidadOrden || !costoOrden) {
      toast.error("Completa todos los campos");
      return;
    }

    const material = materiales.find((m) => m.id === materialOrdenId);
    if (!material) return;

    crearOrdenCompra({
      materialId: materialOrdenId,
      cantidad: parseFloat(cantidadOrden),
      unidad: material.unidad,
      costo: parseFloat(costoOrden),
      solicitadoPor: "Sistema de Compras",
    });

    toast.success("Orden de compra creada");
    setMaterialOrdenId("");
    setCantidadOrden("");
    setCostoOrden("");
    setShowOrdenCompraDialog(false);
  };

  const handleCompletarOrden = () => {
    if (!ordenSeleccionada || !fechaRecepcionOrden) {
      toast.error("Ingresa la fecha de recepción");
      return;
    }

    completarOrdenCompra(ordenSeleccionada.id, new Date(fechaRecepcionOrden));
    toast.success("Orden de compra completada y stock actualizado");
    setOrdenSeleccionada(null);
    setFechaRecepcionOrden("");
    setShowCompletarOrdenDialog(false);
  };

  const handleAgregarMaterial = () => {
    if (!nuevoMaterialNombre || !nuevoMaterialUnidad || !nuevoMaterialStock || !nuevoMaterialStockMin) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    agregarMaterial({
      nombre: nuevoMaterialNombre,
      unidad: nuevoMaterialUnidad,
      stockActual: parseFloat(nuevoMaterialStock),
      stockMinimo: parseFloat(nuevoMaterialStockMin),
      cantidad: parseFloat(nuevoMaterialStock),
      proveedor: nuevoMaterialProveedor,
    });

    toast.success("Material agregado exitosamente");
    setNuevoMaterialNombre("");
    setNuevoMaterialUnidad("");
    setNuevoMaterialStock("");
    setNuevoMaterialStockMin("");
    setNuevoMaterialProveedor("");
    setShowAddMaterialDialog(false);
  };

  const handleEliminarProyecto = (proyectoId: string, nombreProyecto: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el proyecto "${nombreProyecto}"?`)) {
      eliminarProyecto(proyectoId);
      toast.success("Proyecto eliminado");
    }
  };

  // Mostrar todos los proyectos en Compras para seguimiento
  const proyectosCompras = proyectos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Módulo de Compras</h2>
          <p className="text-gray-600 mt-1">
            Gestión de proyectos, materiales y órdenes de compra
          </p>
        </div>
        <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Crear Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-none w-fit max-h-[90vh] flex items-center justify-center">
            <Resizable
              defaultSize={{
                width: 900,
                height: 600,
              }}
              minWidth={600}
              minHeight={400}
              maxWidth={1400}
              maxHeight="90vh"
              enable={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
              className="overflow-hidden bg-white rounded-lg"
            >
              <div className="h-full overflow-y-auto p-6 bg-white">
                <DialogHeader className="mb-4">
                  <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                  <DialogDescription>
                    Complete los detalles del proyecto, asigne conceptos y seleccione los materiales necesarios
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre del Proyecto *</Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Cocina Integral"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroConceptos">Número de Conceptos *</Label>
                      <Input
                        id="numeroConceptos"
                        type="number"
                        min="1"
                        value={numeroConceptos}
                        onChange={(e) => actualizarNumeroConceptos(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsable">Carpintero Responsable *</Label>
                      <Select value={carpinteroResponsableId} onValueChange={setCarpinteroResponsableId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar carpintero" />
                        </SelectTrigger>
                        <SelectContent>
                          {carpinteros.map((carp) => (
                            <SelectItem key={carp.id} value={carp.id}>
                              {carp.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaEntrega">Fecha de Entrega *</Label>
                      <Input
                        id="fechaEntrega"
                        type="date"
                        value={fechaEntregaProyecto}
                        onChange={(e) => setFechaEntregaProyecto(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Conceptos */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Conceptos del Proyecto</h3>
                      <span className="text-sm text-gray-600">
                        {conceptos.length} concepto{conceptos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {/* Contenedor con scroll - muestra hasta 5 conceptos a la vez */}
                    <div className="max-h-[650px] overflow-y-auto space-y-3 pr-2">
                      {conceptos.map((concepto, idx) => (
                        <Card key={idx}>
                          <CardHeader>
                            <CardTitle className="text-base">Concepto {idx + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Nombre del Concepto *</Label>
                                <Input
                                  value={concepto.nombre}
                                  onChange={(e) => actualizarConcepto(idx, "nombre", e.target.value)}
                                  placeholder="Ej: Mueble superior"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Descripción *</Label>
                                <Input
                                  value={concepto.descripcion}
                                  onChange={(e) => actualizarConcepto(idx, "descripcion", e.target.value)}
                                  placeholder="Descripción del concepto"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Materiales Requeridos</Label>
                    <Dialog open={showMaterialesDialog} onOpenChange={setShowMaterialesDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                          <Plus className="size-4" />
                          Agregar Material
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Seleccionar Material</DialogTitle>
                          <DialogDescription>
                            Seleccione un material del inventario para agregar al proyecto
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {materiales.map((material) => (
                            <Button
                              key={material.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                agregarMaterialProyecto(material.id);
                                setShowMaterialesDialog(false);
                              }}
                            >
                              {material.nombre} ({material.stockActual} {material.unidad} disponibles)
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {materialesSeleccionados.length > 0 && (
                      <div className="border rounded-lg p-3 space-y-2">
                        {materialesSeleccionados.map((mat) => {
                          const material = materiales.find((m) => m.id === mat.materialId);
                          return (
                            <div key={mat.materialId} className="flex items-center gap-2">
                              <span className="flex-1 text-sm">{material?.nombre}</span>
                              <Input
                                type="number"
                                value={mat.cantidadRequerida}
                                onChange={(e) =>
                                  actualizarCantidadMaterial(mat.materialId, parseInt(e.target.value))
                                }
                                className="w-20"
                                min="1"
                              />
                              <span className="text-sm text-gray-600">{material?.unidad}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => eliminarMaterial(mat.materialId)}
                              >
                                ×
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Observaciones adicionales"
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleCrearProyecto} className="w-full">
                    Crear Proyecto
                  </Button>
                </div>
              </div>
            </Resizable>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="proyectos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="materiales">Almacén</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes de Compra</TabsTrigger>
        </TabsList>

        <TabsContent value="proyectos" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Conceptos</TableHead>
                    <TableHead>Materiales</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyectosCompras.map((proyecto) => {
                    // Solo validar materiales si el proyecto está en estado "Creado" o "Pendiente de materiales"
                    // En otros estados, los materiales ya fueron descontados/asignados
                    const debeValidarMateriales = proyecto.estado === "Creado" || proyecto.estado === "Pendiente de materiales";
                    const materialesFaltantes = debeValidarMateriales ? validarMateriales(proyecto) : [];
                    const carpintero = carpinteros.find((c) => c.id === proyecto.carpinteroResponsableId);
                    
                    // Contar solo los materiales del proyecto
                    const totalMateriales = proyecto.materiales.length;
                    const cantidadFaltantes = materialesFaltantes.length;
                    
                    return (
                      <TableRow key={proyecto.id}>
                        <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: ESTADO_COLORS[proyecto.estado],
                              color: "white",
                            }}
                          >
                            {proyecto.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{carpintero?.nombre || "-"}</TableCell>
                        <TableCell className="text-center">{proyecto.numeroConceptos}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{totalMateriales}</span>
                            {cantidadFaltantes > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => {
                                  setProyectoSeleccionado(proyecto);
                                  setShowMaterialesFaltantesDialog(true);
                                }}
                              >
                                <Badge variant="destructive" className="text-xs cursor-pointer">
                                  <AlertCircle className="size-3 mr-1" />
                                  {cantidadFaltantes} faltante{cantidadFaltantes !== 1 ? 's' : ''}
                                </Badge>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(proyecto.fechaCreacion).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {proyecto.estado === "Creado" && (
                              <Button 
                                onClick={() => solicitarMateriales(proyecto.id)} 
                                size="sm"
                                className="gap-1"
                              >
                                <ArrowRight className="size-4" />
                                Validar
                              </Button>
                            )}
                            {proyecto.estado === "Pendiente de materiales" && materialesFaltantes.length === 0 && (
                              <Button
                                onClick={() => handleEnviarAProduccion(proyecto.id)}
                                size="sm"
                                className="gap-1"
                              >
                                <Package className="size-4" />
                                A Producción
                              </Button>
                            )}
                            {proyecto.estado === "Creado" && (
                              <Button
                                onClick={() => handleEliminarProyecto(proyecto.id, proyecto.nombre)}
                                size="sm"
                                variant="destructive"
                                className="gap-1"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {proyectosCompras.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="size-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay proyectos registrados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="materiales" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Almacén</h3>
            <Dialog open={showAddMaterialDialog} onOpenChange={setShowAddMaterialDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Agregar Material
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-none w-fit max-h-[90vh] flex items-center justify-center">
                <Resizable
                  defaultSize={{
                    width: 600,
                    height: 550,
                  }}
                  minWidth={500}
                  minHeight={450}
                  maxWidth={900}
                  maxHeight="90vh"
                  enable={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  className="overflow-hidden bg-white rounded-lg"
                >
                  <div className="h-full overflow-y-auto flex flex-col p-6 bg-white">
                    <DialogHeader className="mb-4">
                      <DialogTitle>Agregar Nuevo Material</DialogTitle>
                      <DialogDescription>
                        Registre un nuevo material en el inventario de la empresa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input
                          value={nuevoMaterialNombre}
                          onChange={(e) => setNuevoMaterialNombre(e.target.value)}
                          placeholder="Ej: Madera MDF 18mm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Unidad *</Label>
                          <Input
                            value={nuevoMaterialUnidad}
                            onChange={(e) => setNuevoMaterialUnidad(e.target.value)}
                            placeholder="m², litros, piezas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Material Actual *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={nuevoMaterialStock}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setNuevoMaterialStock(value);
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Material Mínimo *</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={nuevoMaterialStockMin}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setNuevoMaterialStockMin(value);
                          }}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Proveedor</Label>
                        <Input
                          value={nuevoMaterialProveedor}
                          onChange={(e) => setNuevoMaterialProveedor(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAgregarMaterial} className="w-full">
                        Agregar Material
                      </Button>
                    </div>
                  </div>
                </Resizable>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Material Actual</TableHead>
                    <TableHead>Material Mínimo</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiales.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.nombre}</TableCell>
                      <TableCell>{material.stockActual}</TableCell>
                      <TableCell>{material.stockMinimo}</TableCell>
                      <TableCell>{material.unidad}</TableCell>
                      <TableCell>{material.proveedor || "-"}</TableCell>
                      <TableCell>
                        {material.stockActual < material.stockMinimo ? (
                          <Badge variant="destructive">Bajo Stock</Badge>
                        ) : (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ordenes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Órdenes de Compra</h3>
            <Dialog open={showOrdenCompraDialog} onOpenChange={setShowOrdenCompraDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <ShoppingCart className="size-4" />
                  Nueva Orden de Compra
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-none w-fit max-h-[90vh] flex items-center justify-center">
                <Resizable
                  defaultSize={{
                    width: 600,
                    height: 450,
                  }}
                  minWidth={500}
                  minHeight={350}
                  maxWidth={900}
                  maxHeight="90vh"
                  enable={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  className="overflow-hidden bg-white rounded-lg"
                >
                  <div className="h-full overflow-y-auto flex flex-col p-6 bg-white">
                    <DialogHeader className="mb-4">
                      <DialogTitle>Crear Orden de Compra</DialogTitle>
                      <DialogDescription>
                        Genere una nueva orden de compra para reabastecer materiales
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto space-y-4">
                      <div className="space-y-2">
                        <Label>Material/Insumo *</Label>
                        <Select value={materialOrdenId} onValueChange={setMaterialOrdenId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar material" />
                          </SelectTrigger>
                          <SelectContent>
                            {materiales.map((mat) => (
                              <SelectItem key={mat.id} value={mat.id}>
                                {mat.nombre} ({mat.unidad})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Cantidad *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={cantidadOrden}
                            onChange={(e) => setCantidadOrden(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Costo Aproximado *</Label>
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={costoOrden}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              // Permitir solo un punto decimal
                              const parts = value.split('.');
                              const sanitized = parts.length > 2 
                                ? parts[0] + '.' + parts.slice(1).join('')
                                : value;
                              setCostoOrden(sanitized);
                            }}
                            placeholder="$0.00"
                          />
                        </div>
                      </div>
                      <Button onClick={handleCrearOrdenCompra} className="w-full">
                        Crear Orden de Compra
                      </Button>
                    </div>
                  </div>
                </Resizable>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ordenesCompra.map((orden) => {
              const material = materiales.find((m) => m.id === orden.materialId);
              return (
                <Card key={orden.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{material?.nombre}</CardTitle>
                      <Badge variant={orden.estado === "Completada" ? "secondary" : "default"}>
                        {orden.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Cantidad:</strong> {orden.cantidad} {orden.unidad}
                    </div>
                    <div className="text-sm">
                      <strong>Costo:</strong> ${orden.costo.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      <strong>Fecha solicitud:</strong>{" "}
                      {new Date(orden.fechaSolicitud).toLocaleDateString("es-ES")}
                    </div>
                    {orden.fechaRecepcion && (
                      <div className="text-sm">
                        <strong>Fecha recepción:</strong>{" "}
                        {new Date(orden.fechaRecepcion).toLocaleDateString("es-ES")}
                      </div>
                    )}
                    {orden.estado === "Pendiente" && (
                      <Button
                        onClick={() => {
                          setOrdenSeleccionada(orden);
                          setShowCompletarOrdenDialog(true);
                        }}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Marcar como Recibido
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {ordenesCompra.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="size-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay órdenes de compra registradas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para completar orden */}
      <Dialog open={showCompletarOrdenDialog} onOpenChange={setShowCompletarOrdenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar Orden de Compra</DialogTitle>
            <DialogDescription>
              Ingrese la fecha de recepción del material para actualizar el inventario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha de Recepción *</Label>
              <Input
                type="date"
                value={fechaRecepcionOrden}
                onChange={(e) => setFechaRecepcionOrden(e.target.value)}
              />
            </div>
            <Button onClick={handleCompletarOrden} className="w-full">
              Confirmar Recepción
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para materiales faltantes */}
      <Dialog open={showMaterialesFaltantesDialog} onOpenChange={setShowMaterialesFaltantesDialog}>
        <DialogContent className="p-0 max-w-none w-fit max-h-[90vh] flex items-center justify-center">
          <Resizable
            defaultSize={{
              width: 1000,
              height: 600,
            }}
            minWidth={700}
            minHeight={400}
            maxWidth={1600}
            maxHeight="90vh"
            enable={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            className="overflow-hidden bg-white rounded-lg"
          >
            <div className="h-full overflow-hidden flex flex-col p-6 bg-white">
              <DialogHeader className="mb-4">
                <DialogTitle>Materiales Faltantes - {proyectoSeleccionado?.nombre}</DialogTitle>
                <DialogDescription>
                  Lista de materiales que no están disponibles en stock para este proyecto
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                {proyectoSeleccionado && (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead>Requerido</TableHead>
                              <TableHead>En Stock</TableHead>
                              <TableHead>Faltante</TableHead>
                              <TableHead>Proveedor</TableHead>
                              <TableHead className="text-right">Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {validarMateriales(proyectoSeleccionado).map((faltante) => {
                              const material = materiales.find((m) => m.id === faltante.materialId);
                              
                              // Buscar el material a nivel de proyecto
                              let cantidadTotalRequerida = 0;
                              const materialProyecto = proyectoSeleccionado.materiales.find(
                                (m) => m.materialId === faltante.materialId
                              );
                              if (materialProyecto) {
                                cantidadTotalRequerida += materialProyecto.cantidadRequerida;
                              }
                              
                              // También sumar materiales a nivel de concepto
                              proyectoSeleccionado.conceptos.forEach((concepto) => {
                                const materialConcepto = concepto.materiales.find(
                                  (m) => m.materialId === faltante.materialId
                                );
                                if (materialConcepto) {
                                  cantidadTotalRequerida += materialConcepto.cantidad;
                                }
                              });
                              
                              return (
                                <TableRow key={faltante.materialId}>
                                  <TableCell className="font-medium">{material?.nombre}</TableCell>
                                  <TableCell>
                                    {cantidadTotalRequerida} {material?.unidad}
                                  </TableCell>
                                  <TableCell className="text-gray-600">
                                    {material?.stockActual} {material?.unidad}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="destructive">
                                      {faltante.cantidad} {material?.unidad}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600">
                                    {material?.proveedor || "-"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setMaterialOrdenId(faltante.materialId);
                                        setCantidadOrden(faltante.cantidad.toString());
                                        setShowMaterialesFaltantesDialog(false);
                                        setShowOrdenCompraDialog(true);
                                      }}
                                    >
                                      <ShoppingCart className="size-4 mr-1" />
                                      Crear Orden
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <p className="text-sm text-gray-600">
                  💡 Puedes crear órdenes de compra directamente desde aquí
                </p>
                <Button variant="outline" onClick={() => setShowMaterialesFaltantesDialog(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </Resizable>
        </DialogContent>
      </Dialog>
    </div>
  );
}