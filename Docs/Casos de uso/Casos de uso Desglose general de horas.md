## Caso de uso: Registrar y gestionar incidencias

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Registrar y gestionar incidencias |
| **Actor principal** | Encargado de compras o producción |
| **Actores secundarios** | Administración |
| **Propósito** | Registrar cualquier incidencia (problema imprevisto, requisición de materiales o cambio por proyecto) y asegurar su resolución por el área correspondiente. |
| **Precondiciones** | Existe una necesidad o problema que afecta a compras o producción. |
| **Postcondiciones** | - La incidencia queda registrada y cerrada.<br>- Los involucrados son notificados.<br>- Dependiendo del tipo, se genera una orden, un cambio aprobado o una resolución de problema. |

### Escenario principal (flujo básico)

1. El encargado de compras o producción detecta una necesidad o problema.
2. El encargado reporta la incidencia en el sistema, indicando:
   - **Tipo** (problema imprevisto / requisición de materiales / cambio por proyecto)
   - Descripción
   - Área afectada
   - Prioridad (opcional)
3. El sistema registra la incidencia y notifica a todos los módulos involucrados.
4. El sistema asigna la incidencia al responsable según el tipo y área.
5. El responsable revisa la incidencia y toma acción para resolverla.
6. Una vez resuelta, el responsable marca la incidencia como "finalizada".
7. El sistema notifica el cierre a todos los involucrados.

### Flujos alternativos por tipo de incidencia

- **2a. Incidencia tipo "problema imprevisto"**  
  El flujo sigue el escenario principal. El responsable suele ser administración o el jefe del área afectada. Si no hay responsable asignado, se notifica al administrador del sistema.

- **2b. Incidencia tipo "requisición de materiales"**  
  En el paso 4, el sistema asigna la incidencia a **Almacén** (o al área de compras). El responsable revisa la disponibilidad y genera una orden de requisición. Si hay stock, se despacha; si no, se inicia una compra. Se cierra cuando los materiales son entregados.

- **2c. Incidencia tipo "cambio por proyecto"**  
  En el paso 4, el sistema asigna la incidencia al **Comité de cambios**. El comité evalúa el impacto, costo y tiempo. Si se aprueba, se asigna a producción para implementar el cambio. Se cierra cuando el cambio está implementado y verificado. Si se rechaza, se cierra la incidencia como "rechazada".

### Otros flujos alternativos (comunes)

- **3a. Datos incompletos al reportar**  
  El sistema solicita los campos obligatorios y no permite guardar hasta que se completen.

- **4a. No hay responsable asignado para el tipo/área**  
  El sistema notifica al administrador del sistema para que asigne un responsable manualmente.

- **5a. La incidencia no procede (falsa alarma)**  
  El responsable puede marcar la incidencia como "rechazada" o "no aplicable", con un motivo. Se notifica el cierre sin resolución.

- **6a. La incidencia se reabre**  
  Si tras cerrarla vuelve a ocurrir, el encargado puede reabrir la incidencia con una referencia a la anterior.

# Casos de uso del módulo de compras

## Caso de uso: Aviso de material faltante

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Aviso de material faltante |
| **Actor principal** | Usuario (Área de almacenamiento) |
| **Actores secundarios** | N/A |
| **Propósito** | Notificar cuando un material está por debajo del stock mínimo permitido. |
| **Precondiciones** | El sistema de almacén de materiales debe funcionar plenamente. |
| **Postcondiciones** | El sistema muestra la alerta visual y el usuario visualiza el estado del stock. |

### Escenario principal (flujo básico)

1. El sistema detecta que un material está por debajo del mínimo permitido.
2. El sistema lanza una alerta visual junto al nombre del material.
3. El usuario visualiza la alerta.
4. El usuario toma las acciones necesarias para solucionarlo.

### Flujos alternativos

- **Error de validación de stock:** El sistema no logra calcular correctamente el stock mínimo y no muestra la alerta.

---

