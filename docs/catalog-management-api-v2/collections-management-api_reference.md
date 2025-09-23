# Gestión de Colecciones Manuales

## Buscar colecciones por nombre <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-search"}

Devuelve todas las colecciones que tengan un nombre que coincida total o parcialmente con el nombre de la
colección buscada.

### Parámetros de consulta {id="query-params-collection-search"}

| Parámetro            | Descripción                                                                                                | 
|----------------------|------------------------------------------------------------------------------------------------------------|
| `page`,`size`,`sort` | [Paginación](cord-api-reference.md#pagination)                                                             |
| `name`               | El término de búsqueda, se compara con el nombre de la colección, sin distinguir mayúsculas de minúsculas. |
| `status`             | El término de búsqueda, se compara con el estado actual de la colección, ACTIVE o INACTIVE.                |

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections" method="GET">
    <response type="200">
        <description>Colecciones encontradas</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "page": {
                "number": 0,
                "size": 0,
                "totalElements": 0,
                "totalPages": 0,
                "empty": false
              },
              "items": [
                {
                    "id": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                    "name": "collection-name",
                    "description": "collection-description",
                    "image": {
                      "url": "https://image.mail.jokr.pe/lib/fe2f11717181987929223a.png",
                      "altText": "Colección Invierno"
                    },
                    "productsCount": 24,
                    "startDate": "string",
                    "endDate": "string",
                    "seo": {
                        "keywords": "collection-keywords",
                        "metaTitle": "collection-metaTitle",
                        "metaDescription": "collection-metaDescription",
                        "permalink": "collection-permalink"
                    }
                    "status": "ACTIVE"
                }     
              ]
            }
        </sample>
    </response>
</api-endpoint>

## Obtener detalle de una colección <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-details"}

Devuelve los detalles de una colección determinada por su identificador.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/{collectionId}" method="GET">
    <response type="200">
        <description>Colección encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
               "id": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
               "name": "collection-name",
               "description": "collection-description",
               "image": {
                  "url": "https://image.mail.jokr.pe/lib/fe2f11717181987929223a.png",
                  "altText": "Colección Invierno"
               },
               "products": [
                  {
                    "id" : "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                    "productId": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                    "name": "Colección Invierno",
                    "imageUrl": "https://example.com/images/coleccion-invvierno.jpg"
                  }
               ],
               "startDate": "string",
               "endDate": "string",
               "seo": {
                 "keywords": "collection-keywords",
                 "metaTitle": "collection-metaTitle",
                 "metaDescription": "collection-metaDescription",
                 "permalink": "collection-permalink"
               },
               "status": "ACTIVE"
            }
        </sample>
    </response>
   <response type="404">
        <description>Colección no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró la colección",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "properties": {
                    "code": "COLLECTION_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Buscar productos de una colección por filtro <format style="superscript" color="Blue">(Planificado)</format> {id="collection-products-search"}

Devuelve todas las colecciones que tengan un nombre que coincida total o parcialmente con el nombre de la
colección buscada.

### Parámetros de consulta {id="query-params-collection-products-search"}

| Parámetro            | Descripción                                                                                                | 
|----------------------|------------------------------------------------------------------------------------------------------------|
| `page`,`size`,`sort` | [Paginación](cord-api-reference.md#pagination)                                                             |
| `name`               | El término de búsqueda, se compara con el nombre de la colección, sin distinguir mayúsculas de minúsculas. |

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/{collectionId}/products" method="GET">
    <response type="200">
        <description>Colecciones encontradas</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "page": {
                "number": 0,
                "size": 0,
                "totalElements": 0,
                "totalPages": 0,
                "empty": false
              },
              "items": [
                {
                    "id": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                    "productId": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                    "name": "Colección Invierno",
                    "imageUrl": "https://example.com/images/coleccion-invvierno.jpg"
                }
              ]
            }
        </sample>
    </response>
</api-endpoint>

## Creación de colecciones <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-create"}

