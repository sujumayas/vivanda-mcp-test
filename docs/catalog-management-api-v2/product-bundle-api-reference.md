# Gestión de Productos Bundles (Packs)

Los bundles permiten agrupar múltiples productos para ser vendidos juntos con precios y configuraciones específicas.

## Buscar componentes de Bundles <format style="superscript" color="Orange">(en desarrollo)</format> {id="find-bundle-components"}

Permite obtener un listado de componentes de productos bundle.

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/bundles" method="GET">
</api-endpoint>

## Crear Bundle de Productos <format style="superscript" color="Orange">(en desarrollo)</format> {id="create-bundle"}

Crea un nuevo producto de tipo bundle para agrupar productos existentes con cantidades y precios específicos.

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/bundles" method="POST">
</api-endpoint>

## Agrega items al Producto Bundle <format style="superscript" color="Orange">(en desarrollo)</format> {id="add-items-bundle-component"}

Agrega una lista de productos específicos a un producto bundle, manteniendo la integridad del bundle.

#### Parámetros {id="params-add-items-bundle-component"}

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/bundles/items" method="PUT">
</api-endpoint>

## Actualiza componente del Bundle <format style="superscript" color="Orange">(en desarrollo)</format> {id="update-items-bundle-component"}

Actualiza un producto específico de un bundle existente, manteniendo la integridad del bundle.

#### Parámetros {id="params-update-items-bundle-component"}

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/bundles/items/{productId}" method="PATCH">
</api-endpoint>


## Eliminar Componente del Bundle <format style="superscript" color="Orange">(en desarrollo)</format> {id="delete-items-bundle-component"}

Elimina un producto específico de un bundle existente, manteniendo la integridad del bundle.

#### Parámetros

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/bundles/items/{productId}" method="DELETE">
</api-endpoint>

## Creación de productos bundle en lote <format style="superscript" color="Orange">(en desarrollo)</format> {id="create-batch-items-bundle-component"}

Lista de productos bundle para creación masiva (máximo 20 productos por lote)

#### Parámetros {id="params-create-batch-items-bundle-component"}

<api-endpoint openapi-path="products-bundle-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/bundles/batch" method="POST">
</api-endpoint>