## Caso de uso: Registrar material

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Registrar material |
| **Actor principal** | Usuario |
| **Actores secundarios** | N/A |
| **Propósito** | Registrar un nuevo material en el stock del sistema. |
| **Precondiciones** | El sistema debe contar con un formulario de registro y debe existir espacio físico en el almacén. |
| **Postcondiciones** | El material queda registrado exitosamente y disponible para otros módulos. |

### Escenario principal (flujo básico)

1. El usuario ingresa a la función “Agregar materiales”.
2. El sistema muestra el formulario de registro.
3. El usuario ingresa los datos del material.
4. El usuario guarda los datos exitosamente.
5. El sistema notifica que el material fue guardado.

### Flujos alternativos

- **Formulario inconcluso:** El sistema o el usuario se cierra abruptamente; los datos no se guardan.

---

## Caso de uso: Visualizar materiales

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Visualizar materiales |
| **Actor principal** | Usuario |
| **Actores secundarios** | Sistema |
| **Propósito** | Consultar la lista de materiales almacenados. |
| **Precondiciones** | El sistema cuenta con una sección “Almacén” con materiales precargados. |
| **Postcondiciones** | Los materiales se muestran exitosamente para su consulta. |

### Escenario principal (flujo básico)

1. El usuario ingresa al apartado de almacén.
2. El sistema carga la información del almacén.
3. El usuario visualiza los materiales guardados.

---

## Caso de uso: Filtro de búsqueda

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Filtro de búsqueda |
| **Actor principal** | Usuario |
| **Actores secundarios** | N/A |
| **Propósito** | Localizar un material específico mediante coincidencias de texto. |
| **Precondiciones** | El sistema cuenta con materiales registrados y la barra de búsqueda está disponible. |
| **Postcondiciones** | El usuario visualiza los resultados que coinciden con su búsqueda. |

### Escenario principal (flujo básico)

1. El usuario accede al buscador en el módulo de compras.
2. El usuario teclea el nombre del material.
3. El sistema localiza coincidencias.
4. El usuario visualiza los resultados.

### Flujos alternativos

- **Nombre incorrecto:** El sistema no encuentra coincidencias y no devuelve resultados.

---

## Caso de uso: Crear orden de compra

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Crear orden de compra |
| **Actor principal** | Usuario de compras |
| **Actores secundarios** | Administrador |
| **Propósito** | Generar un nuevo documento de orden de compra para monitoreo. |
| **Precondiciones** | Existe un material con stock mínimo alcanzado o sobrepasado. |
| **Postcondiciones** | La orden queda registrada formalmente en el sistema. |

### Escenario principal (flujo básico)

1. El usuario selecciona “Crear nueva orden”.
2. El sistema presenta la plantilla de llenado.
3. El usuario completa los campos requeridos.
4. El usuario confirma la creación.

### Flujos alternativos

- **Cancelar orden:** El usuario decide cancelar el llenado y el sistema suprime el formato sin guardar cambios.

---

## Caso de uso: Registro de órdenes

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Registro de órdenes |
| **Actor principal** | Usuario de compras |
| **Actores secundarios** | Administrador |
| **Propósito** | Almacenar y presentar la lista actualizada de órdenes de compra. |
| **Precondiciones** | Debe existir al menos una orden creada. |
| **Postcondiciones** | Lista de órdenes actualizada, mostrando la más reciente en la parte superior. |

### Escenario principal (flujo básico)

1. El usuario confirma la creación de una orden.
2. El sistema guarda la orden.
3. El sistema muestra la lista de órdenes en la pestaña correspondiente.
4. La lista se actualiza automáticamente.

### Flujos alternativos

- **Órdenes vencidas:** El sistema elimina automáticamente las órdenes cuya fecha de entrega ya expiró.

---

## Caso de uso: Etapas de cotización

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Etapas de cotización |
| **Actor principal** | Usuario de compras |
| **Actores secundarios** | N/A |
| **Propósito** | Actualizar el progreso del flujo proyecto-cliente. |
| **Precondiciones** | Debe existir una cotización registrada previamente. |
| **Postcondiciones** | El dashboard de cotizaciones refleja el nuevo estado o progreso. |

