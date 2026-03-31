Aqui pondremos la info de los exceles que nos dio el cliente

Prueba 4 DASHBOARD

PRODUCCIÓN:

El cliente quiere:  
\* Nombre de proyecto  
\* Cliente  
\* Número de muebles (lo que nosotros tenemos como conceptos)  
\* ESTADOS de cada mueble (en orden):  
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

Al seleccionar un mueble en particular, se debe de mostrar la etapa en la que se encuentra junto con su porcentaje y la fecha de esa etapa.  
El proyecto general debe de mostrar el porcentaje de avance completado y faltante. Un proyecto grande con "miniproyectos", los cuales serían cada mueble a completar.

Debe existir un apartado de incidencias donde habrá un contador automático de incidencias, y por cada una se podrá registrar fecha y descripción de lo que se desea reportar. Cada apartado de mueble por proyecto podrá tener un registro de incidencias. Cada incidencia que sea registrada se notificará a compras, se revisará y así se podrá realizar los cambios correspondientes en la ficha de compras.

COMPRAS:

Lista de inventario \- 2026(excel)

La lista de inventario debe de organizarse con el listado de material, su tipo, su precio por unidad, debe de tener un stock mínimo, la unidad de medida con la que se trabaja, un apartado de entrada que diga cuándo es que ocurre la entrada del material (fecha), un valor de inventario basado en la entrada (cantidad actual \* precio por unidad), la salida de materiales deberá estar vinculada a las fichas de pago, las cuales tras hacerse y registrarse descontarán automáticamente los materiales de la cantidad actual, la cantidad actual del material y una sección de observaciones.

Para cada material debe de existir una función de notificación cuando el material esté “menor/igual a” o “igual a” una cantidad determinada con respecto al stock mínimo.

La lista de inventario debe aceptar valores con decimales.

Para la lista de almacén, debe de poder hacerse un “corte” de registro de material, donde  después de un periodo de registro, pueda hacerse una nueva entrada.

Este Excel se enfoca en el apartado de PROYECTOS, su información de precios y materiales va más hacia órdenes de compra que a finanzas y contabilidad.

Pedidos materiales-obras (excel)

Esta sección de pedidos incluye el material a pedir, y por cada material su precio unitario, cada mueble donde se requiere y en cuánta cantidad, un **REND\*\***, la cantidad necesaria total con respecto al **REND\*\***, el volumen total del pedido y el importe total del pedido.

Cuando se hace una incidencia será para hacer requisición de materiales a compras o para notificar de cambios necesarios para poder llevar a cabo el proyecto detectados en alguna de las etapas, con respecto a los planos.

BASE CONSUMIBLES (excel)

En este documento no hay información que no esté YA existente en el documento de Lista de Inventario \- 2026, A EXCEPCIÓN de IDs de materiales (números: 1,2,3,4,5)

GASTOS Y COMPRAS (excel)\*\*

*– POR REVISAR –*

FECHA-COTIZACIONES-v2 (excel)

 Debe de tener un ID por proyecto, el proyecto debe de incluir cliente, proyecto, fecha de recepción y envío, dias de atraso (si hubiera, se expresa con números fijos), las etapas de la cotización (llenadas por checkbox):

1. pend. inicio  
2. en proceso  
3. pend. por revisión  
4. revisado  
5. enviado

Al final de las etapas:

AVANCE: un visualizador de avance porcentual de la cotización entera. (una barra de carga).

Estatus de proyecto debe de mostrar el mensaje de aprobado o rechazado.

Pendiente por revisión de dirección debe de ser un checkbox de sí o no.

Medio es el lugar por el que se comunicó la cotización.

PRECIOSv2 (excel)

—-------

\*\*\* El documento de RECIBO.docx no se considerará dentro de la estructura del sistema, a no ser que se redefina en un futuro una razón pertinente para su inclusión.

Debe de tener en el apartado de administración, el apartado de saldos donde está el control de todo lo ingresado y pagado de los proyectos. debe de tener un estatus de iniciado, adelanto pagado, terminado por cobrar. Tendrá un apartado de ID de los proyectos, el cliente, proyectos, extras/adicionales, costo del proyecto, anticipos al día, fecha del último anticipo, saldo. Cuando des click a un proyecto, te saldrá el abono más reciente y la fecha del último anticipo. 

***EXTRAS PARA ADMINISTRACIÓN:***

***Control de gastos fijos (excel)***

* Apartado de control de gastos fijos, que ponga el mes, al momento de registrar una nueva entrada en el control de gastos de fijos, debe de aparecer un timestamp de cuándo se realiza el contro. Que tenga un apartad, el concepto del gasto fijo y la cantidad. Que tenga un desplegable entre los estados “ENTREGADO”, “PENDIENTE” o un tercer estado que indique que el concepto durante estos plazos no es necesario pagarlo (“No se paga”), cambiando de color entre ellos.

Por semana, habrá un contador del saldo pendiente por pagar por todos los conceptos (“PENDIENTE”), uno que indique cuando uno de los gastos fijos no se termine de pagar todo el saldo que correspondería a esa semana (“a completar”), y uno que indique la cantidad que sobre en caso de que el saldo pagado sea superior al total de gastos fijos de esa semana (“SOBRAN”). Una función debería implementarse donde el “a completar” debería sumarse al “pendiente” , y el “sobran” debe restarse al “pendiente”, para el total de pendiente.

Igual incluir una opción de quitar o agregar nuevos gastos fijos

También debe de mostrar una sección de acumulable donde, al final de los periodos se muestre cuánto se gastará en total por cada concepto de gasto fijo.

**\*\* Preguntas para el cliente:**

1. **¿Qué es la columna REND, en el documento excel “PEDIDOS MATERIALES-OBRAS”, en la pestaña PEDIDO? (**Pedidos materiales-obras (excel))  
2. **¿Quién es el que maneja principalmente el documento de GASTOS y COMPRAS? (**GASTOS Y COMPRAS (excel)\*\*)  
3. **¿Quién se encarga de los gastos de la gasolina? (**GASTOS Y COMPRAS (excel)\*\*)  
4. **Todo el apartado de servicios y consumibles AFUERA de los proyectos ¿quién lo maneja? (**GASTOS Y COMPRAS (excel)\*\*)  
5. ¿A qué se refiere el DESGASTE en el apartado de Mano de Obra en la pestaña de catálogo en el excel PRECIOSv2 y por qué está rellenado con porcentaje?  
6. ¿Quién se encarga del control de gastos fijos?  
7. En el apartado de SALDOS 25(excel), los estados que se proporcionaron son pagado, pendiente, abonado, inciado, pendiente de inicio, en fabricación, instalación y terminado por cobrar. De estos ¿se tienen que ocupar todos los estados? ¿tienen algún orden? ¿cuál es la relación de esos estados con el documento? ¿qué significa cada estado?
