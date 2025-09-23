---
lang: es
---

# Search Product

<card-summary>
    Búsqueda y recuperación de información de catálogo, incluyendo productos, 
    categorías y colecciones. Diseñada para ser utilizada por aplicaciones 
    cliente que necesitan acceder a la información del catálogo.
</card-summary>

Facilita la búsqueda y recuperación de información de catálogo, incluyendo productos,
categorías, marcas y colecciones. Está diseñada para ser utilizada por aplicaciones
cliente que necesitan acceder a la información del catálogo.

## Buscar categorías <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="category-search"}

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/categories" method="GET"/>

### Estructura de respuesta {id="category-search-response"}

<api-schema openapi-path="search-schemas.yaml" name="CategoryResponse" display-links-if-available="true"/>

## Detalle de categoría <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-category-details"}

Es posible obtener detalles de una categoría determinada por su identificador, su permalink o su identificador externo.

<tabs>
    <tab title="Por ID" id="get-category-details-by-id">
        <api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/categories/{categoryId}" method="GET"/>
    </tab>
    <tab title="Por external ID" id="get-category-details-by-external-id">
        <api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/categories/ext/{externalId}" method="GET"/>
    </tab>
    <tab title="Por permalink" id="get-category-details-by-permalink">
        <api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/categories/p" method="GET"/>
    </tab>
</tabs>

### Estructura de respuesta {id="category-details-response"}

<api-schema openapi-path="search-schemas.yaml" name="CategoryDetailsResponse" display-links-if-available="true"/>

## Buscar productos <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-search"}

### Consideraciones {id="product-search-considerations"}

> Para el caso de la búsqueda por categoría, por **`categoryIds`** o **`categoryExternalIds`**. Si se especifican ambos,
> se priorizarán las categorías especificadas por **`categoryIds`**.
>
> En caso la categoría especificada tenga hijos, se devolverán todas las subcategorías de esa categoría. Es decir, si se
> especifica una categoría de nivel 1, se incluirá el resultado para todas las categorías debajo de dicha categoría,
> hasta
> alcanzar el nivel hoja.
>
> Cuando se especifica una sucursal (**`branchId`**), la respuesta incluirá información específica del precio y el stock
> del producto para esa sucursal mediante el campo **`pricing`** y **`stock.branch`** respectivamente. 
> Si no se especifica la sucursal, el campo **`pricing`** se obtendrá mediante su precio base.
>
> Las especificaciones dinámicas de productos permiten filtrar por atributos que varían según la naturaleza del
> producto, como talla, color, material, etc.
>
> Cuando se utilizan múltiples especificaciones (**`specs[*]`**), se aplica una lógica **`AND`** entre ellas (todos los
> criterios deben cumplirse).
>
> Cuando se utiliza el operador [in] para una especificación, se aplica una lógica **`OR`** entre los valores (
> cualquiera de los valores indicados es válido).

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/products" method="GET" />

### Estructura de respuesta {id="product-search-response"}

<api-schema openapi-path="search-schemas.yaml" name="ProductSearchResponse" display-links-if-available="true"/>


### Ejemplos de uso {id="product-search-examples"}

<table>
    <tr>
        <td>Escenario</td>
        <td>URL de Ejemplo</td>
        <td>Descripción</td>
    </tr>
    <tr>
        <td>Búsqueda básica</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?page=1&amp;size=20</code>
        </td>
        <td>Obtiene los primeros 20 productos</td>
    </tr>
    <tr>
        <td>Búsqueda por texto</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?q=galleta</code>
        </td>
        <td>Busca productos que contengan "galleta"</td>
    </tr>
    <tr>
        <td>Filtro por precio</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?minPrice=50&amp;maxPrice=200</code>
        </td>
        <td>Productos entre 50 y 200</td>
    </tr>
    <tr>
        <td>Filtro por categoría</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?categoryIds=uuid-123</code>
        </td>
        <td>Productos de una categoría específica</td>
    </tr>
    <tr>
        <td>Filtro por marcas</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?brandIds=uuid-123,uuid-456</code>
        </td>
        <td>Productos de una categoría específica</td>
    </tr>
    <tr>
        <td>Ordenamiento alfabético</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?sort=name_asc</code>
        </td>
        <td>Productos ordenados por nombre en sentido ascendente</td>
    </tr>
    <tr>
        <td>Ordenamiento por precio</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?sort=price_desc</code>
        </td>
        <td>Productos ordenados por precio en sentido descendente</td>
    </tr>
    <tr>
        <td>Ordenamiento por Score</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?sort=score_desc</code>
        </td>
        <td>Productos ordenados por score en sentido descendente</td>
    </tr>
    <tr>
        <td>Ordenamiento por Release Date</td>
        <td>
            <code>GET /catalog/v2/stores/12345/products?sort=releaseDate_desc</code>
        </td>
        <td>Productos ordenados por fecha de lanzamiento más reciente</td>
    </tr>
    
</table>


## Detalle de producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="product-details"}

Es posible obtener detalles de un producto determinado por su identificador o por su permalink.

<tabs>
<tab title="Por ID" id="product-details-by-id">
<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/products/{productId}" method="GET"/>
</tab>
<tab title="Por permalink" id="product-details-by-permalink">
<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/products/p/{permalink}" method="GET"/>
</tab>
</tabs>

### Estructura de respuesta {id="product-details-response"}

<api-schema openapi-path="search-schemas.yaml" name="ProductDetailsResponse" display-links-if-available="true"/>

## Buscar colecciones <format style="superscript" color="Orange">(Desplegado DEV)</format> {id="get-collections-searches"}

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/collections" method="GET">
</api-endpoint>

## Obtener colección por permalink <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-collection-by-permalink"}

### Consideraciones importantes

> Para listar los productos dentro de una colección
> se debe incluir el ID de la colección como parámetro de
> búsqueda en el endpoint de [búsqueda de productos](#product-search)

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/collections/p/{permalink}" method="GET">
</api-endpoint>

<api-schema openapi-path="search-schemas.yaml" name="CollectionResponse"/>

## Obtener términos de búsqueda más populares. <format style="superscript" color="Orange">(Desplegado DEV)</format> {id="get-trending-search-terms"}

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/trending-search" method="GET">
</api-endpoint>


## Obtener búsquedas sugeridas relacionadas. <format style="superscript" color="Orange">(Desplegado DEV)</format> {id="get-suggested-searches"}

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{storeId}/products/autocomplete/suggested-searches" method="GET">
</api-endpoint>

## Buscar marcas. <format style="superscript" color="Orange">(Desplegado DEV)</format> {id="get-brands-searches"}

<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores/{stroreId}/brands" method="GET">
</api-endpoint>

## Obtener marca por permalik. <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-brand-by-permalink"}
<api-endpoint openapi-path="search-v2.yaml" endpoint="/catalog/v2/stores{storeId}/brands/p/{permalink}" method="GET">
</api-endpoint>