### Escenario principal (flujo básico)

1. El usuario abre el dashboard de cotizaciones.
2. El usuario visualiza las etapas actuales.
3. El usuario marca el checkbox de la etapa a actualizar.
4. El sistema actualiza el progreso en la base de datos.

### Flujos alternativos

- **Cotización aceptada:** El sistema cambia automáticamente el estado del proyecto a "aceptado".
- **Cotización rechazada:** El sistema cambia automáticamente el estado del proyecto a "rechazado".

---

## Caso de uso: Crear proyecto

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Crear proyecto |
| **Actor principal** | Encargado de compras |
| **Actores secundarios** | Módulo de producción |
| **Propósito** | Registrar formalmente un proyecto para seguimiento financiero y productivo. |
| **Precondiciones** | Existe una cotización previa y el usuario está autenticado. |
| **Postcondiciones** | Proyecto registrado en estado activo con fichas de pago habilitadas. |

### Escenario principal (flujo básico)

1. El encargado selecciona “Crear nuevo proyecto”.
2. El sistema solicita datos (nombre, cliente, fecha de entrega).
3. El usuario ingresa los datos y carga los archivos requeridos.
4. El sistema valida los formatos y la integridad de la información.
5. El usuario confirma la creación.
6. El sistema guarda la información y habilita las fichas de pago.

### Flujos alternativos

- **Validación fallida:** El sistema rechaza la acción si la fecha es pasada, el nombre está duplicado o el formato de archivo es inválido.
- **Datos incompletos:** El sistema exige completar todos los campos obligatorios antes de permitir el guardado.

# Casos de uso del módulo de producción

## Caso de uso: Información general

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Información general |
| **Actor principal** | Usuario (encargado de producción) |
| **Actores secundarios** | Sistema |
| **Propósito** | Mostrar al usuario la información consolidada de cada proyecto en el dashboard. |
| **Precondiciones** | Debe existir al menos un proyecto registrado en el área de producción. |
| **Postcondiciones** | El usuario obtiene una vista general de los proyectos registrados. |

### Escenario principal (flujo básico)

1. El usuario accede al dashboard de producción.
2. El sistema carga la información general de cada proyecto: nombre, cliente, número de conceptos, carpintero responsable y fecha de entrega programada.
3. El usuario visualiza la información consolidada en el panel.

### Flujos alternativos

- **Proyecto sin datos completos:** El sistema detecta campos faltantes y muestra un aviso de información incompleta.

---

## Caso de uso: Estados de cada mueble

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Estados de cada mueble |
| **Actor principal** | Usuario (encargado de producción) |
| **Actores secundarios** | Sistema |
| **Propósito** | Visualizar y actualizar el progreso de cada mueble en sus etapas de producción. |
| **Precondiciones** | El proyecto debe tener conceptos registrados con muebles asociados. |
| **Postcondiciones** | El estado de cada mueble queda actualizado en el dashboard. |

### Escenario principal (flujo básico)

1. El usuario accede al dashboard de producción.
2. El sistema muestra cada mueble con su estado actual (planos, material, pintura, carpintería, etc.).
3. El usuario marca la checkbox correspondiente para indicar el avance de una etapa.
4. El sistema actualiza el estado del mueble en tiempo real.

### Flujos alternativos

- **Etapa inválida:** El usuario intenta marcar una etapa inexistente; el sistema muestra un error.
- **Datos incompletos:** El sistema detecta que no se han registrado todas las etapas y solicita completar la información.

---

## Caso de uso: Porcentajes de avance

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Porcentajes de avance |
| **Actor principal** | Usuario (encargado de producción) |
| **Actores secundarios** | Sistema |
| **Propósito** | Calcular y mostrar el porcentaje de avance de cada proyecto basado en sus conceptos. |
| **Precondiciones** | Deben existir conceptos registrados con etapas de producción asociadas. |
| **Postcondiciones** | El usuario visualiza el porcentaje de avance actualizado de cada proyecto. |

### Escenario principal (flujo básico)

