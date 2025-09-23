---
lang: es
---

# Gestión de Productos

<card-summary>
Permite administrar el catálogo completo de una tienda, incluyendo información básica de productos, especificaciones
técnicas, precios por sucursal e inventario
</card-summary>

Permite administrar el catálogo completo de una tienda, incluyendo información básica de productos, especificaciones
técnicas, precios por sucursal e inventario. Esta API está diseñada para ser utilizada por sistemas de backoffice y
proporciona operaciones CRUD completas junto con funcionalidades avanzadas como gestión de precios por volumen,
operaciones en lote y control granular del estado de productos.

## Buscar productos <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-search"}

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products" method="GET">
  <response type="200">
    <sample lang="JSON" src="findProductsResponse.json"></sample>
  </response>
</api-endpoint>

### Estructura de respuesta {id="search-products-response"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductResponse" depth="3" display-links-if-available="true"/>

## Creación de producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-create"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductCreateRequest" depth="3" display-links-if-available="true"/>

### Consideraciones importantes {id="product-creation-considerations"}

> **Estado inicial**: Los productos aparecen en el catálogo público una vez habilitados. Pueden crearse en estado
> ACTIVE o INACTIVE. Aplican las misma reglas de activación que posee el endpoint de habilitación de productos. 
>
> **Categoría y especificaciones**: La categoría asignada determina qué especificaciones técnicas podrán configurarse
> posteriormente para el producto.
>
> **Códigos únicos**: Los campos `externalId`, `sku`, `ean` y `seo.permalink` deben ser únicos dentro de la tienda.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createProductRequest.json" include-lines="2-50"/>
    </request>
    <response type="201">
        <description>Producto creado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "f87fe042-0ce1-4ec2-ae93-9af8d91ad80a"
            }
        </sample>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="10-19"/>
    </response>
</api-endpoint>

## Creación de productos en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-batch-create"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductBatchCreateRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="batch-create-products-considerations"}

> **Límite estricto**: Máximo 20 productos por operación. Solicitudes con más productos serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen
> detalles de éxitos y fallos.
>
> **Atomicidad por producto**: Cada producto se procesa independientemente. Un fallo no afecta el procesamiento de otros
> productos en el lote.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/batch" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createProductRequest.json"/>
    </request>
    <response type="201">
        <description>Productos creados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "batch_creation",
              "totalProcessed": 20,
              "successful": 18,
              "failed": 2,
              "details": [
                {
                  "code": "DUPLICATE_ENTITY",
                  "message": "Item with ID 'Product-005' already exists"
                }
              ]
            }
        </sample>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
</api-endpoint>

## Actualización de productos en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-batch-update"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductBatchUpdateRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="batch-updatete-products-considerations"}

> **Límite estricto**: Máximo 20 productos por operación. Solicitudes con más productos serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen
> detalles de éxitos y fallos.
>
> **Atomicidad por producto**: Cada producto se procesa independientemente. Un fallo no afecta el procesamiento de otros
> productos en el lote.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/batch" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              {
                "id": "f47ac10b-",
                "name": "Chocolate Hershey's",
                "description": "Barra de chocolate con menta Hershey's de 100gr",
                "images": [
                    {
                    "id": "31505654-e6b6-487e-9901-26ee3cb44be2",
                    "url": "https://example.com/images/hersheys-chocolate2.jpg",
                    "altText": "Chocolates Hershey's",
                    "order": "2"
                    },
                    {
                    "id": "3ec0831c-ace8-417b-b3ab-b41501ec7757",
                    "url": "https://example.com/images/hersheys-chocolate.jpg",
                    "altText": "Chocolates Hershey's",
                    "order": "1"
                    }
                ],
                "brand": {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "name": "Hershey"
                },
                "category": {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "externalId": "CANDIES"
                },
                "showWithoutStock": true,
                "seo": {
                    "keywords": "chocolate, chocolate con menta, hershey's",
                    "permalink": "chocolate-menta-hersheys-100gr",
                    "metaTitle": "Chocolate con Menta Hershey's 100gr",
                    "metaDescription": "Barra de chocolate con menta Hershey's de 100gr",
                    "deepLinkDescription": null
                },
                "basePrice": {
                    "amount": 8.5,
                    "currency": "PEN"
                },
                "stockManagement": {
                    "unit": "UNIT",
                    "quantity": 100
                },
                "nutritionalWarnings": [
                    "HIGH_IN_SUGAR"
                ],
                "dimensions": {
                    "heightInCm": 1.5,
                    "widthInCm": 8,
                    "lengthInCm": 15.5,
                    "weightInGrams": 102
                },
                "releaseDate": "2026-01-01T00:00:00",
                "score": 10
                }
            ]
        </sample>
    </request>
    <response type="201">
        <description>Productos creados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "batch_creation",
              "totalProcessed": 20,
              "successful": 19,
              "failed": 1,
              "details": [
                {
                  "code": "PRODUCT_ID_CONFLICT",
                  "message": "Product id must not be null or empty."
                }
              ]
            }
        </sample>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
