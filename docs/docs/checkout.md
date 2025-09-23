# Proceso de Checkout

Gestiona toda la experiencia de compra en la plataforma, desde la creación del
carrito de compras hasta la finalización exitosa de la transacción. Su propósito principal es orquestar todos los
subprocesos necesarios para convertir un carrito de compras en una orden confirmada, manteniendo la consistencia
transaccional en un entorno distribuido.

## Participantes del Sistema {id="participants"}

El proceso de checkout involucra los siguientes componentes y servicios:

### Servicio principal: {id="principal-component"}

- **Checkout service:** Orquestador central que coordina todo el proceso

### Servicios de dominio: {id="domain-services"}

* **Catalog Service**: Gestión de productos, categorías y stock
* **Shopping Cart Service**: Manejo de carritos de compras
* **Fulfillment Service**: Procesamiento de empaquetado, delivery y horarios
* **Orders Service**: Creación y gestión de órdenes
* **Promotions Service**: Aplicación de promociones y descuentos
* **Customers Service**: Gestión de información de clientes

### Sistemas externos: {id="external-services"}

* **Pasarela de pagos (ePagos)**: Pasarela de pago externa para procesamiento de transacciones financieras

## Conceptos Clave {id="key-concepts"}

### Transacción {id="transaction"}

Representa el proceso completo de compra que se inicia cuando un carrito es creado por un usuario y finaliza cuando la
orden es confirmada exitosamente. Cada transacción tiene un identificador único (ID de transacción) que permite asociar
todos los subprocesos y eventos relacionados a una única operación de compra.

### Subtransacción {id="sub-transaction"}

Es cada uno de los procesos específicos que se ejecutan dentro del contexto de una transacción principal. Cada
subtransacción es responsable de una funcionalidad específica del checkout y puede interactuar con uno o más domain
services.
Ejemplos de subtransacciones:

* Aplicación de promociones al carrito
* Validación y obtención de información del cliente
* Cálculo de costos de envío
* Procesamiento del pago
* Creación de la orden final

### Evento {id="events"}

Es un mensaje que representa un **cambio de estado significativo en el sistema**. Los eventos permiten la comunicación
asíncrona entre servicios y actúan como disparadores para iniciar subtransacciones o procesos específicos.

Tipos de eventos en el checkout:

* **Eventos de inicio**: Disparan el comienzo de una transacción (ej: `CartCreatedEvent`)
* **Eventos de progreso**: Indican la finalización exitosa de una subtransacción (ej: `PromotionsAppliedEvent`)
* **Eventos de error**: Señalan fallos que requieren compensación (ej: `PaymentFailedEvent`)
* **Eventos de finalización**: Confirman la completion exitosa del proceso (ej: `OrderCreatedEvent`)

Cada evento contiene información relevante sobre el cambio de estado y el contexto necesario para que otros servicios
puedan procesar la información adecuadamente.

## Ciclo de vida de la transacción {id="checkout-lifecycle"}

Define los estados por los que transita una transacción desde su inicialización hasta su finalización, ya sea exitosa o
fallida. Este modelo de estados garantiza la consistencia transaccional y proporciona puntos de control claros para el
manejo de errores y recuperación.

<code-block lang="plantuml" src="../../puml/checkout-lifecycle.puml" />

### Estados del Ciclo de Vida

**`LISTENING`**
Estado inicial donde la transacción está activa y receptiva a configuraciones del cliente. El sistema acepta operaciones
como identificación de cliente, configuración de direcciones y selección de modalidades de envío, manteniendo
flexibilidad en el orden de ejecución.

**`READY`**
Estado que indica que la transacción cuenta con toda la información mínima requerida para crear la orden. Actúa como
gate de validación que garantiza la completitud de datos obligatorios antes de proceder con operaciones irreversibles.

**`ORDER_PLACED`**
Estado que confirma la creación exitosa de la orden en el sistema. Se han ejecutado operaciones críticas como
vinculación de componentes de productos pack y generación de la firma de orden para procesamiento de pagos.

**`PAYMENT_PROCESSING`**
Estado transitorio durante el procesamiento de pago por la pasarela externa. Incluye mecanismos de timeout para manejar
casos donde la pasarela no responde dentro del tiempo esperado.

**`PAYMENT_AUTHORIZED`**
Estado **final exitoso** que confirma el pago autorizado. Activa automáticamente operaciones post-pago como confirmación
definitiva de orden, notificaciones y procesos de fulfillment.

