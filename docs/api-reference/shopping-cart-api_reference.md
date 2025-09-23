---
lang: es
---

# Carrito de compras

## Crear carrito <format style="superscript" color="DarkOrange">(developing)</format> {id="cart-create"}

### Consideraciones importantes: {id="cart-creation-considerations"}

> **Estado inicial**: todos los carritos nacen en estado `ACTIVE`
>
> **Carrito único**: Solo se permite un carrito por usuario en cada tienda, para usuarios sin un carrito previo se
> creará un nuevo carrito, de lo contrario se retorna el carrito existente
>
> **Actualización de sucursal**: Si se proporciona `branchId` diferente al actual, actualiza la sucursal
>
> **Operación idempotente**: múltiples llamadas con los mismos parámetros producen el mismo resultado
>
> **Comportamiento sin sucursal**: Si no se especifica la sucursal (`branchId`), se utilizará precios base y stock total
> para validaciones

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart" method="POST"></api-endpoint>

## Resumen de carrito <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-cart-summary"}

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/summary" method="GET"/>

### Estructura de respuesta {id="get-cart-response-object"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="CartSummaryResponse" display-links-if-available="true"/>

## Detalle de carrito <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="get-cart-details"}

### Consideraciones importantes {id="get-cart-details-considerations"}

> Los **items** se ordenan por fecha de agregado al carrito (más recientes primero).
>
> Al igual que el resumen, se incluyen las últimas 10 actividades del carrito (automáticas y manuales)

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart" method="GET"/>

### Estructura de respuesta {id="get-cart-details-response-object"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="FullCartResponse" display-links-if-available="true"/>

## Agregar ítem al carrito <format style="superscript" color="Blue">(Desplegado DEV)</format> {id="add-item-to-cart"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="AddItemToCartRequest" display-links-if-available="true"/>

### Consideraciones importantes: {id="add-item-to-cart-considerations"}

> **Validaciones**: La cantidad debe ser un decimal positivo mayor a 0
>
> **Identificador de productos**: Para agregar un producto al carrito se debe especificar o el **`productId`** o el **`sku`**. El campo **`productId`**, tiene prioridad sobre el **`sku`**, en caso en el request se envíen ambos, se dará prioridad al primero.
> 
> **Manejo de productos existentes**: Si el producto ya está en el carrito se suma la nueva cantidad a la existente
>
> **Precios**: Si el carrito tiene `branchId` usa precios de la sucursal, es su defecto usa `basePrice` del producto
>
> **Validación del producto**: Verifica que el producto esté **activo**, caso contrario devolverá error
>
> **Ajuste de stock**: Si el carrito tiene `branchId` validará el stock contra la sucursal específica, en su
> defecto, validará contra `totalStock` del producto. En caso la cantidad supere al **stock disponible**, esta será ajustada a la cantidad máxima atendible.

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/items" method="POST"></api-endpoint>

### Estructura de respuesta {id="add-item-to-card-response-object"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="CartItemResponse" display-links-if-available="true"/>

## Actualizar ítem del carrito <format style="superscript" color="DarkOrange">(developing)</format> {id="update-cart-item"}

### Consideraciones importantes {id="update-cart-item-considerations"}

> **Validaciones realizadas:**
> - La cantidad debe ser un decimal positivo mayor a 0
> - Se valida que el item exista en el carrito del usuario
>
> **Recálculos automáticos:**
> - Se recalculan todos los descuentos aplicables al item
> - Se recalculan los totales del item y del carrito completo
> - Se revalidan los precios según la sucursal actual
>
> **Comportamiento:**
> - En caso no haya stock suficiente, la cantidad se ajusta al stock disponible **`availableStock`**.
> - La operación es atómica (todo o nada)
> - Se genera actividad tipo `ITEM_UPDATED` en el historial
> - Se actualiza el timestamp `lastModifiedAt` del carrito

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/items/{itemId}" method="PUT"/>

### Estructura de respuesta {id="update-cart-item-response-object"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="CartItemResponse" display-links-if-available="true"/>

## Agregar productos al carrito en lote <format style="superscript" color="Yellow">(proposed)</format> {id="add-items-to-cart-in-batch"}

<api-schema openapi-path="shopping-cart-schemas.yaml" name="AddItemsToCartInBulkRequest" display-links-if-available="true"/>

### Consideraciones importantes: {id="add-items-to-cart-in-batch-considerations"}

> **Validaciones**: Para cada ítem se aplican las mismas validaciones que la [agregación individual](#add-item-to-cart)
> 
> **Falla silenciosamente**: En caso haya error con algunos ítems, estos fallarán en silencio. Para conocer cuáles ítems fueron agregados exitosamente, consulte el [detalle del carrito](#get-cart-details)

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/items/bulk" method="POST"/>

## Remover ítem del carrito <format style="superscript" color="DarkOrange">(developing)</format> {id="remove-cart-item"}

### Consideraciones importantes: {id="remove-cart-item-considerations"}

> Esta operación es **irreversible** y actualiza **automáticamente los totales del carrito**.

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/items/{itemId}" method="DELETE"/>

## Vaciar carrito <format style="superscript" color="DarkOrange">(developing)</format> {id="empty-cart"}

### Consideraciones importantes {id="empty-cart-considerations"}

> **Irreversible:** Esta operación es irreversible y genera una actividad automática en el historial.
>
> El carrito permanece activo pero vacío después de la operación.

<api-endpoint openapi-path="shopping-cart-v2.yaml" endpoint="/shopping-cart/v2/cart/items" method="DELETE"/>