</api-endpoint>

## Obtener detalle de un producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-details"}

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}" method="GET">
  <response type="200">
    <description>Producto encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="JSON" src="getProductDetailsResponse.json"/>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
</api-endpoint>


<api-schema openapi-path="products-management-schemas.yaml" name="ProductDetailsResponse" display-links-if-available="true"/>

## Actualizar producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-update"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductUpdateRequest" depth="3" display-links-if-available="true"/>

### Consideraciones importantes {id="update-product-considerations"}

> **Actualización parcial**: Solo se modifican los campos enviados en la solicitud. Los campos omitidos mantienen sus
> valores actuales.
>
> **Cambio de categoría**: Modificar la categoría puede afectar las especificaciones válidas para el producto.
>
> **Campos inmutables**: Los campos `externalId`, `sku` y `ean` no pueden modificarse después de la creación.
>
> **Validación de datos:** Todos los campos incluidos en el request están sujetos a las mismas validaciones que en la
> creación de productos.
>
> **Reemplazo de colecciones:** Al actualizar colecciones como `images` o `nutritionalWarnings`, el conjunto
> proporcionado reemplazará completamente al conjunto existente. Si se desea mantener elementos existentes, estos **no
deben
incluirse en la solicitud**.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}" method="PATCH">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="updateProductRequest.json"/>
    </request>
    <response type="204">
        <description>Producto actualizado</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
    <response type="404">
      <description>Producto no encontrado</description>
      <content-type>application/json</content-type>
      <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="10-19"/>
    </response>
</api-endpoint>

## Eliminar Producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="delete-product"}

### Consideraciones importantes {id="delete-product-considerations"}

> **⚠️ Operación irreversible**: La eliminación es permanente y no puede deshacerse. Toda la información del producto,
> incluyendo especificaciones, precios e inventario, se elimina definitivamente.
>
> **Propagación inmediata**: El producto se retira inmediatamente del catálogo y deja de estar disponible en todas las
> APIs.
>
> **Alternativa recomendada**: Para ocultar temporalmente un producto, considera usar
> la [deshabilitación](#product-disabling) en lugar de eliminación.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}" method="DELETE">
  <response type="204">
    <description>Producto eliminado exitosamente</description>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
</api-endpoint>

## Deshabilitar productos <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-disabling"}

### Consideraciones importantes {id="product-disabling-considerations"}

> **Propagación**: Los productos deshabilitados dejan de aparecer en el catálogo de búsqueda en un período de 30 a 60
> segundos.
>
> **Reversible**: Los productos pueden ser rehabilitados posteriormente usando el endpoint
> de [habilitación](#product-enabling).
>
> **Operación idempotente**: Deshabilitar un producto ya inactivo no genera error. IDs de productos inexistentes son
> ignorados silenciosamente.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/disabled-products" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "00b5-f1f5-4b73-8da4-02936f25f9b0"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Productos deshabilitados</description>
    </response>
</api-endpoint>

## Habilitar productos <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-enabling"}

### Consideraciones {id="product-enabling-considerations"}

> **Validaciones**: Solo pueden habilitarse productos que cumplan con las siguientes **condiciones de activación:**
> - Categoría activa.
> - Marca activa.
> - Al menos una imagen.
> - Precio base establecido.
>
> **Propagación**: Los productos habilitados aparecen en el catálogo de búsqueda en un período de 30 a 60 segundos.
>
> **Operación idempotente**: Habilitar un producto ya activo no genera error. IDs de productos inexistentes son
> ignorados silenciosamente.
>
> **Operación atómica**: La habilitación es una operación todo-o-nada. Todas los productos se habilitan exitosamente o
> ninguno se modifica.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/enabled-products" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "00b5-f1f5-4b73-8da4-02936f25f9b0"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Productos habilitados</description>
    </response>
    <response type="422">
        <description>Solicitud no procesable</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="32-41"/>
    </response>
</api-endpoint>

## Configurar especificaciones de producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="set-product-specifications"}

> **Validación por categoría**: Solo se pueden configurar especificaciones válidas para la categoría del producto.
>
> **Reemplazo completo**: La operación reemplaza todas las especificaciones existentes del producto.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/specifications" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              {
                "attribute": "COLOR",
                "value": "Azul"
              },
              {
                "attribute": "SIZE",
                "value": "M"
              },
              {
                "attribute": "MATERIAL",
                "value": "Algodón 100%"
              }
            ]
        </sample>
    </request>
    <response type="204">
        <description>Precios agregados correctamente</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <decription>Error de validación</decription>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="43-49"/>
    </response>
    <response type="404">
        <description>Producto no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
    <response type="422">
        <description>Solicitud no procesable</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="51-60"/>
    </response>