**`PAYMENT_FAILED`**
Estado **final que indica fallo** definitivo en el procesamiento de pago. Mantiene la orden para auditoría y permite al
cliente reintentar con información actualizada.

### Transiciones y Recuperación

El diseño incluye mecanismos de recuperación que permiten manejar fallos temporales. La transición de **`ORDER_PLACED`**
de vuelta a **`READY`** maneja escenarios de pago abortado o expirado, permitiendo que la orden regrese a estado de
configuración sin perder el contexto. Esto mantiene la integridad transaccional y permite al cliente corregir
información o reintentar el proceso de pago sin necesidad de recrear la orden.

## Inicialización de la transacción {id="transaction-init"}

Se activa automáticamente cuando se crea un carrito de compras en el sistema. En este momento,
el Shopping Cart Service emite un `CartCreatedEvent` que es capturado por el `Checkout` para establecer el contexto
transaccional.
Una característica importante del sistema es su capacidad para manejar sesiones anónimas, lo que significa que los
usuarios pueden interactuar con el carrito sin necesidad de autenticarse inicialmente. Esta funcionalidad requiere un
manejo diferenciado de la identidad del usuario mediante dos identificadores distintos:

* **`UserId`:** Identificador de sesión que se asigna a todos los usuarios, tanto autenticados como anónimos
* **`CustomerId`:** Identificador específico del cliente registrado, que solo está disponible cuando el usuario se ha
  autenticado

La transacción creada actúa como un contenedor que agrupa todos los eventos y subprocesos relacionados con ese carrito
específico.

<code-block lang="plantuml" src="../../puml/checkout-init-transaction-sequence.puml"/>

## Identificación del cliente {id="customer-identification"}

Permite al sistema determinar si está tratando con un cliente existente o con un potencial cliente nuevo, estableciendo
la información necesaria para completar la transacción.

Se inicia cuando el cliente considera que su carrito está completo y desea continuar con el checkout. En este punto, el
sistema debe resolver la identidad del cliente para poder procesar la orden correctamente.
El frontend tiene la flexibilidad de enviar la información del cliente de dos maneras:

1. **`CustomerId`** directo: Cuando el cliente ya está autenticado y registrado en el sistema
2. **Información completa del cliente**: Incluyendo datos como correo electrónico, nombre completo, número de documento,
   etc.

Cuando se proporciona información completa del cliente, el sistema almacena estos datos de forma temporal en el contexto
de la transacción.

**Checkout** actúa como coordinador, consultando al **Customers Service** para verificar si existe un cliente
asociado al correo electrónico proporcionado. Esta validación es importante tanto para clientes nuevos como para
usuarios que proporcionan un **`CustomerId`**, garantizando la integridad de los datos.

<code-block lang="plantuml" src="../../puml/checkout-customer-identification-sequence.puml" />

Un aspecto importante de este subproceso es que **prepara el terreno para la creación automática de nuevos clientes**.
Si la transacción llega al estado **`PaymentConfirmed`** y se determinó que se trata de un cliente nuevo, el sistema
utilizará la información temporal almacenada para registrar automáticamente al nuevo cliente en el sistema.

## Configuración de dirección de entrega {id="delivery-address-setup"}

Determina el destino de la orden y habilita el **cálculo de costos de envío**. Este proceso permite al sistema manejar
tanto direcciones previamente registradas como nuevas direcciones de entrega, manteniendo la flexibilidad necesaria para
diferentes tipos de clientes.

Este paso es fundamental para continuar con el checkout, ya que **la dirección de entrega influye directamente en los
costos de envío, tiempos de entrega y disponibilidad de productos**.

El sistema maneja la información de direcciones de manera similar al proceso de identificación del cliente, ofreciendo
dos modalidades:

1. **`AddressId`** existente: Cuando el cliente utiliza una dirección previamente registrada en el sistema. **Esta
   opción solo
   está disponible para clientes existentes que ya han sido identificados en el subproceso anterior.**
2. **Información completa de nueva dirección**: Cuando se proporciona una dirección nueva con todos los datos necesarios
   como calle, número, ciudad, código postal, referencias adicionales, etc.

Cuando se proporciona información de una nueva dirección, el sistema almacena estos datos de forma temporal en el
contexto de la transacción. Esto permite que el proceso de checkout continúe sin interrupciones mientras se mantiene la
información disponible para uso posterior.

Checkout coordina con el **Customers Service** para validar direcciones existentes cuando se proporciona un
**`AddressId`**, asegurando que la dirección pertenezca efectivamente al cliente identificado y que esté activa.