1. El usuario accede al dashboard de producción.
2. El sistema calcula el porcentaje de avance de cada proyecto en base al progreso de sus conceptos.
3. El sistema muestra la barra de progreso general y el porcentaje correspondiente.
4. El usuario visualiza el avance consolidado.

### Flujos alternativos

- **Error de cálculo:** El sistema no logra calcular el porcentaje por datos faltantes; muestra un aviso de error.

# Casos de uso del módulo de administracion

## Caso de uso: Ver vista global de proyectos

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Ver vista global de proyectos |
| **Actor principal** | Administrador |
| **Actores secundarios** | Ninguno |
| **Propósito** | Mostrar al administrador una lista resumida de todos los proyectos del sistema, con sus datos clave y barra de progreso. |
| **Precondiciones** | Existe al menos un proyecto registrado en el sistema. |
| **Postcondiciones** | El administrador visualiza la información actualizada de los proyectos. |

### Escenario principal (flujo básico)

1. El administrador accede a la sección "Proyectos" del módulo de Administración.
2. El sistema carga y muestra la vista global de proyectos.
3. Por cada proyecto, se visualiza:
   - Nombre
   - Responsable (carpintero responsable)
   - Estado
   - Fecha de creación
   - Barra de progreso (porcentaje completado)
4. El administrador puede ordenar o filtrar la lista (opcional, si existe la funcionalidad).
5. El administrador finaliza la consulta.

### Flujos alternativos

- **1a. No hay proyectos registrados:**  
  El sistema muestra un mensaje "No hay proyectos disponibles" y una opción para crear uno (si aplica).

## Caso de uso: Ver avance de proyectos (histograma)

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Ver avance de proyectos |
| **Actor principal** | Administrador |
| **Actores secundarios** | Ninguno |
| **Propósito** | Mostrar un gráfico de histograma con el número de proyectos completados o en avance por periodos de tiempo. |
| **Precondiciones** | Existe al menos un proyecto con fecha de creación o finalización. |
| **Postcondiciones** | El administrador visualiza el histograma con los datos actualizados. |

### Escenario principal (flujo básico)

1. El administrador accede a la sección "Proyectos" y selecciona la pestaña o botón "Avance de proyectos".
2. El sistema genera un histograma (barras) que muestra la cantidad de proyectos agrupados por periodo (días, semanas, meses, según configuración).
3. El administrador puede cambiar el periodo (día, semana, mes, año) mediante un selector.
4. El sistema actualiza el gráfico según el periodo seleccionado.
5. El administrador puede exportar o imprimir el gráfico (opcional).

### Flujos alternativos

- **2a. No hay datos suficientes para el periodo:**  
  El sistema muestra un mensaje "No hay proyectos en el rango seleccionado" y sugiere ampliar el periodo.

## Caso de uso: Visualizar panel de indicadores (tarjetas)

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Visualizar panel de indicadores |
| **Actor principal** | Administrador |
| **Actores secundarios** | Módulo de almacén, Módulo de carpinteros |
| **Propósito** | Mostrar al administrador cuatro métricas clave mediante tarjetas: total de proyectos, carpinteros disponibles, materiales bajo stock, proyectos entregados. |
| **Precondiciones** | El sistema tiene datos de proyectos, carpinteros y materiales. |
| **Postcondiciones** | El administrador conoce los valores actuales de los indicadores. |

### Escenario principal (flujo básico)

1. El administrador accede al módulo de Administración, sección "Proyectos".
2. El sistema consulta y muestra cuatro tarjetas con:
   - **Total de proyectos**: número de proyectos en el sistema.
   - **Carpinteros disponibles**: cantidad de carpinteros con estado "Disponible" (subleyenda: total de carpinteros registrados).
   - **Materiales bajo stock**: cantidad de materiales cuya existencia actual es menor o igual al mínimo (subleyenda: lista de materiales afectados, ej. Madera, MDF).
   - **Proyectos entregados**: número de proyectos con estado "Entregado" o "Finalizado".
3. Las tarjetas se actualizan automáticamente al entrar a la vista o cada cierto tiempo.

### Flujos alternativos