</api-endpoint>

## Eliminar especificaciones de producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-specifications-deletion"}

### Consideraciones importantes {id="delete-specifications-considerations"}

> **Eliminación completa**: Se eliminan todas las especificaciones del producto.
>
> **Operación idempotente**: Eliminar especificaciones de un producto sin especificaciones no genera error.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/specifications" method="DELETE">
    <response type="204">
        <description>Precios agregados correctamente</description>
        <content-type>application/json</content-type>
    </response>
    <response type="404">
        <description>Producto no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
</api-endpoint>

## Creación de especificaciones en lote <format style="superscript" color="Orange">(en desarrollo)</format> {id="creation-batch-product-specifications-"}

### Consideraciones importantes {id="create-batch-specifications-considerations"}

> **Límite estricto**: Máximo 20 productos a actualizar por operación. Solicitudes con más productos serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen
> detalles de éxitos y fallos.
>
> **Atomicidad por producto**: Cada producto se procesa independientemente. Un fallo no afecta el procesamiento de otros
> productos en el lote.
>
<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/specifications/batch" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createBatchSpecification.json"/>
    </request>
    <response type="200">
        <description>Especificaciones asociada a productos creados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "batch_specification_creation",
              "totalProcessed": 20,
              "successful": 18,
              "failed": 2,
              "details": [
                {
                  "productId": "ef8f7d43-308b-493c-8fa8-0ca30b0833be",
                  "specificationsProcessed": 2,
                  "errors": [
                    {
                      "code": "ATTRIBUTE_NOT_SUPPORT_BY_CATEGORY",
                      "message": "El atributo no es soportado por la categoría 
                        asociada al producto"
                    }
                  ]
                },
                {
                  "productId": "72531a72-78dc-4f6f-8875-e31445fac0f4",
                  "specificationsProcessed": 0,
                  "errors": [
                    {
                      "code": "PRODUCT_NOT_FOUND",
                      "message": "No se encontró el producto"
                    }
                  ]
                }
              ]
            }
        </sample>
    </response>
</api-endpoint>

## Obtener Precios de Producto<format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-product-prices"}

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/prices" method="GET">
  <response type="200">
    <description>Lista de precios activos del producto</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="getProductActivePrices.json"/>
  </response>
</api-endpoint>

### Estructura de respuesta {id="get-product-prices-response"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductPriceDetailsResponse" display-links-if-available="true"/>

## Establecer precios a un producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-set-prices"}

### Estructura de solicitud {id="set-product-prices-request"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductSetPriceRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="set-product-prices-considerations"}

> **Precio regular único**: Cada sucursal puede tener solo UN precio regular por producto.
>
> **Múltiples precios por volumen**: Cada sucursal puede tener varios precios por volumen con diferentes cantidades.
>
> **Vigencia automática**: Los precios entran en vigor inmediatamente al configurarse.
>
> **Histórico**: Los precios reemplazados se archivan automáticamente y pueden consultarse en el histórico.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/prices" method="POST">
  <request>
    <content-type>application/json</content-type>
    <sample lang="json" src="setProductPricesRequest.json"/>
  </request>
  <response type="204">
    <description>Precios configurados exitosamente</description>
  </response>
  <response type="400">
    <description>Error de validación</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="62-68"/>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
  <response type="409">
    <description>Conflicto</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="70-79"/>
  </response>
</api-endpoint>

## Establecer precios a un producto en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-set-prices-bulk"}

### Estructura de solicitud {id="set-product-prices-bulk-request"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductSetPriceRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="set-product-prices-bulk-considerations"}

