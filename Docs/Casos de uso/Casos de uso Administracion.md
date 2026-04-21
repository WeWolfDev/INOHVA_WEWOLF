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
