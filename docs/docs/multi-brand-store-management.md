# Gestión comercial multi-tienda

<card-summary>
Define las relaciones entre los dominios Cliente y Tienda. 
Incluye la organización de datos de usuario, catálogo de productos, carrito de compras, órdenes y gestión de stock en sucursales
</card-summary>

**CoRD** es una plataforma integral diseñada para operar las múltiples tiendas comerciales de **inRetail**,
cada una con sus propios catálogos de productos, categorías, y sucursales físicas.

El sistema permite una gestión descentralizada de las tiendas mientras mantiene una **experiencia unificada para los
clientes.**

La arquitectura del dominio está orientada a permitir la operación independiente de cada tienda, manteniendo al mismo
tiempo una gestión centralizada de usuarios, lo que facilita que los clientes puedan acceder a todas las marcas de la
empresa con un único perfil.

## Modelo de dominio {id="cord_domain-model"}

![cord-domain-model.svg](cord-domain-model.png){thumbnail="true"}


El dominio de **Cliente** gestiona toda la información personal y preferencias del usuario. Cuando un cliente interactúa
con
nuestra plataforma, puede utilizar sus datos personales y direcciones de envío almacenadas para realizar compras de
manera eficiente. Asimismo, tiene acceso a sus métodos de pago guardados, como tarjetas de crédito, lo que elimina la
necesidad de ingresar esta información repetidamente.

En el dominio de **Tienda**, proporcionamos una experiencia comercial completa:

El **Catálogo de productos** organiza la oferta de productos de cada tienda en categorías intuitivas, facilitando la
navegación y búsqueda de productos específicos.

Cuando un cliente selecciona artículos, estos se agregan a su **Carrito de compras**, que mantiene una referencia
directa a los productos del catálogo.
Al finalizar la compra, el carrito genera una **Orden de compra**.

Cada **sucursal** mantiene su propio Stock de productos, que se ve afectado cuando se confirma una orden. El sistema
verifica la disponibilidad de los productos en tiempo real, asegurando que solo se puedan ordenar artículos con
existencias suficientes.

## Dominios principales {id="cord_domains"}

| Dominio                                   | Descripción                                                                                                                   |
|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Tienda**                                | Entidad comercial con identidad propia que ofrece un catálogo de productos específico.                                        |
| **Sucursal**                              | Ubicación física donde una marca ofrece sus productos. El stock de un producto está directamente relacionado a cada sucursal. |
| [**Catálogo**](product-catalog-doc.md)    | Conjunto estructurado de productos y categorías que ofrece una marca.                                                         |
| [**Categoría** ](categories-model-doc.md) | Agrupación temática o funcional de productos dentro de un catálogo.                                                           |
| [**Producto**](products-model-doc.md)     | Artículo o servicio que se ofrece para venta en una marca específica.                                                         |
| **Cliente**                               | Persona que interactúa con el sistema para adquirir productos de las diferentes marcas.                                       |
| **Carrito de Compras**                    | Agrupación temporal de productos seleccionados por el cliente antes de confirmar una compra.                                  |
| **Orden de Compra**                       | Registro formal de una transacción comercial generada a partir de un carrito de compras.                                      |
| **Dirección de Envío**                    | Información de localización donde se entregan productos adquiridos.                                                           |
| **Método de Pago**                        | Configuración seleccionada por un cliente para realizar sus pagos.                                                            |

## Reglas generales {id="cord_general_rules"}

El sistema de **CoRD** está sujeto a las siguientes reglas generales:

**1. Independencia de Marcas:**

* Cada tienda opera de manera independiente con su propio catálogo de productos.

**2. Cliente único:**

* Los clientes utilizan un único perfil (identificador/contraseña) para acceder a todas las tiendas.
* Las credenciales son válidas en cualquier canal de venta de cualquier tienda.

**3. Categorización por Tienda:**

* Cada tienda define su propia jerarquía de categorías para clasificar productos.
* Las categorías son exclusivas de cada tienda y no se comparten entre ellas.

**4. Operación de Canales de Venta:**

* Cada tienda puede operar múltiples canales de venta simultáneamente.
* Un mismo producto puede estar disponible en distintos canales de venta de la misma marca.