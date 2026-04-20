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
