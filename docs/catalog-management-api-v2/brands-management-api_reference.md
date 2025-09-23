# Gestión de Marcas

## Buscar marcas por nombre <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-search"}

Devuelve todas las marcas que tengan un nombre que coincida total o parcialmente con el nombre de la
marca buscada.

### Parámetros de consulta {id="query-params-brand-search"}

| Parámetro            | Descripción                                                                                                     | 
|----------------------|-----------------------------------------------------------------------------------------------------------------|
| `page`,`size`,`sort` | [Paginación](cord-api-reference.md#pagination)                                                                      |
| `name`               | El término de búsqueda, se compara con el nombre de la marca, sin distinguir mayúsculas de minúsculas.          |
| `keywords`           | El término de búsqueda, se compara con las palabras clave de la marca, sin distinguir mayúsculas de minúsculas. |
| `status`             | El término de búsqueda, se compara con el estado actual de la marca, ACTIVE o INACTIVE.                         |

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands" method="GET">
    <response type="200">
        <description>Marcas encontradas</description>
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
                    "name": "brand-name",
                    "score": "brand-score",
                    "keywords": "brand-keywords",
                    "metaDescription": "brand-metaDescription",
                    "metaTitle": "brand-metaTitle",
                    "permalink": "brand-permalink",
                    "status": "ACTIVE"
                }
              ]
            }
        </sample>
    </response>
</api-endpoint>

## Obtener detalle de una marca <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-details"}

Devuelve los detalles de una marca determinada por su identificador.

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/{brandId}" method="GET">
    <response type="200">
        <description>Marca encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "ab5c6d7e-8f9g-0h1i-2j3k-4l5m6n7o8p9q",
                "name": "brand-name",
                "score": "brand-score",
                "keywords": "brand-keywords",
                "metaDescription": "brand-metaDescription",
                "metaTitle": "brand-metaTitle",
                "permalink": "brand-permalink",
                "status": "ACTIVE"
            }
        </sample>
    </response>
   <response type="404">
        <description>Marca no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró la marca",
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "properties": {
                    "code": "BRAND_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Creación de marcas <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-create"}

Crea una nueva marca dentro de una tienda.

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
           {
              "name": "brand-name",
              "score": "brand-score",
              "keywords": "brand-keywords",
              "metaDescription": "brand-metaDescription",
              "metaTitle": "brand-metaTitle",
              "permalink": "brand-permalink"
           }
        </sample>
    </request>
    <response type="201">
        <description>Marca creada</description>
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands"
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands"
                "properties": {
                    "code": "BRAND_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Creación de marcas en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-batch-create"}

Permite la creación simultánea de múltiples marcas en una sola operación.

### Request: BrandBatchCreateRequest

| Tipo  | Restricciones   | Descripción                                   |
|-------|-----------------|-----------------------------------------------|
| Array | Min: 1, Max: 20 | Lista de marcas a crear en una sola operación |

> Cada elemento del array debe seguir la misma estructura y reglas definidas para
> la [creación individual de productos](#brand-create)
> {style="note"}

### Consideraciones importantes {id="brand-batch-create-considerations"}

> **Límite estricto**: Máximo 20 marcas a crear por operación.
>
> **Información Util**: El permalink sera creado a partir del nombre de la marca siguiendo los patrones especificados a continuación.
> especificados a continuación.
> 
> - La letra ñ o Ñ sera reemplazada por ni o Ni respectivamente.
> - Los demas caracteres especiales como tilde o Ä seran reemplazados por los mismos sin caracteres especiales.
> - El ampersand (&) y el guion bajo (_) seran reemplazados por espacios en blanco.
> - Los espacios en blanco seran reemplazados por guiones medio (-).
> - Todo el permalink resultante de la aplicacion de las reglas antes mencionadas seran traducidos a minuscula.
> 
<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/batch" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              {
                  "name": "brand-name",
                  "score": "brand-score",
                  "keywords": "brand-keywords",
                  "metaDescription": "brand-metaDescription",
                  "metaTitle": "brand-metaTitle"
              }
            ]
        </sample>
    </request>
    <response type="201">
        <description>Marcas creados</description>
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
                  "message": "Item with ID 'Brand-005' already exists"
                }
              ]
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
                 "instance": "/catalog/management/v2/stores/storeId/brands/batch"
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
                "instance": "/catalog/management/v2/stores/storeId/brands/batch",
                "properties": {
                    "code": "BRAND_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Actualización de marcas en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-batch-update"}

