# DOCUMENTACIÓN DEL SISTEMA (BASADA EN EXCELES DEL CLIENTE)

Este documento consolida la información recabada a partir de los archivos Excel proporcionados por el cliente, enfocado en los módulos de:

- Producción  
- Compras  
- Administración  

---

# DASHBOARD

## PRODUCCIÓN

### Información general del proyecto

El cliente quiere visualizar:

- Nombre de proyecto  
- Cliente  
- Número de muebles (conceptos)  

Cada proyecto se compone de múltiples muebles, funcionando como subproyectos.

---

### ESTADOS de cada mueble (en orden)

1. PLANOS  
2. MATERIAL  
3. PINTURA  
4. HERRAJES  
5. CARPINTERÍA  
6. PINTURA  
7. PREARMADO  
8. EMPLAYE  
9. ENVIO  
10. INSTALACIÓN  
11. RETOQUE  
12. FIRMA  

---

### FUNCIONALIDAD

- Al seleccionar un mueble:
  - Mostrar etapa actual  
  - Mostrar porcentaje de avance  
  - Mostrar fecha de la etapa  

- El proyecto general debe mostrar:
  - Porcentaje de avance completado  
  - Porcentaje faltante  

---

### INCIDENCIAS

Cada mueble dentro de un proyecto puede tener incidencias.

#### Cada incidencia incluye:

- Fecha  
- Descripción  
- Tipo:
  - Material faltante  
  - Error en planos  
  - Retraso  
  - Otro  
- Prioridad:
  - Alta  
  - Media  
  - Baja  

---

#### FUNCIONALIDAD

- Contador automático de incidencias  
- Registro de incidencias por mueble  
- Registro de incidencias por etapa  
- Cada incidencia notifica al área de compras  

---

### RELACIÓN CON COMPRAS

Flujo definido:

Incidencia → detección de problema → solicitud → compras actúa  

---

### ESTADO DE MATERIALES EN PROYECTO

- Material completo  
- Material faltante (indicando cantidad faltante)  

---

### VISUALIZACIÓN DE PROYECTOS

Debe mostrar:

- Avance general  
- Incidencias activas  
- Material faltante  
- Estado de salud del proyecto:
  - En tiempo  
  - En riesgo  
  - Retrasado  

---

### TIMELINE DEL PROYECTO

Cada proyecto debe registrar:

- Fecha de inicio  
- Avances por etapa  
- Incidencias con fecha  

---

# COMPRAS

## Lista de inventario - 2026 (excel)

La lista de inventario debe contener:

- Listado de material  
- Tipo  
- Precio por unidad  
- Stock mínimo  
- Unidad de medida  
- Fecha de entrada del material  
- Cantidad actual  
- Valor de inventario (cantidad actual * precio por unidad)  
- Observaciones  

---

### FUNCIONALIDADES

- Salida de materiales vinculada a fichas de pago  
- Las fichas de pago descuentan automáticamente del inventario  
- Registro de entradas de material  
- Registro de salidas de material  
- Acepta valores decimales  

---

### CONTROL DE INVENTARIO

- Notificación cuando el material esté:
  - menor/igual al stock mínimo  
  - igual al stock mínimo  

- Posibilidad de hacer “corte” de registro de material para iniciar nuevos periodos  

---

### NOTA

Este Excel se enfoca en PROYECTOS.  
La información de precios y materiales está orientada a órdenes de compra, no a contabilidad.

---

## Pedidos materiales-obras (excel)

Incluye:

- Material a pedir  
- Precio unitario  
- Mueble donde se requiere  
- Cantidad  
- REND**  
- Cantidad necesaria total con respecto a REND  
- Volumen total del pedido  
- Importe total del pedido  

---

### RELACIÓN CON INCIDENCIAS

Las incidencias pueden generar:

- Requisición de materiales  
- Cambios necesarios para ejecutar el proyecto  

---

## BASE CONSUMIBLES (excel)

- Contiene la misma información que Lista de inventario - 2026  
- Incluye adicionalmente:
  - IDs de materiales (1,2,3,4,5)  

---

## GASTOS Y COMPRAS (excel)**

- POR REVISAR  

---

## FECHA-COTIZACIONES-v2 (excel)

Debe contener:

- ID por proyecto  
- Cliente  
- Proyecto  
- Fecha de recepción  
- Fecha de envío  
- Días de atraso (número fijo)  

---

### ETAPAS DE COTIZACIÓN (checkbox)

1. pend. inicio  
2. en proceso  
3. pend. por revisión  
4. revisado  
5. enviado  

---

### ELEMENTOS ADICIONALES

- AVANCE: barra de progreso de la cotización  
- Estatus: aprobado o rechazado  
- Pendiente por revisión de dirección (sí/no)  
- Medio de envío de cotización  

---

# ADMINISTRACIÓN

## PRECIOSv2 (excel)

*** El documento RECIBO.docx no se considerará dentro del sistema por el momento.  

---

## SALDOS

Control de ingresos y pagos de proyectos.

### CAMPOS

- ID del proyecto  
- Cliente  
- Proyecto  
- Extras/adicionales  
- Costo del proyecto  
- Anticipos al día  
- Fecha del último anticipo  
- Saldo  

---

### ESTATUS

- iniciado  
- adelanto pagado  
- terminado por cobrar  

---

### INTERACCIÓN

Al seleccionar un proyecto:

- Mostrar abono más reciente  
- Mostrar fecha del último anticipo  

---

# EXTRAS PARA ADMINISTRACIÓN

## Control de gastos fijos (excel)

### CAMPOS

- Mes  
- Timestamp automático  
- Concepto  
- Cantidad  

---

### ESTADOS

- ENTREGADO  
- PENDIENTE  
- No se paga  

---

### CONTADORES

- Pendiente  
- A completar  
- Sobran  

---

### REGLAS

- “a completar” se suma al pendiente  
- “sobran” se resta al pendiente  

---

### FUNCIONALIDADES

- Agregar o eliminar gastos fijos  
- Sección acumulable por concepto  

---

# CONSIDERACIONES GENERALES DEL SISTEMA

- El sistema no maneja usuarios  
- Los registros incluyen únicamente fecha  
- Los estados de los proyectos se manejan manualmente  
- No existen bloqueos estrictos por incidencias  
- Se permite trabajar en otras áreas del proyecto aunque existan incidencias  
- Las notificaciones son internas dentro del sistema  
- Las notificaciones se generan cuando:
  - Material ≤ stock mínimo  
  - Se crea una incidencia  
  - Llega un pedido  
  - Fecha de entrega próxima  

---

# PREGUNTAS PENDIENTES

1. ¿Qué es la columna REND en Pedidos materiales-obras (excel)?  
2. ¿Quién maneja GASTOS Y COMPRAS (excel)**?  
3. ¿Quién cubre gastos de gasolina?  
4. ¿Quién maneja servicios y consumibles fuera de proyectos?  
5. ¿Qué significa DESGASTE en PRECIOSv2 (excel)?  
6. ¿Quién controla gastos fijos?  
7. ¿Cómo funcionan los estados en SALDOS 25 (excel)?  

---
