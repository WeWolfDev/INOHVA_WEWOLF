
## Funcionalidad de cada modulo, con explicacion detallada (No tecnica).
- Compras

    **Funcionalidad Princpal**
       Pestaña de inventario (almacén) PRIORIDAD EXTREMA
  Debe incluir en la pestaña de almacen estos datos:
   Función de actualización automática de materiales en la lista de inventario ligado a fichas de pago y pedidos. PRIORIDAD ALTA.


    1. Creacion de proyectos: Permite la creacion de proyectos, tomando los siguientes datos del proyecto a crear:
        - Nombre de proyecto.
        - Numero de conceptos (muebles).
        - Carpintero responsable.
        - Fecha de entrega
        - Por cada concepto se incluye el llenado de la siguiente informacino: Nombre y descripcion.
        - Observaciones
    
    2. Agregar Materiales: Permite el agregado de un nuevo material al catalogo de materiales, por medio de un formulario que recabe los siguientes datos:
        - Nombre
        - Unidad
        - Material Actual
        - Material Minimo -> Función de notificación/alerta relacionado a stocks mínimos de materiales. PRIORIDAD ALTA. ->  Función de generación de reporte de materiales en cero/mínimo (stock). PRIORIDAD MEDIA.


        - Proveedor
    
    3. Ordenes de Compra: Permite la requisicion de materiales por medio de ordenes, las cuales incluyen la siguiente informacion:
    Pestaña de cotizaciones con dashboard con los datos de las cotizaciones y sus etapas, así como avance general y datos extra. PRIORIDAD BAJA
      Debe incluir:
        - Material (seleccion del catalogo).
        - Cantidad (la unidad es la que aparece en el catalogo del material seleccionado).
        - Costo aproximado (en pesos mexicanos).
    Estas ordenes de compra aumentan el stock de cierto material del cual se realizo la orden de compra.
    
    **Funcionalidad Secundario**

    1. Comprobacion de materiales: funcion actuando en materiales que revisa en cada salida de materiales (por creacion de proyecto), que revisa que el stock de materiales no cruce de el minimo.

    2. Validacion de materiales para proyectos: Valida que los materiales asociados al proyecto esten presentes y sea suficientes para que el proyecto pueda pasar a produccion. En caso de no ser suficientes, el proyecto no puede pasar a la siguiente etapa (produccion).

# Produccion

    **Funcionalidad Princpal**

    1. Administracion de cada proyecto creado en el area de produccion, esta administracion incluye las siguientes secciones:

        - Conceptos: Cada concepto incluye la siguiente informacion: Prioridad EXTREMA
            - Nombre de proyecto 
            - Cliente  
            - Nombre del concepto.
            - Descripcion del concepto.
            - Las etapas de produccion son:
            
            
 1\. PLANOS  
 2\. MATERIAL  
 3\. PINTURA  
 4\. HERRAJES  
 5\. CARPINTERÍA  
 6\. PINTURA  
 7\. PREARMADO  
 8\. EMPLAYE  
 9\. ENVIO  
 10\. INSTALACIÓN  
 11\. RETOQUE  
 12\. FIRMA
            - Nombre del concepto, Descripcion. Las etapas de produccion son "modificables" (en sentido de poder completar cada etapa). Por medio de una checkbox
            Display por mueble con su información de progreso individual y fecha de la etapa actual. PRIORIDAD ALTA.
            Función de registro de incidencias por proyecto general y por mueble de cada proyecto, así como registro de fecha y descripción de incidencia. PRIORIDAD ALTA.
            Función de aviso de incidencias registradas visualizables en proyectos. PRIORIDAD ALTA.
            Asignación de prioridad de incidencias. PRIORIDAD ALTA.
            Función de notificación por días de atraso inminentes. PRIORIDAD ALTA.

            - Fecha de entrega programada

        - Informacion de proyecto: Cada proyecto incluye la siguiente informacion:
            - Nombre de proyecto
            - Numero de conceptos 
            - Carpintero responsable
            - Barra de progreso general (calculado en base al avance de cada concepto)
            - Informacion de concepto (visto en el punto anterior).

    2. Aprobacion o rechazo de proyecto: Siguiendo con la administracion de cada proyecto, el sistema permite la aprobacion de un proyecto, basado en una revision manual del mismo, en caso de que no cumpla con X criterios, el proyecto se rechaza, a lo cual permite modificar todos los estados de produccion de cada concepto (dejando inicialmente el avance general al 100% para su posterior cambio en base a las modificaciones pertinentes que se hagan).

    3. Cambio de estado del proyecto: Permite el proceso de pasar un proyecto a un estado a otro en base al avance del proyecto y su revision pertinente (ver el anterior punto). estos estados incluyen....
        - Listos
        - En Produccion
        - En pausa
        - En Revision
        - Entregado

    4. Cinta tarjetas de estados de proyectos: Paneles que informan el numero de proyecto que cumplen con X estado, los estados definidos son los siguientes:
        - Listos
        - En Produccion
        - En pausa
        - En Revision
        - Entregados

    **Funcionalidad Secundario: N/A**
     
- Administracion

    Funcionalidades principales y secundarias del modulo por secciones.
        
    1. Proyectos:Incluye la siguiente informacion.
        
        **Funcionalidad Princpal**
        
        - Vista global de proyectos: contiene la siguiente informacion de cada proyecto en el sistema:
            - Nombre
            - Responsable (carpintero responsable).
            - Estado.
            - Fecha de creacion.
            - Barra de progreso.
        
        - Avance de proyectos: Grafico que muestra el avance del # de proyectos por periodos de tiempo, en formato de histograma.
       
        **Funcionalidad Secundario**

       - Panel de 4 tarjetas que contienen.
            - Total de proyectos (en genereal de todo el sistema)
            - Carpinteros disponibles (subleyenda con el total de todos los carpinteros del sistema)
            - Materiales bajo de stock (subleyenda con el numero de material (Madera, MDF...)).
            - Proyectos Entregados
         
    
    2. Almacen.

        **Funcionalidad Princpal**

        - Agregar Materiales: Permite el agregado de un nuevo material al catalogo de materiales, por medio de un formulario que recabe los siguientes datos:
            - Nombre
            - Unidad
            - Material Actual
            - Material Minimo
            - Proveedor

        **Funcionalidad Secundario: N/A**

    3. Carpinteros.

        **Funcionalidad Princpal**

        - Administracion de carpinteros: Permite la vista del catalogo de carpinteros, pudiendo visualizar la siguiente informacion:
            - Nombre
            - Estado (Disponible, En proyecto).
            - Proyectos Asignados.

        - Agregado de carpinteros: Permite agregar nuevos carpinteros al sistema, unicamente recabando la informacion del nombre del carpintero a agregar.

        - Eliminacion de carpinteros: Permite eliminar a un carpintero, reasignando en el proceso los proyectos asociados al carpintero que se elimino a un carpintero 

        **Funcionalidad Secundario: N/A**

    4. Reportes:
         
        Sin funcionalidad alguna.
