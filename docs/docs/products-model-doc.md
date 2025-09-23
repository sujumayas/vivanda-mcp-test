# Productos

<card-summary>
Describe la definición, categorización, valoración y disponibilidad de los productos en las diferentes tiendas, sucursales y canales de venta.
</card-summary>

Se puede definir a un **Producto** como cualquier artículo o servicio que se ofrece para venta a los clientes.

Cada producto posee un conjunto de atributos que lo identifican y describen, como su código SKU, nombre, descripción e
imágenes. Los productos se organizan en [categorías](categories-model-doc.md) para facilitar su navegación y búsqueda.

Los aspectos clave que caracterizan el modelo de Productos son:

* **Identificación única:** Cada producto cuenta con identificadores únicos (ID, SKU, EAN, permalink) que garantizan su
  trazabilidad en el sistema.
* **Categorización:** Los productos se agrupan
  en [categorías de nivel hoja](categories-model-doc.md#leaf-level-category) que permiten una organización jerárquica.
* **Gestión de stock descentralizada:** El inventario se gestiona a nivel de sucursal, permitiendo conocer tanto el
  stock total como el disponible en cada ubicación física.
* **Estrategia de precios:** Los precios pueden variar según la sucursal y el canal de venta, ofreciendo flexibilidad
  para estrategias comerciales diferenciadas.
* **Control de visibilidad:** La activación o desactivación de productos permite gestionar su visibilidad para los
  clientes, incluso cuando no hay stock disponible.

## Modelo {id="product-model"}

<code-block lang="plantuml" src="../../puml/product-domain-model.puml"/>

Los atributos de producto se organizan en cuatro grupos funcionales:

### Identificación {id="product-identification-attributes"}

| Atributo     | Tipo   | Descripción                                        |
|--------------|--------|----------------------------------------------------|
| `id`         | UUID   | Identificador único del producto                   |
| `externalId` | String | Identificador externo de integración               |
| `sku`        | String | Stock Keeping Unit, código único interno           |
| `ean`        | String | European Article Number, código de barras estándar |

### Presentación {id="product-presentation-attributes"}

| Atributo      | Tipo               | Descripción                        |
|---------------|--------------------|------------------------------------|
| `name`        | String             | Nombre comercial del producto      |
| `description` | String             | Descripción detallada del producto |
| `images`      | ProductImage[1..5] | Imágenes del producto (máximo 5)   |

### Indexación & SEO {id="product-indexing-attributes"}

| Atributo          | Tipo            | Descripción                                                                                |
|-------------------|-----------------|--------------------------------------------------------------------------------------------|
| `category`        | ProductCategory | Categoría del producto                                                                     |
| `keywords`        | String          | Palabras clave para búsqueda                                                               |
| `enabled`         | boolean         | Indicador de borrado lógico (de sistema)                                                   |
| `active`          | boolean         | Bandera booleana que indica si el producto está visible para los clientes                  |
| `permalink`       | String          | URL amigable identifica la categoría en el sistema web. **Este valor es único por tienda** |
| `metaTitle`       | String          | Título optimizado para SEO, utilizado en etiquetas meta de HTML                            |
| `metaDescription` | String          | Descripción optimizada para SEO, utilizada en etiquetas meta de HTML                       |

### Precio & Logística {id="product-pricing-attributes"}

| Atributo     | Tipo            | Descripción                            |
|--------------|-----------------|----------------------------------------|
| `totalStock` | BigDecimal      | Stock total disponible                 |
| `basePrice`  | Price           | Precio base de referencia del producto |
| `unit`       | MeasurementUnit | Unidad de medida del producto          |

### Información Nutricional {id="product-nutritional-attributes"}

| Atributo                    | Tipo    | Descripción                                                    |
|-----------------------------|---------|----------------------------------------------------------------|
| `highSodium`                | boolean | Indica si el producto tiene alto contenido de sodio            |
| `highInSugar`               | boolean | Indica si el producto tiene alto contenido de azúcar           |
| `highInSaturatedFat`        | boolean | Indica si el producto tiene alto contenido de grasas saturadas |
| `containTransFats`          | boolean | Indica si el producto contiene grasas trans                    |
| `avoidExcessiveConsumption` | boolean | Recomienda evitar consumo excesivo                             |
| `avoidItsConsumption`       | boolean | Recomienda evitar su consumo                                   |

### Dimensiones {id="product-dimensions-attributes"}

| Atributo        | Tipo       | Descripción           |
|-----------------|------------|-----------------------|
| `heightInCm`    | BigDecimal | Altura en centímetros |
| `widthInCm`     | BigDecimal | Ancho en centímetros  |
| `lengthInCm`    | BigDecimal | Largo en centímetros  |
| `weightInGrams` | BigDecimal | Peso en gramos        |

### Categorización {id="product-category-attributes"}

| Atributo | Tipo   | Descripción                         |
|----------|--------|-------------------------------------|
| `id`     | UUID   | Identificador único de la categoría |
| `name`   | String | Nombre de la categoría              |
| `path`   | String | Ruta jerárquica de la categoría     |

### Imagen de producto {id="product-image-attributes"}

| Atributo | Tipo   | Descripción                      |
|----------|--------|----------------------------------|
| `id`     | UUID   | Identificador único de la imagen |
| `url`    | URI    | URL de la imagen                 |
| `alt`    | String | Texto alternativo de la imagen   |
| `order`  | int    | Orden de visualización           |

### Precio de producto {id="product-price-attributes"}

| Atributo    | Tipo  | Descripción                                                          |
|-------------|-------|----------------------------------------------------------------------|
| `id`        | UUID  | Identificador único del registro de precio                           |
| `price`     | Price | Estructura de precio, conformado por un valor y una unidad monetaria |
| `branchId`  | UUID  | Identificador de la sucursal                                         |
| `channelId` | UUID  | Identificador del canal de venta                                     |

### Stock de producto {id="product-branch-stock-attributes"}

| Atributo   | Tipo       | Descripción                               |
|------------|------------|-------------------------------------------|
| `id`       | UUID       | Identificador único del registro de stock |
| `branchId` | UUID       | Identificador de la sucursal              |
| `quantity` | BigDecimal | Cantidad de unidades disponibles          |

### Enumeraciones {id="product-enumerations"}

#### MeasurementUnit {id="product-measurement-unit-enumeration"}

- `UNIT`: Unidad
- `GRAM`: Gramo
- `KILOGRAM`: Kilogramo

#### Currency {id="product-currency-enumeration"}

- `PEN`: Sol peruano

## Reglas de Negocio {id="product-business-rules"}

El modelo de Productos está sujeto a las siguientes reglas de negocio que deben cumplirse en todo momento:

**1. Activación de productos:** Para que un producto pueda ser activado y visible para los clientes, debe cumplir con
los siguientes requisitos:

* Tener asignados los atributos obligatorios: SKU, EAN, nombre, descripción, e imágenes
* Contar con al menos un precio establecido adicional al precio base

**2. Categorización de productos:** Un producto solo puede ser asociado a
una [categoría de nivel hoja (leaf-level)](categories-model-doc.md#leaf-level-category), es
decir, una categoría que no contenga otras categorías.

**3. Desactivación de productos:** Un producto puede ser desactivado en cualquier momento sin restricciones.

**4. Unicidad de identificadores:** Los siguientes identificadores son únicos por producto en todo el sistema:

* SKU
* EAN
* Permalink

**5. Gestión de stock:** El stock de un producto se gestiona a nivel de sucursal:

* El stock total de un producto es la suma de los stocks individuales en cada sucursal
* Cada sucursal mantiene su propio registro de inventario independiente
* Un producto puede tener stock cero en una sucursal y disponibilidad en otras

**6. Estrategia de precios:**

* Todo producto debe tener un precio base definido
* Los precios por sucursal son opcionales pero recomendados
* Los precios por canal de venta son opcionales y se asocian a una sucursal específica
* La jerarquía de precios es: Precio Canal > Precio Sucursal > Precio Base