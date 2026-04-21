# Casos de uso del módulo de compras

## Caso de uso: Aviso de material faltante
### Descripción:
El sistema notifica al usuario en el módulo de compras del área de almacenamiento cuando un material está por debajo del mínimo permitido.

### Actores:
- Usuario  

### Precondición:
- El sistema de almacén de materiales debe funcionar plenamente.  

### Flujo principal:
1. El sistema detecta que un material está por debajo del mínimo permitido.  
2. El sistema lanza una alerta visual junto al nombre del material cuyo stock está por debajo del mínimo.  
3. El usuario visualiza la alerta.  
4. El usuario toma las acciones necesarias para solucionarlo.  

### Flujo alternativo:
- **Error de validación de stock:** El sistema no logra calcular correctamente el stock mínimo y no muestra la alerta.  

### Postcondiciones:
- El sistema muestra exitosamente que el stock del material está por debajo del mínimo permitido.  
- El usuario visualiza la alerta visual resultante.  

### Requisitos especiales:
- Validación del stock del material.  

---

## Caso de uso: Registrar material
### Descripción:
El usuario interactúa con la función de "Agregar material" del módulo de compras, registrando un nuevo material en el stock del sistema.

### Actores:
- Usuario  

### Precondición:
- El sistema debe contar con un formulario para registrar los datos del material.  
- Debe existir un espacio en el almacén para guardar el material.  

### Flujo principal:
1. El usuario ingresa a la función “Agregar materiales”.  
2. El sistema muestra el formulario de registro.  
3. El usuario ingresa los datos del material.  
4. El usuario guarda los datos exitosamente.  
5. El sistema notifica que el material fue guardado.  

### Flujo alternativo:
- **Formulario inconcluso:** El sistema o el usuario se cierra abruptamente, los datos no se guardan.  

### Postcondiciones:
- El sistema registra exitosamente el material.  
- El material guardado puede usarse en otros módulos.  

### Requisitos especiales:
- Validación de campos.  

---

## Caso de uso: Visualizar materiales
### Descripción:
El sistema muestra al usuario los materiales almacenados para su consulta.  

### Actores:
- Sistema  

### Precondición:
- El sistema cuenta con una sección “Almacén” con materiales precargados.  

### Flujo principal:
1. El usuario ingresa al apartado de almacén.  
2. El sistema carga la información del almacén.  
3. El usuario visualiza los materiales guardados.  

### Postcondiciones:
- Los materiales se muestran exitosamente.  
- El usuario puede consultar la información del almacén.  

### Nota:
Este caso describe cómo el sistema gestiona y presenta los datos al usuario.  

---

## Caso de uso: Filtro de búsqueda
### Descripción:
El usuario busca un material específico en el almacén mediante un filtro de coincidencias.  

### Actores:
- Usuario  

### Precondición:
- El sistema cuenta con materiales registrados.  
- El sistema del almacén funciona plenamente.  
- Existe una barra de búsqueda en la sección de almacén.  

### Flujo principal:
1. El usuario accede al buscador en el módulo de compras.  
2. El usuario teclea el nombre del material.  
3. El sistema localiza coincidencias.  
4. El usuario visualiza los resultados.  

### Flujo alternativo:
- **Nombre incorrecto:** El sistema no encuentra coincidencias y no devuelve resultados.  

### Postcondiciones:
- El usuario encuentra el material buscado.  

### Requisitos especiales:
- Algoritmo de búsqueda por coincidencias.  

---

## Caso de uso: Crear orden de compra
### Descripción:
Crear una nueva orden de compra y guardarla en el sistema para monitoreo y visualización.  

### Actores:
- Usuario de compras  
- Administrador  

### Precondición:
- Existe un material con stock mínimo alcanzado o sobrepasado.  

### Flujo principal:
1. El usuario selecciona “Crear nueva orden”.  
2. El sistema presenta la plantilla de llenado.  
3. El usuario completa los campos requeridos.  
4. El usuario confirma la creación.  

### Flujo alternativo:
- **Cancelar orden:** El usuario decide cancelar el llenado y el sistema suprime el formato.  

### Postcondiciones:
- Flujo principal: La orden queda registrada.  
- Flujo alternativo: El sistema continúa sin cambios.  

### Requisitos especiales:
- Validación de campos en el formulario.  

---

## Caso de uso: Registro de órdenes
### Descripción:
Guardar y presentar órdenes de compra previamente creadas para su visualización y monitoreo.  

### Actores:
- Usuario de compras  
- Administrador  

### Precondición:
- Debe existir al menos una orden creada.  

### Flujo principal:
1. El usuario confirma la creación de una orden.  
2. El sistema guarda la orden.  
3. El sistema muestra la lista de órdenes en la pestaña correspondiente.  
4. La lista se actualiza colocando la más reciente arriba.  

### Flujo alternativo:
- **Órdenes vencidas:** El sistema elimina automáticamente las órdenes cuya fecha de entrega ya pasó.  

### Postcondiciones:
- Flujo principal: Lista actualizada con la orden más reciente.  
- Flujo alternativo: Lista actualizada sin órdenes vencidas.  

### Requisitos especiales:
- Eliminación automática de órdenes vencidas.  

---

## Caso de uso: Etapas de cotización
### Descripción:
Visualizar y actualizar el progreso de una cotización proyecto-cliente desde su conceptualización hasta su aceptación o rechazo.  

### Actores:
- Usuario de compras  

### Precondición:
- Debe existir una cotización registrada.  

### Flujo principal:
1. El usuario abre el dashboard de cotizaciones.  
2. El usuario visualiza las etapas.  
3. El usuario marca el checkbox de la etapa a actualizar.  
4. El sistema actualiza el progreso.  

### Flujo alternativo:
- **Cotización aceptada:** El sistema cambia el estado del proyecto a aceptado.  
- **Cotización rechazada:** El sistema cambia el estado del proyecto a rechazado.  

### Postcondiciones:
- El dashboard refleja los cambios introducidos.  

### Requisitos especiales:
- Validación de estados de cotización.  

---

## Caso de uso: Crear proyecto
### Descripción:
Registrar formalmente un nuevo proyecto en el sistema para permitir seguimiento de producción y financiero.  

### Actores:
- Encargado de compras (principal)  
- Módulo de producción (secundario)  

### Precondición:
- Existe una cotización previa registrada.  
- El usuario está autenticado.  

### Flujo principal:
1. El encargado selecciona “Crear nuevo proyecto”.  
2. El sistema solicita datos: nombre, cliente y fecha de entrega.  
3. El usuario ingresa datos y carga archivos requeridos.  
4. El sistema valida formatos y datos.  
5. El usuario confirma la creación.  
6. El sistema guarda la información y habilita fichas de pago.  

### Flujo alternativo:
- **Fecha inválida:** El sistema rechaza fechas pasadas.  
- **Nombre duplicado:** El sistema rechaza nombres ya registrados.  
- **Formato inválido:** El sistema rechaza archivos no compatibles.  
- **Datos incompletos:** El sistema exige completar campos obligatorios.  

### Postcondiciones:
- Proyecto registrado en estado activo.  
- Fichas de pago habilitadas.  
- Proyecto visible en producción.  

### Requisitos especiales:
- Validación de formatos de archivo.  
- Validación de unicidad en nombre de proyecto.  
- Validación de fecha de entrega.  
- Validación de campos obligatorios.  
