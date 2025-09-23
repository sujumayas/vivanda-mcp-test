# Gestión de Categorías

<card-summary>
Permite crear, consultar, actualizar y eliminar categorías dentro de una tienda.
</card-summary>

Los endpoints de gestión de categorías permiten crear, consultar, actualizar y eliminar categorías dentro de una tienda,
así como gestionar las relaciones jerárquicas entre categorías padre e hijas.

## Buscar categorías <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-search"}

Devuelve todas las categorías que coincidan con los parámetros de búsqueda.

### Parámetros de consulta {id="query-params-category-search"}

| Parámetro            | Descripción                                                                       | 
|----------------------|-----------------------------------------------------------------------------------|
| `page`,`size`,`sort` | [Paginación](cord-api-reference.md#pagination)                                    |
| `name`               | El shortName o fullName de la categoría, sin distinguir mayúsculas de minúsculas. |
| `parentId`           | Identificador UUID de la categoría padre.                                         |
| `parentExternalId`   | Identificador externo de la categoría padre.                                      |
| `level`              | Nivel de la categoría (ROOT, INTERMEDIATE, LEAF).                                 |


<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories" method="GET">
  <response type="200">
    <description>Resultado de búsqueda</description>
    <content-type>application/json</content-type>
    <sample src="findCategoriesResponse.json"/>
  </response>
</api-endpoint>

## Obtener detalle de una categoría <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-details"}

Obtiene los detalles completos de una categoría específica, incluyendo información de la categoría padre e hijas.

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/{categoryId}" method="GET">
    <response type="200">
        <description>Categoría encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="getCategoryDetailsResponse.json" />
    </response>
   <response type="404">
        <description>Categoría no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
</api-endpoint>

## Crear categoría <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-create"}

Permite crear una nueva categoría en la tienda. Opcionalmente puede incluir categorías hijas que se crearán junto con la
categoría padre.

### Consideraciones importantes {id="create-considerations"}

> **Estado inicial**: Todas las categorías se crean en estado `INACTIVE` y no aparecen en el catálogo de búsqueda hasta
> ser activadas.
>
> **Jerarquía**: Las categorías principales se crean en nivel 0 (sin categoría padre). Las categorías `children`
> incluidas en el request se crean automáticamente en nivel 1 como hijas de la categoría principal.
>
> **Activación**: Para que las categorías aparezcan en el servicio de búsqueda, deben ser habilitadas usando
> el [endpoint de habilitar categorías](#category-enabling). La sincronización toma entre 30 y 60 segundos.
>
> **Gestión de jerarquía**: Las relaciones padre-hijo pueden modificarse posteriormente usando
> el [endpoint de gestionar categorías hijas](#category-children-management).

### Campos del request {id="fields-category-create"}

| Campo                                                            | Descripción                                                           |
|------------------------------------------------------------------|-----------------------------------------------------------------------|
| `externalId`<format style="superscript" color="Red">req</format> | Identificador externo único para la categoría                         |
| `shortName`<format style="superscript" color="Red">req</format>  | Nombre corto de la categoría                                          |
| `fullName`<format style="superscript" color="Red">req</format>   | Nombre completo de la categoría                                       |
| `description`                                                    | Descripción detallada de la categoría                                 |
| `deeplinkDescription`                                            | Descripción para enlaces profundos                                    |
| `colorHex`                                                       | Color hexadecimal de la categoría (ej: #3A86FF)                       |
| `imageUrl`                                                       | URL de la imagen representativa                                       |
| `ordinalNumber`                                                  | Número ordinal para ordenamiento                                      |
| `keywords`                                                       | Palabras clave separadas por comas                                    |
| `metaTitle`                                                      | Título meta para SEO                                                  |
| `metaDescription`                                                | Descripción meta para SEO                                             |
| `permalink`                                                      | Enlace permanente (formato: letras, números, guiones y guiones bajos) |
| `children`                                                       | Array de categorías hijas a crear junto con la categoría padre        |

Leyenda: <format style="superscript" color="Red">req = Campo requerido</format>

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json" src="createCategoryRequest.json"/>
    </request>
    <response type="201">
        <description>Categoría creada</description>
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
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="10-19"/>
    </response>
</api-endpoint>

## Actualizar categoría <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-update"}

Actualiza los atributos de una categoría existente. **Todos los campos son opcionales** y solo se actualizarán los
campos proporcionados.

### Campos del request {id="fields-category-update"}

| Campo                          | Descripción                        |
|--------------------------------|------------------------------------|
| `externalId`                   | Identificador externo único        |
| `shortName`                    | Nombre corto de la categoría       |
| `fullName`                     | Nombre completo de la categoría    |
| `description`                  | Descripción detallada              |
| `deeplinkDescription`          | Descripción para enlaces profundos |
| `colorHex`                     | Color hexadecimal                  |
| `imageUrl`                     | URL de la imagen                   |
| `ordinalNumber`                | Número ordinal para ordenamiento   |
| `indexingInfo.permalink`       | SEO-friendly enlace                |
| `indexingInfo.keywords`        | Palabras clave                     |
| `indexingInfo.metaTitle`       | Título meta para SEO               |
| `indexingInfo.metaDescription` | Descripción meta para SEO          |

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/{categoryId}" method="PATCH">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="updateCategoryRequest.json"/>
    </request>
    <response type="204">
        <description>Actualización exitosa (sin contenido)</description>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="2-8"/>
    </response>
    <response type="404">
        <description>Categoría no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="10-19"/>
    </response>
</api-endpoint>

## Configurar atributos de especificación <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-spec-attributes"}

Configura los atributos de especificación para una categoría específica. Estos atributos determinan qué características
pueden tener los productos de la categoría y si son buscables.

### Campos del request {id="fields-spec-attributes"}

| Campo                                                            | Descripción                                              |
|------------------------------------------------------------------|----------------------------------------------------------|
| `attribute`<format style="superscript" color="Red">req</format>  | Tipo de atributo: `COLOR`, `SIZE`, `MATERIAL` o `ORIGIN` |
| `searchable`<format style="superscript" color="Red">req</format> | Si el atributo es buscable (true/false)                  |

Leyenda: <format style="superscript" color="Red">req = Campo requerido</format>

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/{categoryId}/spec-attributes" method="PUT">
    <request>
        <description>Atributos a configurar</description>
        <content-type>application/json</content-type>
        <sample lang="JSON">
            [
              {
                "attribute": "COLOR",
                "searchable": true
              },
              {
                "attribute": "SIZE", 
                "searchable": false
              }
            ]
        </sample>
    </request>
    <response type="201">
        <description>Atributos configurados exitosamente</description>
    </response>
    <response type="400">
        <description>Error de validación</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="41-47"/>
    </response>
    <response type="404">
        <description>Categoría no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
</api-endpoint>

## Gestionar categorías hijas <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-children-management"}

Permite agregar o quitar categorías hijas de una categoría padre específica.

### Campos del request {id="fields-category-children"}

| Campo                                                         | Descripción                                            |
|---------------------------------------------------------------|--------------------------------------------------------|
| `action`<format style="superscript" color="Red">req</format>  | Acción a realizar: `add` (agregar) o `remove` (quitar) |
| `childId`<format style="superscript" color="Red">req</format> | ID de la categoría hija                                |

Leyenda: <format style="superscript" color="Red">req = Campo requerido</format>

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/{categoryId}/children" method="PATCH">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "action": "add",
              "childId": "0895aea3-76d4-4c22-b0a1-785e61355a87"
            }
        </sample>
    </request>
    <response type="204">
        <description>Categoría hija agregada</description>
    </response>
    <response type="404">
        <description>Categoría no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="21-30"/>
    </response>
</api-endpoint>

## Deshabilitar categorías <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-disabling"}

Deshabilita múltiples categorías proporcionando una lista de sus IDs. Las categorías deshabilitadas **no aparecerán en
las búsquedas públicas**.

### Consideraciones importantes {id="disable-considerations"}

> **Propagación en cascada**: Al deshabilitar una categoría padre, todas sus categorías hijas y descendientes también se
> deshabilitan automáticamente.
>
> **Operación idempotente**: Si una categoría ya está `INACTIVE`, la operación no genera error. IDs de categorías
> inexistentes son ignorados silenciosamente.
>
> **Indexación**: Las categorías deshabilitadas se retiran inmediatamente del índice de búsqueda y dejan de estar
> disponibles para consultas públicas.

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/disabled-categories" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              "0895aea3-76d4-4c22-b0a1-785e61355a87",
              "1a23b456-78c9-4def-9012-345678901234"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Categorías deshabilitadas</description>
    </response>
</api-endpoint>

## Habilitar categorías <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-enabling"}

Habilita múltiples categorías proporcionando una lista de sus IDs. Las categorías habilitadas **volverán a aparecer en
las búsquedas públicas.**

### Consideraciones importantes {id="enable-considerations"}

> **Propagación en cascada**: Al habilitar una categoría padre, todas sus categorías hijas y descendientes también se
> habilitan automáticamente.
>
> **Operación idempotente**: Si una categoría ya está `ACTIVE`, la operación no genera error. IDs de categorías
> inexistentes son ignorados silenciosamente.
>
> **Indexación**: Las categorías habilitadas se agregan inmediatamente al índice de búsqueda y quedan disponibles para
> consultas públicas.
>
> **Validación de condiciones**: Para habilitar categorías, deben cumplir ciertas condiciones de negocio. Si alguna
> categoría de la lista no las cumple, **toda la operación se rechaza** y ninguna categoría se habilita.
>
> **Operación atómica**: La habilitación es una operación todo-o-nada. Todas las categorías se habilitan exitosamente o
> ninguna se modifica.

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/enabled-categories" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
              "0895aea3-76d4-4c22-b0a1-785e61355a87",
              "1a23b456-78c9-4def-9012-345678901234"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Categorías habilitadas</description>
    </response>
</api-endpoint>

## Eliminar una categoría <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-deletion"}

Elimina una categoría específica por su ID **junto con toda su jerarquía de subcategorías**.

### Consideraciones importantes {id="delete-considerations"}

> **⚠️ Operación irreversible**: Esta acción no se puede deshacer. Una vez eliminada, la categoría y sus subcategorías
> no pueden recuperarse.
>
> **Propagación en cascada**: Al eliminar una categoría padre, todas sus categorías hijas y descendientes también se
> eliminan automáticamente.
>
> **Restricciones de eliminación**: No es posible eliminar una categoría si tiene productos asociados directamente o si
> alguna de sus subcategorías tiene productos asociados. En estos casos se retorna un error `409 Conflict`.
>
> **Validación completa**: Antes de la eliminación, se verifica toda la jerarquía de subcategorías para asegurar que
> ninguna tenga productos asociados.

<api-endpoint openapi-path="categories-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/categories/{categoryId}" method="DELETE">
    <response type="409">
        <description>Conflicto</description>
        <content-type>application/json</content-type>
        <sample lang="json" src="categoriesErrorResponsesSamples.json" include-lines="31-40"/>
    </response>
</api-endpoint>

## Errores {id="errors"}

Los endpoints de gestión de categorías devuelven errores HTTP estándar con información adicional en el objeto
`ErrorResponse`. La mayoría de errores (excepto `400 Bad Request`) incluyen un código específico en `properties.code`
para identificar el problema exacto.

### Códigos de error {id="error-codes"}

| Código HTTP | Códigos específicos (`properties.code`) | Descripción                                |
|-------------|-----------------------------------------|--------------------------------------------|
| `400`       | _No aplica_                             | Error de validación en los datos enviados  |
| `404`       | `CATEGORY_NOT_FOUND`                    | Categoría o tienda no encontrada           |
| `409`       | `CATEGORY_PERMALINK_ALREADY_USED`       | El permalink ha sido tomado                |
| `409`       | `CATEGORY_PATCH_ACTION`                 | La acción para actualizar no es reconocida |
| `422`       | `CATEGORY_HAS_ASSOCIATED_PRODUCTS`      | La categoría tiene productos asociados     |