import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Plus,
  Settings,
  FileText,
  Package,
  Users,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

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

export function Administracion() {
  const {
    proyectos,
    materiales,
    carpinteros,
    agregarMaterial,
    actualizarMaterial,
    agregarCarpintero,
    actualizarCarpintero,
    eliminarCarpintero,
    actualizarProyecto,
  } = useERP();

  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);
  const [showAddCarpinteroDialog, setShowAddCarpinteroDialog] = useState(false);
  const [showReasignarDialog, setShowReasignarDialog] = useState(false);
  const [carpinteroAEliminar, setCarpinteroAEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const [reasignaciones, setReasignaciones] = useState<Record<string, string>>({});
  
  // Estado para navegación semanal
  const [semanaOffset, setSemanaOffset] = useState<number | null>(0); // 0 = semana actual, -1 = semana pasada, null = todos

  // Form states para material
  const [nuevoMaterialNombre, setNuevoMaterialNombre] = useState("");
  const [nuevoMaterialUnidad, setNuevoMaterialUnidad] = useState("");
  const [nuevoMaterialStock, setNuevoMaterialStock] = useState("");
  const [nuevoMaterialStockMin, setNuevoMaterialStockMin] = useState("");
  const [nuevoMaterialProveedor, setNuevoMaterialProveedor] = useState("");

  // Form states para carpintero
  const [nuevoCarpinteroNombre, setNuevoCarpinteroNombre] = useState("");

  const handleAgregarMaterial = () => {
    if (!nuevoMaterialNombre || !nuevoMaterialUnidad || !nuevoMaterialStock || !nuevoMaterialStockMin) {
      toast.error("Por favor completa todos los campos requeridos");
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

  const handleAgregarCarpintero = () => {
    if (!nuevoCarpinteroNombre) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    agregarCarpintero({
      nombre: nuevoCarpinteroNombre,
      disponible: true,
    });

    toast.success("Carpintero agregado exitosamente");
    setNuevoCarpinteroNombre("");
    setShowAddCarpinteroDialog(false);
  };

  const handleEliminarCarpintero = (carpinteroId: string, nombreCarpintero: string) => {
    // Verificar si tiene proyectos asignados
    const proyectosAsignados = proyectos.filter((p) => p.carpinteroResponsableId === carpinteroId);
    
    if (proyectosAsignados.length > 0) {
      // Abrir diálogo de reasignación
      setCarpinteroAEliminar({ id: carpinteroId, nombre: nombreCarpintero });
      // Inicializar reasignaciones vacías
      const reasignacionesIniciales: Record<string, string> = {};
      proyectosAsignados.forEach((p) => {
        reasignacionesIniciales[p.id] = "";
      });
      setReasignaciones(reasignacionesIniciales);
      setShowReasignarDialog(true);
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar al carpintero "${nombreCarpintero}"?`)) {
      eliminarCarpintero(carpinteroId);
      toast.success("Carpintero eliminado exitosamente");
    }
  };

  const handleReasignarProyecto = (proyectoId: string, nuevoCarpinteroId: string) => {
    setReasignaciones((prev) => ({
      ...prev,
      [proyectoId]: nuevoCarpinteroId,
    }));
  };

  const handleConfirmarReasignacion = () => {
    if (!carpinteroAEliminar) return;

    const proyectosAsignados = proyectos.filter((p) => p.carpinteroResponsableId === carpinteroAEliminar.id);
    
    // Validar que todos los proyectos tengan un carpintero asignado
    const todosTienenCarpintero = proyectosAsignados.every((p) => reasignaciones[p.id] && reasignaciones[p.id] !== "");
    
    if (!todosTienenCarpintero) {
      toast.error("Por favor asigna un carpintero a todos los proyectos");
      return;
    }

    // Reasignar proyectos
    proyectosAsignados.forEach((proyecto) => {
      const nuevoCarpinteroId = reasignaciones[proyecto.id];
      actualizarProyecto(proyecto.id, { carpinteroResponsableId: nuevoCarpinteroId });
    });

    // Eliminar carpintero
    eliminarCarpintero(carpinteroAEliminar.id);
    
    toast.success(`Carpintero "${carpinteroAEliminar.nombre}" eliminado y ${proyectosAsignados.length} proyecto(s) reasignado(s)`);
    
    // Limpiar estado
    setShowReasignarDialog(false);
    setCarpinteroAEliminar(null);
    setReasignaciones({});
  };

  const handleCancelarReasignacion = () => {
    setShowReasignarDialog(false);
    setCarpinteroAEliminar(null);
    setReasignaciones({});
  };

  const generarReporteSemanal = () => {
    const fechaActual = new Date();
    const semanaAtras = new Date(fechaActual.getTime() - 7 * 24 * 60 * 60 * 1000);

    const proyectosSemanales = proyectos.filter(
      (p) => new Date(p.fechaCreacion) >= semanaAtras
    );

    const reporte = {
      fecha: fechaActual.toLocaleDateString("es-ES"),
      totalProyectos: proyectos.length,
      proyectosNuevos: proyectosSemanales.length,
      enProduccion: proyectos.filter((p) => p.estado === "En produccion").length,
      terminados: proyectos.filter((p) => p.estado === "Terminado").length,
      entregados: proyectos.filter((p) => p.estado === "Entregado").length,
      carpinterosActivos: carpinteros.filter((c) => !c.disponible).length,
      materialesBajoStock: materiales.filter((m) => m.stockActual < m.stockMinimo).length,
    };

    console.log("Reporte Semanal:", reporte);
    toast.success("Reporte generado (ver consola)");
  };

  const generarReporteCarpinteros = () => {
    const reporteCarpinteros = carpinteros.map((carpintero) => {
      const proyectosAsignados = proyectos.filter((p) =>
        p.carpinteroResponsableId === carpintero.id
      );

      return {
        nombre: carpintero.nombre,
        proyectosActivos: proyectosAsignados.length,
        disponible: carpintero.disponible,
      };
    });

    console.log("Reporte de Carpinteros:", reporteCarpinteros);
    toast.success("Reporte de carpinteros generado (ver consola)");
  };

  // Estadísticas para Dashboard
  const totalProyectos = proyectos.length;
  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "En produccion" || p.estado === "Listo para produccion"
  ).length;
  const materialesBajoStock = materiales.filter(
    (m) => m.stockActual < m.stockMinimo
  ).length;
  const carpinterosDisponibles = carpinteros.filter((c) => c.disponible).length;

  // Distribución de proyectos por estado
  const estadosData = Object.keys(ESTADO_COLORS).map((estado) => ({
    name: estado,
    value: proyectos.filter((p) => p.estado === estado).length,
  })).filter(d => d.value > 0);

  // Función auxiliar para obtener el inicio de la semana (domingo)
  const getStartOfWeek = (date: Date, offset: number = 0): Date => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const diff = d.getDate() - day + (offset * 7);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Función auxiliar para obtener el fin de la semana (sábado)
  const getEndOfWeek = (startOfWeek: Date): Date => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  // Calcular inicio y fin de la semana seleccionada
  const semanaInicio = getStartOfWeek(new Date(), semanaOffset || 0);
  const semanaFin = getEndOfWeek(semanaInicio);

  // Formatear rango de fechas
  const formatearRangoSemana = () => {
    if (semanaOffset === null) return "Todos los proyectos";
    
    const inicio = semanaInicio.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    const fin = semanaFin.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    return `${inicio} - ${fin}`;
  };

  // Porcentaje de completado por proyecto (filtrado por semana)
  const proyectosFiltrados = proyectos.filter((proyecto) => {
    if (semanaOffset === null) return true;
    
    const fechaCreacion = new Date(proyecto.fechaCreacion);
    return fechaCreacion >= semanaInicio && fechaCreacion <= semanaFin;
  });

  const proyectosConAvance = proyectosFiltrados.map((proyecto) => {
    const totalEstados = proyecto.conceptos.reduce((acc, c) => acc + c.estados.length, 0);
    const completados = proyecto.conceptos.reduce(
      (acc, c) => acc + c.estados.filter((e) => e.completado).length,
      0
    );
    const porcentaje = totalEstados > 0 ? Math.round((completados / totalEstados) * 100) : 0;
    const nombreBase = proyecto.nombre.length > 15 ? proyecto.nombre.substring(0, 15) + "..." : proyecto.nombre;
    return {
      id: proyecto.id,
      nombre: nombreBase,
      nombreParaGrafico: `${nombreBase}-${proyecto.id.substring(0, 4)}`, // Key única para visualización
      completado: porcentaje,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Módulo de Administración</h2>
        <p className="text-gray-600 mt-1">
          Gestión de catálogos, vista global y reportes
        </p>
      </div>

      <Tabs defaultValue="proyectos" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="proyectos">
            <Package className="size-4 mr-2" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="materiales">
            <Settings className="size-4 mr-2" />
            Almacén
          </TabsTrigger>
          <TabsTrigger value="carpinteros">
            <Users className="size-4 mr-2" />
            Carpinteros
          </TabsTrigger>
          <TabsTrigger value="reportes">
            <FileText className="size-4 mr-2" />
            Reportes
          </TabsTrigger>
        </TabsList>

        {/* Vista Global de Proyectos */}
        <TabsContent value="proyectos" className="space-y-4">
          {/* Dashboard KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Proyectos
                </CardTitle>
                <Package className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProyectos}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {proyectosActivos} activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Carpinteros Disponibles
                </CardTitle>
                <Users className="size-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{carpinterosDisponibles}</div>
                <p className="text-xs text-gray-500 mt-1">
                  de {carpinteros.length} totales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Materiales Bajo Stock
                </CardTitle>
                <AlertTriangle className="size-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialesBajoStock}</div>
                <p className="text-xs text-gray-500 mt-1">
                  de {materiales.length} materiales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Proyectos Entregados
                </CardTitle>
                <CheckCircle className="size-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {proyectos.filter((p) => p.estado === "Entregado").length}
                </div>
                <p className="text-xs text-gray-500 mt-1">completados</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Avance de Proyectos */}
            <Card>
              <CardHeader className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="size-5" />
                    Avance de Proyectos
                  </CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSemanaOffset((semanaOffset ?? 0) - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[180px] text-center">
                    {formatearRangoSemana()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSemanaOffset((semanaOffset ?? 0) + 1)}
                    disabled={semanaOffset !== null && semanaOffset >= 0}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  {semanaOffset !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSemanaOffset(null)}
                    >
                      Ver todos
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {proyectosConAvance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={500}>
                    <ReBarChart data={proyectosConAvance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="nombreParaGrafico"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        label={{ value: '% Completado', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => label}
                      />
                      <Legend />
                      <Bar 
                        dataKey="completado" 
                        fill="#10b981" 
                        name="Completado (%)" 
                        barSize={30}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-gray-500">
                    <div className="text-center">
                      <Package className="size-12 mx-auto mb-3 text-gray-400" />
                      <p className="font-medium">No hay proyectos en esta semana</p>
                      <p className="text-sm mt-1">Navegue a otra semana o cree nuevos proyectos</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vista Global de Proyectos */}
            <Card>
              <CardHeader>
                <CardTitle>Vista Global de Proyectos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[630px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Creación</TableHead>
                        <TableHead>Progreso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proyectos.map((proyecto) => {
                        const totalEstados = proyecto.conceptos.reduce((acc, c) => acc + c.estados.length, 0);
                        const completados = proyecto.conceptos.reduce(
                          (acc, c) => acc + c.estados.filter((e) => e.completado).length,
                          0
                        );
                        const progreso = totalEstados > 0 ? (completados / totalEstados) * 100 : 0;
                        const carpintero = carpinteros.find((c) => c.id === proyecto.carpinteroResponsableId);

                        return (
                          <TableRow key={proyecto.id}>
                            <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                            <TableCell>{carpintero?.nombre || "-"}</TableCell>
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
                            <TableCell>
                              {new Date(proyecto.fechaCreacion).toLocaleDateString("es-ES")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${progreso}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{progreso.toFixed(0)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {proyectos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            No hay proyectos registrados
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Materiales Bajo Stock */}
          {materialesBajoStock > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-orange-600" />
                  Alerta: Materiales Bajo Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materiales
                    .filter((m) => m.stockActual < m.stockMinimo)
                    .map((material) => (
                      <div key={material.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{material.nombre}</span>
                          <span className="text-sm text-gray-600">
                            {material.stockActual} / {material.stockMinimo} {material.unidad}
                          </span>
                        </div>
                        <Progress
                          value={(material.stockActual / material.stockMinimo) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Catálogo de Materiales */}
        <TabsContent value="materiales" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Almacén</h3>
            <Dialog open={showAddMaterialDialog} onOpenChange={setShowAddMaterialDialog}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <Plus className="size-4" />
                  Agregar Material
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Material</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles del nuevo material que deseas agregar al catálogo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mat-nombre">Nombre *</Label>
                    <Input
                      id="mat-nombre"
                      value={nuevoMaterialNombre}
                      onChange={(e) => setNuevoMaterialNombre(e.target.value)}
                      placeholder="Ej: Madera MDF 18mm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mat-unidad">Unidad *</Label>
                      <Input
                        id="mat-unidad"
                        value={nuevoMaterialUnidad}
                        onChange={(e) => setNuevoMaterialUnidad(e.target.value)}
                        placeholder="Ej: m², litros, piezas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mat-stock">Material Actual *</Label>
                      <Input
                        id="mat-stock"
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
                    <Label htmlFor="mat-stock-min">Material Mínimo *</Label>
                    <Input
                      id="mat-stock-min"
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
                    <Label htmlFor="mat-proveedor">Proveedor</Label>
                    <Input
                      id="mat-proveedor"
                      value={nuevoMaterialProveedor}
                      onChange={(e) => setNuevoMaterialProveedor(e.target.value)}
                      placeholder="Nombre del proveedor"
                    />
                  </div>
                  <Button onClick={handleAgregarMaterial} className="w-full">
                    Agregar Material
                  </Button>
                </div>
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

        {/* Catálogo de Carpinteros */}
        <TabsContent value="carpinteros" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Catálogo de Carpinteros</h3>
            <Dialog open={showAddCarpinteroDialog} onOpenChange={setShowAddCarpinteroDialog}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <Plus className="size-4" />
                  Agregar Carpintero
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Carpintero</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles del nuevo carpintero que deseas agregar al catálogo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="carp-nombre">Nombre *</Label>
                    <Input
                      id="carp-nombre"
                      value={nuevoCarpinteroNombre}
                      onChange={(e) => setNuevoCarpinteroNombre(e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <Button onClick={handleAgregarCarpintero} className="w-full">
                    Agregar Carpintero
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Proyectos Asignados</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carpinteros.map((carpintero) => {
                    const proyectosAsignados = proyectos.filter((p) =>
                      p.carpinteroResponsableId === carpintero.id
                    );

                    return (
                      <TableRow key={carpintero.id}>
                        <TableCell className="font-medium">{carpintero.nombre}</TableCell>
                        <TableCell>
                          {carpintero.disponible ? (
                            <Badge variant="secondary">Disponible</Badge>
                          ) : (
                            <Badge>En Proyecto</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {proyectosAsignados.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {proyectosAsignados.map((p) => (
                                <Badge key={p.id} variant="outline" className="text-xs">
                                  {p.nombre}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEliminarCarpintero(carpintero.id, carpintero.nombre)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reportes */}
        <TabsContent value="reportes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Reporte Semanal de Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Genera un reporte con el avance de todos los proyectos durante la última semana
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{proyectos.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Proyectos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {proyectos.filter((p) => p.estado === "En produccion").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">En Producción</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {proyectos.filter((p) => p.estado === "Terminado").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Terminados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {proyectos.filter((p) => p.estado === "Entregado").length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Entregados</p>
                  </div>
                </div>
              </div>
              <Button onClick={generarReporteSemanal} className="w-full gap-2" size="lg">
                <Download className="size-4" />
                Generar Reporte Semanal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Reporte de Trabajo por Carpintero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Genera un reporte del trabajo asignado a cada carpintero durante la semana
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{carpinteros.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Carpinteros</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {carpinteros.filter((c) => c.disponible).length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Disponibles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {carpinteros.filter((c) => !c.disponible).length}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">En Trabajo</p>
                  </div>
                </div>
              </div>
              <Button onClick={generarReporteCarpinteros} className="w-full gap-2" size="lg">
                <Download className="size-4" />
                Generar Reporte de Carpinteros
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Reasignación */}
      <Dialog open={showReasignarDialog} onOpenChange={setShowReasignarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reasignar Proyectos</DialogTitle>
            <DialogDescription>
              Selecciona un nuevo carpintero para cada proyecto asignado a "{carpinteroAEliminar?.nombre}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.keys(reasignaciones).map((proyectoId) => {
              const proyecto = proyectos.find((p) => p.id === proyectoId);
              if (!proyecto) return null;

              return (
                <div key={proyectoId} className="space-y-2">
                  <Label htmlFor={`reasignar-${proyectoId}`}>{proyecto.nombre}</Label>
                  <Select
                    id={`reasignar-${proyectoId}`}
                    value={reasignaciones[proyectoId]}
                    onValueChange={(value) => handleReasignarProyecto(proyectoId, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un carpintero" />
                    </SelectTrigger>
                    <SelectContent>
                      {carpinteros
                        .filter((c) => c.id !== carpinteroAEliminar?.id)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={handleCancelarReasignacion}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarReasignacion}
            >
              Confirmar Reasignación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}