<code-block lang="plantuml" src="../../puml/checkout-delivery-address-setup-sequence.puml"/>

El sistema prepara la información para el registro automático de nuevas direcciones. Si la transacción alcanza el estado
**`PaymentConfirmed`** y se utilizó una nueva dirección, esta será automáticamente asociada al perfil del cliente,
enriqueciendo su información para futuras compras.

## Configuración de Envío {id="shipping-settings"}

Permite al cliente seleccionar la modalidad de entrega además de la fecha y horarios específicos para recibir su pedido.
Este proceso es fundamental para determinar los costos finales de envío y establecer las expectativas de entrega con el
cliente.

Este subproceso depende que la dirección de entrega haya sido establecida, ya que la ubicación geográfica es
determinante para calcular las modalidades disponibles, costos de flete y ventanas horarias posibles.

Se desarrolla en dos etapas diferenciadas que requieren interacción directa con el cliente:

1. **Primera Etapa - Consulta de Modalidades:** El sistema presenta al cliente las opciones de envío disponibles,
   incluyendo
   modalidades (normal, express), precios de flete y ventanas horarias. Esta información se genera dinámicamente
   basándose
   en los productos del carrito y la dirección de entrega configurada.
2. **Segunda Etapa - Selección de Preferencias:** El cliente evalúa las opciones presentadas y comunica sus preferencias
   específicas, incluyendo la modalidad de envío elegida y la ventana horaria seleccionada para la entrega.

El **Checkout Service** actúa como coordinador entre múltiples fuentes de información. Primero recupera los detalles
actualizados del carrito desde el **Shopping Cart Service**, incluyendo productos, cantidades y características
especiales de envío. Posteriormente, envía esta información junto con la dirección de entrega al Fulfillment Service.

El **Fulfillment Service** considera factores como la ubicación geográfica, el peso y dimensiones de los productos,
restricciones de entrega específicas, y la disponibilidad de servicios de logística en la zona. Como resultado,
proporciona opciones de envío con sus respectivos costos y ventanas horarias disponibles.

Una vez que el cliente toma su decisión, el Checkout Service almacena la configuración seleccionada en el contexto de la
transacción, preparando esta información para la creación posterior de la orden final.

<code-block lang="PlantUML" src="../../puml/checkout-shipping-configuration.puml" />

## Creación de orden {id="orden-creation"}

Consolida toda la información recopilada durante el checkout y genera la orden oficial que será procesada por el
sistema. Este proceso marca la transición de una intención de compra hacia un compromiso formal de transacción.

El subproceso requiere que todos los subprocesos anteriores hayan sido completados exitosamente y que la transacción se
encuentre en estado **`READY`**. No existe un orden específico obligatorio para la ejecución de los subprocesos previos,
con excepción de aquellos que tienen dependencias explícitas entre sí.

Inicia cuando el cliente confirma su intención de proceder con la compra invocando el endpoint específico de creación de
orden. El **Checkout Service** valida primero que la transacción esté en estado **`READY`** y que se hayan completado
todos los subprocesos obligatorios.

El **Checkout Service** recupera los detalles actualizados del carrito desde el **Shopping Cart Service**, incluyendo
items, totales y promociones aplicadas. A continuación, extrae el ID de todos los productos que sean **packs** y
consulta al **Catalog Service** por sus componentes, ya que los componentes de un **pack** deben reflejarse como **ítems
individuales** en la orden.

Posteriormente, consolida esta información con los datos del cliente identificado, la información de facturación, la
dirección de entrega configurada y las preferencias de envío seleccionadas para crear un conjunto completo de
información de orden.

Esta información consolidada se envía al **Orders Service**, que es responsable de la creación formal de la orden en el
sistema. El **Orders Service** procesa todos los datos, asigna un identificador único a la orden y emite automáticamente
el evento **`OrderCreatedEvent`** para notificar a otros componentes del sistema sobre la nueva orden.

El **Checkout Service** vincula el ID de la orden a la transacción en curso, genera una "firma de orden"
(**`OrderSignature`**) que es un hash único que identifica inequívocamente la orden, y actualiza el estado transaccional
a **`ORDER_PLACED`**.

Finalmente, marca el carrito original como **`COMPLETED`** en el **Shopping Cart Service**, cerrando formalmente el
ciclo de vida del carrito de compras. La respuesta incluye el **`OrderId`**, **`OrderSignature`** y **`CustomerId`** (
cuando aplique).