> **Límite estricto**: Máximo 20 agrupaciones de precios por producto por operación. Solicitudes con más agrupaciones serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen detalles de éxitos y fallos.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/prices/batch" method="POST">
  <request>
    <content-type>application/json</content-type>
    <sample lang="json" src="setProductPricesBatchRequest.json"/>
  </request>
  <response type="204">
    <description>Precios configurados exitosamente</description>
  </response>
  <response type="400">
    <description>Error de validación</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="62-68"/>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
  <response type="409">
    <description>Conflicto</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="70-79"/>
  </response>
</api-endpoint>

## Remover el precio de un producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-remove-price"}

### Consideraciones importantes {id="remove-product-price-considerations"}

> **Archivado automático**: El precio deshabilitado se mueve al histórico y puede consultarse posteriormente, desde
> el [histórico de precios](#get-product-prices-history)
>
> **Sin eliminación**: Los precios no se eliminan permanentemente, solo se deshabilitan.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/prices/{priceId}" method="DELETE">
    <response type="204">
        <description>Precio eliminado correctamente</description>
    </response>
    <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
</api-endpoint>

## Obtener histórico de precios <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-product-prices-history"}

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/prices/history" method="GET">
  <response type="200">
    <description>Histórico paginado de precios del producto</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="getPriceHistoryResponse.json"/>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
</api-endpoint>

## Establecer descuento de precio a un producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-set-promo-price"}

### Estructura de solicitud {id="set-product-promo-prices-request"}

<api-schema openapi-path="products-management-schemas.yaml" name="ProductDiscountPriceRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="set-product-promo-prices-considerations"}

> **Precio Promocional**: El precio promocional se calculara en base al precio regular.
> 
> **Precio Promocional Final**: El precio promocional final no debe superar el 30% del precio del producto.
> 
> **branchId**: El branch id no es validado con relacion a su existencia o si pertenece a la tienda.
> 
> **Fecha de Expiracion**: La fecha de expiracion debera ser a futuro ya que la misma sera validada.
>
> **Vigencia automática**: La vigencia de los precios promocionales estara dada por la fecha de expiracion.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/discount" method="POST">
  <request>
    <content-type>application/json</content-type>
    <sample lang="json" src="setProductDiscountPriceRequest.json"/>
  </request>
  <response type="204">
    <description>Precios configurados exitosamente</description>
  </response>
  <response type="400">
    <description>Error de validación</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="81-88"/>
  </response>
  <response type="404">
    <description>Precio regular no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="90-99"/>
  </response>
  <response type="409">
    <description>Conflicto</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="101-110"/>
  </response>
</api-endpoint>

## Remover el descuento de precio de un producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-remove-discount-price"}

### Consideraciones importantes {id="remove-product-discount-price-considerations"}

> **Eliminación**: Al eliminar un descuento de precio de un producto, el precio final sera igual al precio regular.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/discount/{discountPriceId}" method="DELETE">
    <response type="204">
        <description>Precio eliminado correctamente</description>
    </response>
    <response type="404">
    <description>Discount price no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="112-121"/>
  </response>
</api-endpoint>

## Errores

| Código HTTP | Códigos específicos (`properties.code`) | Descripción                                                       |
|-------------|-----------------------------------------|-------------------------------------------------------------------|
| `400`       | _No aplica_                             | Error de validación en los datos enviados                         |
| `404`       | `PRODUCT_NOT_FOUND`                     | No se encontró el producto                                        |
| `409`       | `PRODUCT_EXTERNAL_ID_ALREADY_USED`      | El identificador externo ha sido tomado                           |
| `409`       | `PRODUCT_SKU_ALREADY_USED`              | El SKU ha sido tomado                                             |
| `409`       | `PRODUCT_PERMALINK_ALREADY_USED`        | El permalink ha sido tomado                                       |
| `409`       | `PRODUCT_UNIQUE_ATTRIBUTE_CONFLICT`     | Ya existe un producto con un identificador similar                |
| `422`       | `PRODUCT_BRAND_NOT_FOUND`               | La marca que se intenta asignar no existe                         |
| `422`       | `PRODUCT_CATEGORY_NOT_FOUND`            | La categoría que se intenta asignar no existe                     |
| `422`       | `PRODUCT_CANNOT_BE_ENABLED`             | El producto no cumple con las condiciones de activación           |
| `422`       | `ATTRIBUTE_NOT_SUPPORT_BY_CATEGORY`     | El atributo no es soportado por la categoría asociada al producto |
| `428`       | `PRODUCT_WITH_NOT_CATEGORY`             | El producto no tiene asociado a una categoria                     |

