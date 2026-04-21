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
