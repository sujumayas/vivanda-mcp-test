# Gestión de Stock

Operaciones relacionadas con la gestión de reservas de stock por sucursal. Permite registrar reservas temporales de 
productos para garantizar la disponibilidad durante procesos de venta, así como liberar dichas reservas cuando ya no 
son necesarias.

## Configurar inventario de producto <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="set-product-stock"}

### Consideraciones importantes {id="set-product-stock-considerations"}

> **Reemplazo completo**: La operación reemplaza completamente el inventario existente para las sucursales
> especificadas.
>
> **Inventario por sucursal**: Cada entrada especifica el inventario para una sucursal específica.
>
> **Valores decimales**: El inventario soporta cantidades decimales según la unidad de medida del producto.

<api-endpoint openapi-path="products-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/products/{productId}/stock" method="PUT">
  <request>
    <content-type>application/json</content-type>
    <sample lang="json">
        [
          {
            "branchId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "stock": 150.00
          },
          {
            "branchId": "4gb96g75-6828-5673-c4gd-3d074g77bgb7",
            "stock": 75.50
          }
        ]
    </sample>
  </request>
  <response type="204">
    <description>Inventario actualizado exitosamente</description>
  </response>
  <response type="404">
    <description>Producto no encontrado</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="productsErrorResponsesSamples.json" include-lines="21-30"/>
  </response>
</api-endpoint>

## Solicitud de reserva de stock <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="request-stock-reserves"}

Registra nuevas reservas de stock para múltiples productos en diferentes sucursales.

<api-endpoint openapi-path="inventory-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/inventory/stock-reserves" method="PUT">
</api-endpoint>

## Libera reserva de stock <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="delete-stock-reserves"}

Libera reservas de stock existentes para múltiples productos y sucursales. Permite liberar
reservas completas o parciales, devolviendo las unidades al stock disponible.

<api-endpoint openapi-path="inventory-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/inventory/stock-reserves" method="DELETE">
</api-endpoint>

## Configuración de inventario de productos en lote <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="creation-batch-stock-product"}

### Consideraciones importantes {id="create-batch-stock-product-considerations"}

> **Límite estricto**: Máximo 20 productos a actualizar por operación. Solicitudes con más productos serán rechazadas.
>
> **Operación parcial**: Si algunos productos fallan, la operación continúa procesando el resto. Los resultados incluyen
> detalles de éxitos y fallos.
>
> **Atomicidad por producto**: Cada producto se procesa independientemente. Un fallo no afecta el procesamiento de otros
> productos en el lote.

<api-endpoint openapi-path="inventory-management-v2.yaml" endpoint="/catalog/management/v2/stores/{storeId}/stock/batch" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="updateBatchStock.json"/>
    </request>
    <response type="200">
        <description>Productos con stock actualizados</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "operation": "batch_stock_update",
              "totalProcessed": 20,
              "successful": 19,
              "failed": 1,
              "details": [
                {
                  "productId": "bd4bb75d-1234-56cd-78ef-901234567890"
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