Los procesos adicionales como reserva de stock y otras operaciones post-creación se ejecutan de manera asíncrona
mediante el evento **`OrderCreatedEvent`**, optimizando el tiempo de respuesta al cliente.

<code-block lang="PlantUML" src="../../puml/checkout-order-creation-sequence.puml" />

## Procesamiento post-creación {id="post-creation-processing"}

Una vez creada la orden exitosamente, el sistema ejecuta automáticamente procesos en segundo plano que finalizan la
configuración mediante el evento **`OrderCreatedEvent`**. Estos procesos aseguran la reserva de recursos y actualizan la
información del cliente de forma asíncrona.

El **Checkout Service** recibe el evento, recupera el contexto de la transacción y los detalles de la orden para
proceder con las operaciones de finalización.

### Reserva de Stock

El sistema procede inmediatamente con la reserva de stock para todos los productos que componen la orden. Esta operación
es crítica para garantizar la disponibilidad de los productos y evitar sobreventa en un entorno de alta concurrencia.

El **Checkout Service** envía al **Catalog Service** la información detallada de cada item, incluyendo **`orderId`**,
**`productId`**, **`branchId`** y **`quantity`**, permitiendo que el sistema de inventario vincule específicamente las
reservas con la orden correspondiente.

### Registro de Cliente y Direcciones

Paralelamente a la reserva de stock, el sistema evalúa si es necesario completar el registro de información del cliente
basándose en los datos temporales almacenados durante el checkout.

**Para nuevos clientes:** El sistema procede con el registro completo del cliente utilizando la información
proporcionada durante la identificación. Una vez creado el perfil, vincula el **`customerId`** generado con la
transacción y procede a registrar la dirección de entrega como la primera dirección asociada al nuevo cliente.

**Para clientes existentes:** El sistema evalúa si la dirección de entrega utilizada es nueva. En caso afirmativo, la
registra como una nueva dirección en el perfil del cliente, expandiendo sus opciones para futuras compras.

Independientemente del tipo de cliente, el sistema marca la dirección de entrega como la **última dirección utilizada**,
mejorando la experiencia del usuario en futuras transacciones al sugerir esta dirección como predeterminada.

Este procesamiento asíncrono asegura que la orden quede completamente configurada y lista para los siguientes pasos del
fulfillment, mientras mantiene actualizada la información del cliente en el sistema.

<code-block lang="PlantUML" src="../../puml/checkout-post-creation-processing.puml" />

## Procesamiento de pago {id="payment-processing"}

Gestiona la interacción entre la aplicación web, la pasarela de pagos externa (ePago) y el sistema backend para procesar
el pago de la orden. Este proceso maneja tanto escenarios exitosos como fallos o desistimientos, garantizando la
consistencia del estado transaccional.

El proceso se inicia cuando el usuario decide proceder con el pago de su orden. La aplicación web presenta un modal de
pago que integra mediante iframe el formulario de la pasarela ePago, proporcionando una experiencia de pago segura y
fluida.

### Inicio del Proceso de Pago

La **WebApp** abre un modal de pago e integra el formulario de ePago mediante iframe embedding. La pasarela externa
renderiza el formulario de captura de información de tarjeta directamente en la interfaz del cliente, manteniendo la
seguridad de los datos sensibles.

### Escenarios de Finalización

**Pago Exitoso**<br/>
Cuando el usuario completa exitosamente la información de pago y ePago procesa la transacción, la pasarela responde con
**`ecommerceCapureResponse`** indicando éxito. La **WebApp** valida que `response.success` y `response.result.accepted`
sean verdaderos antes de notificar al backend.

El **Checkout Service** recibe la confirmación mediante el endpoint de resultado de pago y procede a actualizar la
información de pago en el **Orders Service**. Esta actualización genera automáticamente eventos del sistema que
notifican el cambio de estado. La transacción se actualiza al estado **`PAYMENT_PROCESSING`** y el usuario es redirigido
a la página de orden confirmada.

**Pago Fallido**<br/>
Cuando ePago rechaza, deniega o marca como inválida la transacción, la **WebApp** recibe una respuesta negativa. El
sistema procede con la cancelación de la orden a través del **Orders Service**, que emite un **`OrderCancelledEvent`**
para notificar el fallo.

El **Checkout Service** desvincula la orden de la transacción y reactiva el carrito original, regresando la transacción
al estado **`READY`**. Esto permite al usuario corregir información de pago o intentar nuevamente sin perder la
configuración del checkout.