Crea una nueva colección dentro de una tienda.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
           {
              "name": "Calvin Klein",
              "description": "collection-description",
              "image": {
                  "url": "https://image.mail.jokr.pe/lib/fe2f11717181987929223a.png",
                  "altText": "Colección Invierno"
               },
              "startDate": "string",
              "endDate": "string",
              "seo": {
                "keywords": "collection-keywords",
                "metaTitle": "collection-metaTitle",
                "metaDescription": "collection-metaDescription",
                "permalink": "collection-permalink"
              }
           }
        </sample>
    </request>
    <response type="201">
        <description>Colección creada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
            }
        </sample>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections"
            }
        </sample>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Conflict",
                "status": 409,
                "detail": "El ID ya esta en uso",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections"
                "properties": {
                    "code": "COLLECTION_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Agregar productos a una colección <format style="superscript" color="Gray">(Desplegado en DEV)</format> {id="collection-product-add"}

Permite agregar productos a una colección dada.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/{collectionId}/products" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
              "f47ac10b-58cc-4372-a567-0e02b2c3d479"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Colección actualizada</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
    <response type="404">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontro una marca con el brandId",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
</api-endpoint>

## Remover producto de una colección <format style="superscript" color="Gray">(Planificado)</format> {id="collection-product-remove"}

Permite remover un producto de una colección dada.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/{collectionId}/products/{productId}" method="DELETE">
    <response type="204">
        <description>Producto eliminado de la colección</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
</api-endpoint>

## Actualizar colección <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-update"}

Actualiza una colección existente.

A diferencia de la creación de colección, los identificadores como `id` no pueden modificarse a
través de este endpoint.

### Consideraciones importantes

* **Actualizaciones parciales:** Este endpoint permite actualizaciones parciales. Solo es necesario incluir en el
  request los campos que se desean modificar.
* **Campos no modificables:** Los identificadores principales del producto (`id`) no pueden
  modificarse a través de este endpoint. Si se necesita cambiar estos valores, se debe crear una nueva colección.
* **Validación de datos:** Todos los campos incluidos en el request están sujetos a las mismas validaciones que en la
  creación de colecciones.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/{collectionId}" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "name": "collection-name",
              "description": "collection-description",
              "image": {
                  "url": "https://image.mail.jokr.pe/lib/fe2f11717181987929223a.png",
                  "altText": "Colección Invierno"
               },
              "startDate": "string",
              "endDate": "string",
              "seo": {
                "keywords": "collection-keywords",
                "metaTitle": "collection-metaTitle",
                "metaDescription": "collection-metaDescription",
                "permalink": "collection-permalink"
              }
            }
        </sample>
    </request>
    <response type="204">
        <description>Colección actualizada</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
    <response type="404">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontro una marca con el brandId",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
</api-endpoint>

## Deshabilitar colecciones <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-disabling"}

Deshabilita una lista de colecciones por su ID. La deshabilitación se realiza en cascada.

- **IDEMPOTENTE**: Se puede deshabilitar una coleccion que ya está deshabilitada.
- Si dentro de la lista dada se encuentran colecciones que no existen, estas serán ignoradas, y **no se producirán
  errores**.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/disabled-collections" method="PUT">
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
        <description>Colecciones deshabilitadas</description>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/disabled-collections"
            }
        </sample>
    </response>
</api-endpoint>

## Habilitar colecciones <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="collection-enabling"}

Habilita una lista de colecciones por su ID. La habilitación se realiza en cascada.

- **IDEMPOTENTE**: Se puede habilitar una colección que ya está habilitada.
- Si dentro de la lista dada se encuentran colecciones que no existen, estas serán ignoradas, y **no se producirán
  errores**.

<api-endpoint openapi-path="collection-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/collections/enabled-collections" method="PUT">
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
        <description>Colecciones habilitadas</description>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Bad request",
                "status": 400,
                "detail": "El campo storeId es obligatorio",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/enabled-collections"
            }
        </sample>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Conflict",
                "status": 409,
                "detail": "El id ya está en uso",
                "instance": "/catalog/management/v2/stores/VIVANDA/collections/enabled-collections",
                "properties": {
                    "code": "COLLECTION_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>