- **2a. No hay datos en alguna métrica:**  
  La tarjeta correspondiente muestra "0" o "Sin datos", con un mensaje informativo.
- **2b. Materiales bajo stock no configurados:**  
  La tarjeta muestra "Sin materiales configurados" o "N/A".
  
## Caso de uso: Agregar material

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Agregar material |
| **Actor principal** | Administrador |
| **Actores secundarios** | Ninguno |
| **Propósito** | Incorporar un nuevo material al catálogo de materiales del almacén. |
| **Precondiciones** | El administrador tiene los datos necesarios del material (nombre, unidad, stock actual, stock mínimo, proveedor). |
| **Postcondiciones** | El material queda registrado en el catálogo y disponible para su uso en otros módulos (ej. requisiciones). |

### Escenario principal (flujo básico)

1. El administrador accede a la sección "Almacén" del módulo de Administración.
2. Selecciona la opción "Agregar material".
3. El sistema muestra un formulario con los campos:
   - Nombre (texto obligatorio)
   - Unidad (ej. piezas, metros, litros)
   - Material actual (stock actual, numérico)
   - Material mínimo (stock mínimo para alerta, numérico)
   - Proveedor (texto)
4. El administrador completa los campos y envía el formulario.
5. El sistema valida los datos (campos obligatorios, números positivos).
6. El sistema guarda el nuevo material y muestra un mensaje de éxito.
7. El sistema redirige al listado de materiales o limpia el formulario.

### Flujos alternativos

- **4a. Nombre de material ya existe:**  
  El sistema muestra error: "Ya existe un material con ese nombre. Use otro nombre o edite el existente".
- **5a. Datos inválidos (negativos, texto en números):**  
  El sistema marca los campos en rojo y solicita corregirlos.
- **5b. Campos obligatorios vacíos:**  
  El sistema impide el envío y resalta los campos faltantes.

## Caso de uso: Ver catálogo de carpinteros

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Ver catálogo de carpinteros |
| **Actor principal** | Administrador |
| **Actores secundarios** | Ninguno |
| **Propósito** | Mostrar la lista de carpinteros registrados con su estado y cantidad de proyectos asignados. |
| **Precondiciones** | Existe al menos un carpintero en el sistema. |
| **Postcondiciones** | El administrador visualiza la información actualizada. |

### Escenario principal (flujo básico)

1. El administrador accede a la sección "Carpinteros".
2. El sistema carga y muestra un catálogo con las columnas:
   - Nombre
   - Estado (Disponible, En proyecto)
   - Proyectos Asignados (número)
3. El administrador puede ordenar o buscar por nombre (opcional).
4. El administrador finaliza la consulta.

### Flujos alternativos

- **1a. No hay carpinteros registrados:**  
  El sistema muestra un mensaje "No hay carpinteros" y sugiere agregar uno.

## Caso de uso: Agregar carpintero

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Agregar carpintero |
| **Actor principal** | Administrador |
| **Actores secundarios** | Ninguno |
| **Propósito** | Registrar un nuevo carpintero en el sistema con su nombre. |
| **Precondiciones** | El nombre del carpintero no existe previamente (opcional, según reglas). |
| **Postcondiciones** | El carpintero queda disponible para ser asignado a proyectos. |

### Escenario principal (flujo básico)

1. El administrador accede a la sección "Carpinteros" y selecciona "Agregar carpintero".
2. El sistema muestra un formulario con un campo: "Nombre" (obligatorio).
3. El administrador ingresa el nombre y envía.
4. El sistema valida que el nombre no esté vacío y (opcional) que no esté duplicado.
5. El sistema guarda el nuevo carpintero con estado "Disponible" y proyectos asignados = 0.
6. El sistema muestra mensaje de éxito y actualiza el catálogo.

### Flujos alternativos

- **3a. Nombre duplicado (si se controla):**  
  El sistema muestra error: "Ya existe un carpintero con ese nombre".
- **4a. Campo vacío:**  
  El sistema impide guardar y solicita el nombre.

## Caso de uso: Eliminar carpintero y reasignar proyectos

