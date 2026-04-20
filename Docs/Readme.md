# 📘 Síntesis de Funcionalidad del Sistema

---

# 🧠 Modelo Operativo del Sistema

El sistema está diseñado con base en la operación real de la empresa, separando responsabilidades por áreas:

- **Compras**: Encargado de la fase inicial (cotización, planos, materiales).
- **Producción**: Responsable de la ejecución de los proyectos.
- **Administración**: Control global, supervisión y gestión del sistema.

---

## 🔐 Nota sobre permisos y acceso

El sistema opera bajo un esquema de **roles y permisos**.

- Algunas funcionalidades pueden existir en más de un módulo.
- Esto no representa duplicidad funcional, sino:
  - Diferentes niveles de acceso
  - Diferentes propósitos (operación vs supervisión)

 Existe una **única fuente de verdad**, y cada módulo accede según su rol.

---

## 🔄 Flujo de Vida del Proyecto

1. Desarrollo de planos (Compras)
2. Cotización del proyecto (Compras)
3. Validación de materiales disponibles (Compras) 
4. Creación formal del proyecto  (Compras)
5. Transferencia a Producción (Produccion) 
6. Ejecución del proyecto  (Produccion)
7. Seguimiento y control (Administración)  

---

# 🧾 Módulo: Compras

## 📦 Inventario (Almacén)

El sistema permite la gestión completa del inventario de materiales utilizados en los proyectos.

### Funcionalidades:
- Registro y visualización de materiales con información como:
  - ID
  - Nombre
  - Tipo de material
  - Precio por unidad
  - Unidad de medida
  - Stock actual y stock mínimo

- Control de movimientos de inventario:
  - Entrada de materiales (cantidad y fecha)
  - Salida de materiales (cantidad, fecha y proyecto asociado)

- Cálculo automático del valor total del inventario en función del stock disponible

- Actualización automática del inventario:
  - Vinculada a órdenes de compra
  - Vinculada al uso de materiales en proyectos

---

## 🧱 Gestión de Proyectos (Preproducción)

Este módulo inicia la vida del proyecto desde la fase de planeación.

### Funcionalidades:
- Creación de proyectos con:
  - Nombre
  - Número de conceptos (muebles)
  - Carpintero responsable
  - Fecha de entrega
  - Observaciones

- Registro de conceptos:
  - Nombre
  - Descripción
  - Materiales asociados

---

## ➕ Gestión de Materiales

Permite la administración del catálogo de materiales.

### Funcionalidades:
- Alta de materiales con:
  - Nombre
  - Unidad
  - Stock actual
  - Stock mínimo
  - Proveedor

- Sistema de alertas:
  - Notificación automática de stock mínimo
  - Reporte de materiales en estado crítico

---

## 🧾 Órdenes de Compra

Permite gestionar la adquisición de materiales.

### Funcionalidades:
- Creación de órdenes de compra con:
  - Material
  - Cantidad
  - Costo estimado

- Actualización automática del inventario

---

## 📊 Cotizaciones

Permite gestionar el proceso de cotización previo al proyecto.

### Funcionalidades:
- Etapas de cotización:
  - Pendiente de inicio
  - En proceso
  - Pendiente por revisión
  - Revisado
  - Enviado

- Visualización de:
  - Progreso porcentual
  - Estatus (aprobado/rechazado)
  - Medio de comunicación (Whatsapp, Email etc.)

---

## ⚠️ Validaciones de Materiales

Controla la disponibilidad de recursos.

### Funcionalidades:
- Verificación automática de stock en salidas
- Validación de materiales por proyecto:

---

# 🏭 Módulo: Producción

## 🧩 Gestión de Proyectos en Producción

Permite administrar los proyectos en ejecución.

### Funcionalidades:
- Visualización de proyectos:
  - Nombre del cliente
  - Proyecto
  - Número de conceptos
  - Responsable
  - Progreso general

---

## 🪵 Gestión de Conceptos (Muebles)

Cada proyecto se divide en conceptos con seguimiento individual.

### Funcionalidades:
- Registro de conceptos:
  - ID
  - Nombre
  - Descripción
  - Fecha de compromiso

- Flujo de producción por etapas:
  - Planos
  - Material
  - Pintura
  - Herrajes
  - Carpintería
  - Pintura
  - Prearmado
  - Emplaye
  - Envío
  - Instalación
  - Retoque
  - Firma

- Control de avance:
  - Etapas completadas
  - Fecha de etapa actual
  - Progreso individual
  - Fecha compromiso

---

## ⚠️ Gestión de Incidencias

Permite el control de problemas durante la ejecución.

### Funcionalidades:
- Registro de incidencias:
  - Por proyecto
  - Por concepto

- Datos:
  - Fecha
  - Descripción
  - Prioridad

- Notificaciones de incidencias
- Alertas de inminente retraso
- Aviso que la fecha de compromiso esta proxima a cumplir

---

## ✅ Control de Estados del Proyecto

Gestiona el ciclo de vida del proyecto.

### Funcionalidades:
- Estados:
  - Listo
  - En producción
  - En pausa
  - En revisión
  - Entregado

- Aprobación o rechazo
- Modificación de estados tras rechazo

---

## 📊 Visualización de Estados

Monitorea la distribución de proyectos.

### Funcionalidades:
- Panel con conteo por estado:
  - Listos
  - En producción
  - En pausa
  - En revisión
  - Entregados

---

# 🧑‍💼 Módulo: Administración

## 📁 Gestión Global de Proyectos

Permite la supervisión general del sistema.

### Funcionalidades:
- Vista global:
  - Nombre
  - Responsable
  - Estado
  - Fecha de creación
  - Progreso
  - Fecha compromiso

- Análisis:
  - Avance de proyectos por periodo

---

## 📊 Indicadores del Sistema

Métricas clave del sistema.

### Funcionalidades:
- Total de proyectos
- Carpinteros disponibles
- Materiales con bajo stock
- Proyectos entregados

---

## 📦 Gestión de Almacén (Control)

Permite supervisar el inventario a nivel administrativo.

### Funcionalidades:
- Visualización de materiales:
  - Nombre
  - Unidad
  - Stock
  - Stock mínimo
  - Proveedor

---

## 👷 Gestión de Carpinteros

Administración de recursos humanos.

### Funcionalidades:
- Visualización:
  - Nombre
  - Estado
  - Proyectos asignados

- Alta de carpinteros
- Eliminación con reasignación automática

---

## 📑 Reportes y Control del Sistema

Funciones avanzadas de administración.

### Funcionalidades:
- Generación de reportes operativos
- Auditoría del sistema
  
