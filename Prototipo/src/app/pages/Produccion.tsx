import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Hammer, PlayCircle, PauseCircle, CheckCircle, Calendar, Eye } from "lucide-react";
import { Proyecto, Concepto } from "../types";
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

export function Produccion() {
  const {
    proyectos,
    carpinteros,
    actualizarProyecto,
    cambiarEstadoProyecto,
  } = useERP();

  const proyectosProduccion = proyectos.filter(
    (p) =>
      p.estado === "Listo para produccion" ||
      p.estado === "En produccion" ||
      p.estado === "En pausa" ||
      p.estado === "Terminado" ||
      p.estado === "En revision" ||
      p.estado === "Listo para entrega"
  );

  const iniciarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En produccion");
    toast.success("Producción iniciada");
  };

  const pausarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En pausa");
    toast.warning("Producción pausada");
  };

  const reanudarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En produccion");
    toast.success("Producción reanudada");
  };

  const actualizarEstadoConcepto = (
    proyectoId: string,
    conceptoId: string,
    estadoNombre: string,
    completado: boolean
  ) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const conceptosActualizados = proyecto.conceptos.map((concepto) => {
      if (concepto.id === conceptoId) {
        const estadosActualizados = concepto.estados.map((estado) =>
          estado.nombre === estadoNombre
            ? {
                ...estado,
                completado,
                fechaInicio: !estado.fechaInicio && completado ? new Date() : estado.fechaInicio,
                fechaFin: completado ? new Date() : undefined,
              }
            : estado
        );
        return { ...concepto, estados: estadosActualizados };
      }
      return concepto;
    });

    actualizarProyecto(proyectoId, { conceptos: conceptosActualizados });

    // Verificar si todos los conceptos están completados
    const todosCompletados = conceptosActualizados.every((concepto) =>
      concepto.estados.every((e) => e.completado)
    );

    if (todosCompletados) {
      cambiarEstadoProyecto(proyectoId, "Terminado");
      toast.success("¡Todos los conceptos completados!");
    }
  };

  const enviarRevision = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En revision");
    toast.info("Proyecto enviado a revisión");
  };

  const aprobarRevision = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "Listo para entrega");
    toast.success("Revisión aprobada - Listo para entregar");
  };

  const rechazarRevision = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En produccion");
    toast.warning("Revisión rechazada - Vuelve a producción");
  };

  const entregarProyecto = (proyectoId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (proyecto) {
      actualizarProyecto(proyectoId, { fechaEntrega: new Date() });
      cambiarEstadoProyecto(proyectoId, "Entregado");
      toast.success("Proyecto entregado al cliente");
    }
  };

  const calcularProgreso = (proyecto: Proyecto) => {
    const totalEstados = proyecto.conceptos.reduce((acc, c) => acc + c.estados.length, 0);
    const estadosCompletados = proyecto.conceptos.reduce(
      (acc, c) => acc + c.estados.filter((e) => e.completado).length,
      0
    );
    return totalEstados > 0 ? (estadosCompletados / totalEstados) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Módulo de Producción</h2>
          <p className="text-gray-600 mt-1">
            Gestión de proyectos en producción y estados de conceptos
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Listos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proyectos.filter((p) => p.estado === "Listo para produccion").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {proyectos.filter((p) => p.estado === "En produccion").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Pausa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {proyectos.filter((p) => p.estado === "En pausa").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Revisión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {proyectos.filter((p) => p.estado === "En revision").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Entregados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {proyectos.filter((p) => p.estado === "Entregado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Proyectos */}
      <div className="grid grid-cols-1 gap-4">
        {proyectosProduccion.map((proyecto) => {
          const progreso = calcularProgreso(proyecto);
          const carpintero = carpinteros.find((c) => c.id === proyecto.carpinteroResponsableId);

          return (
            <Card key={proyecto.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {proyecto.nombre}
                      {proyecto.estado === "En produccion" && (
                        <Hammer className="size-5 text-purple-600 animate-pulse" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {proyecto.numeroConceptos} concepto(s) · Responsable: {carpintero?.nombre}
                    </p>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: ESTADO_COLORS[proyecto.estado],
                      color: "white",
                    }}
                  >
                    {proyecto.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progreso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso General</span>
                    <span className="text-sm font-bold text-gray-900">{progreso.toFixed(0)}%</span>
                  </div>
                  <Progress value={progreso} className="h-2" />
                </div>

                {/* Conceptos y Estados */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Conceptos y Estados de Producción</p>
                    <span className="text-sm text-gray-600">
                      {proyecto.conceptos.length} concepto{proyecto.conceptos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {/* Contenedor con scroll - muestra hasta 3 conceptos a la vez */}
                  <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                    {proyecto.conceptos.map((concepto) => {
                      const estadosCompletados = concepto.estados.filter((e) => e.completado).length;
                      const totalEstados = concepto.estados.length;
                      const progresoConcepto = (estadosCompletados / totalEstados) * 100;

                      return (
                        <Card key={concepto.id} className="bg-gray-50">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{concepto.nombre}</CardTitle>
                              <Badge variant="secondary">
                                {estadosCompletados}/{totalEstados}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{concepto.descripcion}</p>
                            <Progress value={progresoConcepto} className="h-1 mt-2" />
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                              {concepto.estados.map((estado) => (
                                <div
                                  key={estado.nombre}
                                  className={`border rounded-lg p-3 ${
                                    estado.completado
                                      ? "bg-green-50 border-green-300"
                                      : "bg-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{estado.nombre}</span>
                                    {estado.completado && (
                                      <CheckCircle className="size-4 text-green-600" />
                                    )}
                                  </div>
                                  {proyecto.estado === "En produccion" && (
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`${proyecto.id}-${concepto.id}-${estado.nombre}`}
                                        checked={estado.completado}
                                        onCheckedChange={(checked) =>
                                          actualizarEstadoConcepto(
                                            proyecto.id,
                                            concepto.id,
                                            estado.nombre,
                                            checked as boolean
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`${proyecto.id}-${concepto.id}-${estado.nombre}`}
                                        className="text-xs cursor-pointer"
                                      >
                                        {estado.completado ? "Completado" : "Pendiente"}
                                      </Label>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Fecha de Entrega */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>
                    Fecha de entrega programada:{" "}
                    {new Date(proyecto.conceptos[0]?.fechaEntrega).toLocaleDateString("es-ES")}
                  </span>
                </div>

                {proyecto.fechaEntrega && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="size-4" />
                    <span>
                      Entregado el: {new Date(proyecto.fechaEntrega).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-wrap">
                  {proyecto.estado === "Listo para produccion" && (
                    <Button onClick={() => iniciarProduccion(proyecto.id)} className="gap-2">
                      <PlayCircle className="size-4" />
                      Iniciar Producción
                    </Button>
                  )}
                  {proyecto.estado === "En produccion" && (
                    <Button
                      onClick={() => pausarProduccion(proyecto.id)}
                      variant="destructive"
                      className="gap-2"
                    >
                      <PauseCircle className="size-4" />
                      Pausar
                    </Button>
                  )}
                  {proyecto.estado === "En pausa" && (
                    <Button onClick={() => reanudarProduccion(proyecto.id)} className="gap-2">
                      <PlayCircle className="size-4" />
                      Reanudar
                    </Button>
                  )}
                  {proyecto.estado === "Terminado" && (
                    <Button onClick={() => enviarRevision(proyecto.id)} className="gap-2">
                      <Eye className="size-4" />
                      Enviar a Revisión
                    </Button>
                  )}
                  {proyecto.estado === "En revision" && (
                    <>
                      <Button onClick={() => aprobarRevision(proyecto.id)} className="gap-2">
                        <CheckCircle className="size-4" />
                        Aprobar Revisión
                      </Button>
                      <Button
                        onClick={() => rechazarRevision(proyecto.id)}
                        variant="destructive"
                        className="gap-2"
                      >
                        Rechazar Revisión
                      </Button>
                    </>
                  )}
                  {proyecto.estado === "Listo para entrega" && (
                    <Button onClick={() => entregarProyecto(proyecto.id)} className="gap-2">
                      <CheckCircle className="size-4" />
                      Entregar a Cliente
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {proyectosProduccion.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Hammer className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay proyectos en producción</p>
              <p className="text-sm text-gray-500 mt-1">
                Los proyectos listos para producción aparecerán aquí
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}