| Elemento | Descripción |
|----------|-------------|
| **Nombre** | Eliminar carpintero y reasignar proyectos |
| **Actor principal** | Administrador |
| **Actores secundarios** | Módulo de proyectos |
| **Propósito** | Eliminar un carpintero del sistema, pero antes reasignar todos sus proyectos activos a otro carpintero disponible. |
| **Precondiciones** | El carpintero a eliminar existe. Si tiene proyectos asignados, debe existir al menos otro carpintero disponible para reasignar. |
| **Postcondiciones** | El carpintero es eliminado. Sus proyectos pasan a tener un nuevo responsable (el carpintero destino). |

### Escenario principal (flujo básico)

1. El administrador accede al catálogo de carpinteros.
2. Selecciona la opción "Eliminar" junto al carpintero deseado.
3. El sistema verifica si el carpintero tiene proyectos asignados (proyectos en estado distinto a "Entregado" o "Cancelado").
4. **Si tiene proyectos asignados:**  
   a. El sistema muestra una lista de los proyectos afectados.  
   b. Solicita seleccionar un carpintero destino (solo muestra carpinteros con estado "Disponible").  
   c. El administrador selecciona el carpintero destino.  
   d. El sistema reasigna todos los proyectos del carpintero eliminado al carpintero destino.  
   e. El sistema elimina al carpintero original.  
5. **Si no tiene proyectos asignados:**  
   El sistema elimina directamente al carpintero.
6. El sistema muestra mensaje de éxito y actualiza el catálogo.

### Flujos alternativos

- **3a. Carpintero tiene proyectos pero no hay carpinteros disponibles:**  
  El sistema impide la eliminación y muestra mensaje: "No hay carpinteros disponibles para reasignar los proyectos. Antes cambie el estado de algún carpintero o finalice proyectos".
- **4b. Administrador cancela la operación:**  
  No se realiza ningún cambio y se vuelve al catálogo.
# Estimación de tiempo por caso de uso (estudiantes de semestres intermedios)

> **Supuesto:** Todo el diseño está listo (diagramas, wireframes, modelo de datos, reglas de negocio). Solo se codifica.  
> **Factor aplicado:** 2.5 - 3 veces sobre estimación profesional.

| # | Caso de uso | Horas profesional (rango) | Factor | Horas estudiante (rango) |
|---|-------------|---------------------------|--------|---------------------------|
| 1 | Ver vista global de proyectos | 3 – 4 | 2.5 – 3 | 7.5 – 12 |
| 2 | Ver avance de proyectos (histograma) | 3 – 4 | 2.5 – 3 | 7.5 – 12 |
| 3 | Visualizar panel de indicadores (4 tarjetas) | 2 – 3 | 2.5 – 3 | 5 – 9 |
| 4 | Agregar material | 2 – 3 | 2.5 – 3 | 5 – 9 |
| 5 | Ver catálogo de carpinteros | 2 – 3 | 2.5 – 3 | 5 – 9 |
| 6 | Agregar carpintero | 1 – 2 | 2.5 – 3 | 2.5 – 6 |
| 7 | Eliminar carpintero con reasignación de proyectos | 4 – 6 | 2.5 – 3 | 10 – 18 |

## Totales

| Concepto | Horas |
|----------|-------|
| **Suma mínima (estudiante)** | 7.5+7.5+5+5+5+2.5+10 = **42.5** |
| **Suma máxima (estudiante)** | 12+12+9+9+9+6+18 = **75** |
| **Ajuste por integración y pruebas entre módulos** | +5 a +10 |
| **Total final estimado (estudiante)** | **48 – 85 horas** |

## Equivalencia en días / semanas

- **Jornada completa (8 h/día):** 6 – 10.5 días hábiles  
- **Tiempo parcial (4-5 h/día, común en estudiantes):** 2 – 3.5 semanas  

## Nota

Esta estimación considera curva de aprendizaje, debugging, errores de integración y trabajo en equipo no optimizado. Si se usan herramientas low‑code o administradores automáticos, los tiempos pueden reducirse hasta un 40%.