Permite la actualización simultánea de múltiples marcas en una sola operación.

### Request: BrandBatchUpdateRequest

| Tipo  | Restricciones   | Descripción                                   |
|-------|-----------------|-----------------------------------------------|
| Array | Min: 1, Max: 20 | Lista de marcas a crear en una sola operación |

> Cada elemento del array debe seguir la misma estructura y reglas definidas para
> la [actualización individual de productos](#brand-update) pero agregando el id en cada item
> {style="note"}

### Consideraciones importantes {id="brand-batch-update-considerations"}

> **Límite estricto**: Máximo 20 marcas a crear por operación.
>
<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/batch" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              {
                  "id": "f47ac10b-",
                  "name": "brand-name",
                  "score": "brand-score",
                  "keywords": "brand-keywords",
                  "metaDescription": "brand-metaDescription",
                  "metaTitle": "brand-metaTitle"
              }
            ]
        </sample>
    </request>
    <response type="201">
        <description>Marcas creados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "brands_batch_update",
              "totalProcessed": 20,
              "successful": 18,
              "failed": 1,
              "details": [
                {
                  "code": "BRAND_ID_CONFLICT",
                  "message": "Brand id must not be null or empty."
                }
              ]
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
                 "instance": "/catalog/management/v2/stores/storeId/brands/batch"
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
                "instance": "/catalog/management/v2/stores/storeId/brands/batch",
                "properties": {
                    "code": "BRAND_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Actualizar marca <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-update"}

Actualiza una marca existente.

A diferencia de la creación de marca, los identificadores como `id` no pueden modificarse a
través de este endpoint.

### Consideraciones importantes

* **Actualizaciones parciales:** Este endpoint permite actualizaciones parciales. Solo es necesario incluir en el
  request los campos que se desean modificar.
* **Campos no modificables:** Los identificadores principales del producto (`id`) no pueden
  modificarse a través de este endpoint. Si se necesita cambiar estos valores, se debe crear una nueva marca.
* **Validación de datos:** Todos los campos incluidos en el request están sujetos a las mismas validaciones que en la
  creación de marcas.

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/{brandId}" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "name": "brand-name",
              "score": "brand-score",
              "keywords": "brand-keywords",
              "metaDescription": "brand-metaDescription",
              "metaTitle": "brand-metaTitle",
              "permalink": "brand-permalink"
            }
        </sample>
    </request>
    <response type="204">
        <description>Marca actualizada</description>
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/ab5c6d7e-8f9g-0h1i"
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/ab5c6d7e-8f9g-0h1i"
            }
        </sample>
    </response>
</api-endpoint>

## Deshabilitar marcas <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-disabling"}

Deshabilita una lista de marcas por su ID. La deshabilitación se realiza en cascada.

- **IDEMPOTENTE**: Se puede deshabilitar una marca que ya está deshabilitada.
- Si dentro de la lista dada se encuentran marcas que no existen, estas serán ignoradas, y **no se producirán
  errores**.

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/disabled-brands" method="PUT">
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
        <description>Marcas deshabilitadas</description>
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/disabled-brands"
            }
        </sample>
    </response>
</api-endpoint>

## Habilitar marcas <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="brand-enabling"}

Habilita una lista de marcas por su ID. La habilitación se realiza en cascada.

- **IDEMPOTENTE**: Se puede habilitar una marca que ya está habilitada.
- Si dentro de la lista dada se encuentran marcas que no existen, estas serán ignoradas, y **no se producirán
  errores**.

<api-endpoint openapi-path="brands-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/brands/enabled-brands" method="PUT">
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
        <description>Marcas habilitadas</description>
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/enabled-brands"
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
                "instance": "/catalog/management/v2/stores/VIVANDA/brands/enabled-brands",
                "properties": {
                    "code": "BRAND_STORE_ID_CONFLICT"
                }
            }
        </sample>
    </response>
</api-endpoint>