**Desistimiento del Usuario**<br/>
Si el usuario cierra el modal de pago sin completar la transacción, la **WebApp** notifica al backend el desistimiento.
El **Checkout Service** informa a ePago sobre la cancelación y procede con la misma lógica de fallo: cancela la orden,
reactiva el carrito y regresa la transacción al estado **`READY`**.

### Mecanismos de Recuperación

El diseño incluye mecanismos robustos de recuperación que permiten al usuario reintentar el proceso de pago manteniendo
toda la configuración previa. La reactivación del carrito y el retorno al estado **`READY`** aseguran que no se pierda
información valiosa del checkout realizado.

<code-block lang="PlantUML" src="../../puml/checkout-start-payment-process.puml" />

## Confirmación de pago por webhook {id="payment-webhook-confirmation"}

Maneja la notificación asíncrona de la pasarela de pagos **ePago** sobre el resultado final del procesamiento de pago.
Este mecanismo garantiza que el sistema backend reciba **confirmación definitiva** del estado de la transacción,
independientemente de la interacción del usuario con la interfaz web.

La pasarela envía automáticamente una notificación webhook al **Checkout Service** una vez que completa el
procesamiento de la transacción de pago. Esta notificación incluye información detallada como la firma de seguridad,
datos de la transacción y el resultado del procesamiento. Para detalles completos sobre la estructura de eventos y
parámetros, consulte la [documentación oficial de ePago](https://docs.epago.pe/api-events).

### Procesamiento de la Notificación

El **Checkout Service** recibe el webhook en el endpoint específico y recupera el contexto de la transacción utilizando
el **`orderId`** proporcionado en la notificación. Con esta información, procede a actualizar la información de pago en
el **Orders Service**.

La actualización incluye detalles críticos como el **`methodType`** (tipo de método de pago utilizado),
**`paymentTransactionId`** (identificador único de la transacción en ePago) y **`status`** (estado final del
procesamiento). Esta información se almacena permanentemente en la orden para auditoría y conciliación posterior.

### Emisión de Eventos Finales

Basándose en el resultado del pago recibido, el **Orders Service** emite automáticamente el evento correspondiente que
notifica al resto del sistema sobre el estado final de la orden:

**Pago Autorizado**
Cuando el resultado indica **`AUTHORIZED`**, el sistema emite un **`OrderConfirmedEvent`** que activa todos los procesos
downstream necesarios para el fulfillment de la orden, incluyendo preparación, empaquetado y coordinación de entrega.

**Pago Fallido**
Para cualquier resultado diferente a **`AUTHORIZED`** (rechazado, denegado, error), el sistema emite un
**`OrderCancelledEvent`** que inicia los procesos de compensación, liberación de stock reservado y notificaciones al
cliente sobre el fallo en el pago.

<code-block lang="PlantUML" src="../../puml/checkout-payment-webhook-confirmation.puml" />

## Operaciones de compensación {id="compensation-operations"}

Gestiona la reversión de operaciones críticas cuando una orden es cancelada, garantizando que los recursos reservados
sean liberados y el sistema mantenga consistencia. Este proceso se activa automáticamente mediante el evento
**`OrderCancelledEvent`** y opera de forma asíncrona.

Las operaciones de compensación son esenciales para mantener la integridad del sistema en escenarios de fallo de pago,
desistimiento del cliente o cualquier otro motivo que resulte en la cancelación de una orden previamente creada.

### Activación del Proceso

El **Checkout Service** recibe el evento **`OrderCancelledEvent`** y recupera los detalles completos de la orden
cancelada desde el **Orders Service**. Con esta información, identifica todos los recursos que fueron reservados durante
el proceso de creación y procede con su liberación sistemática.

### Liberación de Stock Reservado

La operación principal de compensación consiste en liberar las reservas de stock que fueron establecidas durante el
procesamiento post-creación. El **Checkout Service** extrae todos los items que componen la orden y envía al **Catalog
Service** las instrucciones específicas para liberar cada reserva.

La liberación permite que el sistema de inventario identifique y libere exactamente las reservas correspondientes a la
orden cancelada. Esto garantiza que el stock quede nuevamente disponible para otras transacciones.

<code-block lang="PlantUML" src="../../puml/checkout-compensation-operations.puml" />

> El proceso debe operar de forma idempotente, lo que significa que puede ejecutarse múltiples veces sin generar efectos
> adversos, proporcionando robustez adicional en escenarios de reintento o procesamiento duplicado de eventos.
