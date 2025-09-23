# Fulfillment

CoRD implementa un modelo de fulfillment basado en la optimización de paquetes que permite determinar las
mejores opciones de entrega para cualquier combinación de productos y destinos. Este modelo abstrae la complejidad
logística para ofrecer a los canales de venta información clara sobre tiempos, costos y modalidades de entrega.

## El Modelo de Paquetes

Todas las entregas se organizan a través de paquetes. Incluso si un carrito contiene un solo producto, este se
agrupa conceptualmente dentro de un paquete. El sistema utiliza algoritmos de empaquetado que consideran las
características físicas y restricciones de negocio de cada producto para crear configuraciones optimizadas.

### Jerarquía del Empaquetado

El sistema utiliza la siguiente jerarquía para organizar las entregas:

**Por Modalidad de Entrega:**

Cada modo de envío (`HOME_DELIVERY` o `PICKUP_IN_STORE`) genera su propia configuración de paquetes
Los paquetes se optimizan según las restricciones específicas de cada modalidad

**Para HOME_DELIVERY:**

* Cada paquete puede ser despachado desde uno o varios orígenes diferentes
* Cada origen tiene fechas y horarios de entrega específicos
* El costo se calcula por `paquete + origen + modalidad`

**Para PICKUP_IN_STORE:**

* Cada paquete puede ser recogido en uno o varios pickup points disponibles
* Cada pickup point tiene horarios operativos específicos
* El costo para esta modalidad es siempre cero

### Diagrama del Flujo de Fulfillment

La siguiente figura ilustra el flujo completo del modelo de fulfillment, desde la entrada del carrito y destino hasta la
generación de paquetes optimizados con sus respectivos orígenes y pickup points:

![Cord fulfillment model](cord_fulfillment_model.png) { thumbnail="true" width="700" }

**Figura 1:** Flujo de procesamiento del modelo de fulfillment CoRD, mostrando la separación por modalidades,
empaquetado optimizado y manejo de productos incompatibles mediante fallback.

## Modalidades de Entrega

| Modalidad             | Descripción                                                               |
|-----------------------|---------------------------------------------------------------------------|
| **`HOME_DELIVERY`**   | Entrega a Domicilio. Ofrece dos niveles de servicio: `NORMAL` y `EXPRESS` |
| **`PICKUP_IN_STORE`** | Retiro en Tienda.                                                         |

> **Restricción importante:** No todos los productos no pueden atenderse la modalidad `PICKUP_IN_STORE` debido a
> limitaciones logísticas

### Manejo de Productos No Compatibles (Fallback)

Cuando se solicita la modalidad **`PICKUP_IN_STORE`**, el sistema identifica automáticamente productos que no pueden ser
retirados en tienda.

**Comportamiento del Sistema:**

* Estos productos se incluyen en la respuesta como productos fallback
* Se muestran al cliente como artículos que no pueden ser atendidos con la modalidad **`PICKUP_IN_STORE`**
* El cliente recibe información clara sobre qué productos requieren entrega a domicilio

## Productos y Clasificación

### Identificación por SKU

Cada producto en el sistema se identifica unívocamente por su SKU (Stock Keeping Unit), que actúa como la clave
principal para todas las operaciones de fulfillment.

### Tipos de Producto y Restricciones

Los productos se clasifican según tipos que determinan sus restricciones de manejo y entrega:

| Código         | Descripción                                                                         |
|----------------|-------------------------------------------------------------------------------------|
| `CHEMICAL`     | Productos químicos que requieren manejo especializado y restricciones de transporte |
| `ELECTRONICS`  | Dispositivos electrónicos que necesitan protección contra impactos y humedad        |
| `FURNITURE`    | Muebles y mobiliario que requieren manejo especial por tamaño y peso                |
| `GLASS`        | Productos de vidrio que necesitan empaquetado protector contra roturas              |
| `LIQUIDS`      | Productos líquidos con restricciones de posición y contenedores herméticos          |
| `MATTRESSES`   | Colchones que requieren manejo especial por dimensiones y compresión                |
| `REFRIGERATED` | Productos que necesitan mantenimiento de cadena de frío durante transporte          |
| `TIRES`        | Neumáticos con restricciones específicas de almacenamiento y transporte             |
| `APPLIANCES`   | Electrodomésticos que requieren manejo cuidadoso por peso y fragilidad              |

### Características Físicas

Cada producto incluye dimensiones (`LxWxH`) y peso que el sistema utiliza para:

* Determinar compatibilidad de empaquetado
* Calcular capacidad de transporte
* Optimizar configuraciones de envío

> Las reglas específicas de compatibilidad entre tipos de productos y las restricciones físicas detalladas están
> definidas por las áreas de negocio especializadas.

## Destinos y Cobertura Geográfica

Un **destino** representa la ubicación donde debe entregarse el pedido, definida por:

* Coordenadas geográficas (latitud/longitud)
* Ubigeo (código de 6 dígitos que identifica el distrito)

El sistema evalúa automáticamente si un destino tiene cobertura disponible para las diferentes modalidades de entrega,
determinando qué servicios están disponibles en cada ubicación geográfica.

## Orígenes de Despacho

Los orígenes son las ubicaciones físicas desde donde se pueden despachar productos:

* **`DISTRIBUTION_CENTER`**: Centros de distribución principales
* **`BRANCH`**: Sucursales comerciales
* **`WAREHOUSE`**: Almacenes especializados
* **`SELLER`**: Vendedores externos o terceros

### Capacidad y Disponibilidad

* Cada origen incluye fechas disponibles de despacho según su capacidad operativa
* La disponibilidad de productos puede variar por origen
* Los productos de vendedores externos (SELLER) tienen orígenes específicos definidos por cada vendedor

## Pickup Points

Los pickup points son ubicaciones físicas donde los clientes pueden recoger pedidos:

* Principalmente ubicados en sucursales (BRANCH)
* Incluyen información operativa: horarios, dirección, capacidad
* Se presentan al cliente ordenados por distancia desde su destino
* Cada punto tiene su calendario de disponibilidad para recojo

