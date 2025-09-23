# Gestión de Crossselling y Upselling

API para la gestión avanzada de catálogo, incluyendo operaciones de crossselling
y upselling para productos. Esta API está diseñada para ser utilizada por
sistemas de administración que necesitan gestionar relaciones entre productos.

Operaciones relacionadas con la gestión de productos de crossselling y upselling.
Permite asociar y eliminar productos relacionados para estrategias de venta cruzada
y venta ascendente, mejorando la experiencia del cliente y aumentando el valor
promedio de las transacciones.

## Asociar productos para cross-selling <format style="superscript" color="Orange">(en desarrollo)</format> {id="add-cross-selling-product"}

#### Parámetros {id="params-add-cross-selling-product"}

<api-endpoint openapi-path="cross-selling-products-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/crossselling" method="PUT">
</api-endpoint>

## Elimina productos para cross-selling <format style="superscript" color="Orange">(en desarrollo)</format> {id="delete-cross-selling-product"}

#### Parámetros {id="params-delete-cross-selling-product"}

<api-endpoint openapi-path="cross-selling-products-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/crossselling/{relatedProductId}" method="DELETE">
</api-endpoint>

## Asociar productos para up-selling <format style="superscript" color="Orange">(en desarrollo)</format> {id="add-up-selling-product"}

#### Parámetros {id="params-add-up-selling-product"}

<api-endpoint openapi-path="cross-selling-products-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/upselling" method="PUT">
</api-endpoint>

## Elimina productos para up-selling <format style="superscript" color="Orange">(en desarrollo)</format> {id="delete-up-selling-product"}

#### Parámetros {id="params-delete-up-selling-product"}

<api-endpoint openapi-path="cross-selling-products-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/upselling/{relatedProductId}" method="DELETE">
</api-endpoint>

## Asociar productos para cross-selling/up-selling en lote <format style="superscript" color="Orange">(en desarrollo)</format> {id="add-batch-cross-selling-product"}

### Consideraciones importantes {id="create-batch-specifications-considerations"}

> **Límite estricto**: Máximo 20 productos a actualizar por operación. Solicitudes con más productos serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen
> detalles de éxitos y fallos.
>
> **Atomicidad por producto**: Cada producto se procesa independientemente. Un fallo no afecta el procesamiento de otros
> productos en el lote.
>
<api-endpoint openapi-path="cross-selling-products-management-catalog-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/product-recommendations/batch" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createBatchCrossselling.json"/>
    </request>
    <response type="200">
        <description>Especificaciones asociada a productos creados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "batch_product-recommendations_creation",
              "totalProcessed": 20,
              "successful": 19,
              "failed": 1,
              "details": [
                {
                  "productId": "ef8f7d43-308b-493c-8fa8-0ca30b0833be",
                  "errors": [
                    {
                      "code": "INVALID_PRODUCT_IDS",
                      "message": "Uno o más productos especificados no existen en el catálogo"
                    }
                  ]
                }
              ]
            }
        </sample>
    </response>
</api-endpoint>