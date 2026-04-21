# Casos de uso del módulo de produccion

## Caso de uso: Información general
### Descripción: 
El sistema muestra al usuario la información consolidada de cada proyecto en el dashboard, incluyendo datos generales y de conceptos.
### Actores:
- Usuario (encargado de producción)
- Sistema
### Precondición:
- Debe existir al menos un proyecto registrado en el área de producción.
### Flujo principal:
1. El usuario accede al dashboard de producción.

2. El sistema carga la información general de cada proyecto: nombre, cliente, número de conceptos, carpintero responsable y fecha de entrega programada.

3. El usuario visualiza la información consolidada en el panel.
### Flujo alternativo:
- Proyecto sin datos completos: El sistema detecta campos faltantes y muestra un aviso de información incompleta.
### Postcondiciones:
- El usuario obtiene una vista general de los proyectos registrados.
---
## Caso de uso: Estados de cada mueble
### Descripción:
El sistema permite visualizar y actualizar el estado de cada mueble dentro de un proyecto, reflejando su progreso en las etapas de producción.
### Actores:
- Usuario (encargado de producción)
- Sistema
### Precondición:
- El proyecto debe tener conceptos registrados con muebles asociados.
### Flujo principal:
1. El usuario accede al dashboard de producción.

2. El sistema muestra cada mueble con su estado actual en las etapas de producción (planos, material, pintura, carpintería, etc.).

3. El usuario marca la checkbox correspondiente para indicar el avance de una etapa.

4. El sistema actualiza el estado del mueble en tiempo real.
### Flujo alternativo:
- Etapa inválida: El usuario intenta marcar una etapa inexistente, el sistema muestra un error.

- Datos incompletos: El sistema detecta que no se han registrado todas las etapas y solicita completar la información.
### Postcondiciones:
- El estado de cada mueble queda actualizado en el dashboard.
### Requisitos especiales:
- Validación de etapas de producción.
- Registro de incidencias por mueble con fecha y descripción.
---
## Caso de uso: Porcentajes de avance
### Descripción:
El sistema calcula y muestra el porcentaje de avance de cada proyecto en el dashboard, basado en el progreso de sus conceptos y muebles.
### Actores:
- Usuario (encargado de producción)

- Sistema
### Precondición:
- Deben existir conceptos registrados con etapas de producción asociadas.
### Flujo principal:
1. El usuario accede al dashboard de producción.

2. El sistema calcula el porcentaje de avance de cada proyecto en base al progreso de sus conceptos.

3. El sistema muestra la barra de progreso general y el porcentaje correspondiente.

4. El usuario visualiza el avance consolidado.
### Flujo alternativo:
- Error de cálculo: El sistema no logra calcular el porcentaje por datos faltantes, muestra un aviso de error.
### Postcondiciones:
- El usuario visualiza el porcentaje de avance actualizado de cada proyecto.
### Requisitos especiales:
- Validación de datos de avance por concepto.
- Notificación de atrasos inminentes en base a la fecha de entrega programada.