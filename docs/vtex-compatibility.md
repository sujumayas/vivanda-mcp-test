# Compatibilidad con VTEX

Esta sección cubre los formatos de compatibilidad disponibles, mapeos de datos y consideraciones técnicas para mantener
la continuidad operacional durante el proceso de migración. Los adaptadores están diseñados para ser funcionalmente
equivalentes a las respuestas originales de VTEX, permitiendo una transición transparente.

## Formato de órdenes {id="orders-format"}

El endpoint de órdenes de CoRD soporta un formato de respuesta compatible con VTEX mediante el parámetro `format=vtex`.
Esto permite que sistemas que actualmente consumen APIs de VTEX puedan conectarse directamente a CoRD sin requerir
cambios en su lógica de procesamiento.

```http
GET /orders/v2/{orderId}?format=vtex
```

El formato adaptado mantiene la estructura, nomenclatura y semántica de los campos de VTEX, mapeando automáticamente los
datos internos de **CoRD** al formato esperado por tus integraciones existentes. A continuación se detalla el mapeo
completo
entre ambos formatos con ejemplos prácticos.

### Formato **CoRD** (Original) {id="orders-payload-cord-format"}

<code-block lang="JSON" src="../json/order-details-response.json" />

### Formato **VTEX** (Adaptado) {id="orders-payload-vtex-format"}

<code-block lang="JSON" src="../json/order-details-vtex-adapted-response.json" />

### Mapeo de datos {id="order-details-data-mapping"}

#### Campos de Nivel Superior

| Campo CoRD              | Campo VTEX          | Mapeo     | Notas                         |
|-------------------------|---------------------|-----------|-------------------------------|
| `id`                    | `orderId`           | Directo   | -                             |
| `id`                    | `sellerOrderId`     | Directo   | Mismo valor que `orderId`     |
| `sequence`              | `sequence`          | Directo   | Valor como texto              |
| `status`                | `status`            | Directo   | Se mantienen los estados CoRD |
| `createdAt`             | `creationDate`      | Directo   | -                             |
| `lastUpdatedAt`         | `lastChange`        | Directo   | -                             |
| `id`                    | `orderGroup`        | Directo   | Mismo valor que `orderId`     |
| `checkoutTransactionId` | `orderFormId`       | Directo   |                               |
| `cancelReason`          | `cancelReason`      | Directo   | -                             |
| -                       | `origin`            | Constante | Siempre "`CORD`"              |
| -                       | `affiliateId`       | Constante | Siempre `null`                |
| -                       | `salesChannel`      | Constante | Siempre "1"                   |
| -                       | `statusDescription` | Constante | Siempre vacío                 |

#### Totales

Los totales de CoRD se transforman al formato de array de VTEX:

| CoRD                   | VTEX                                                                    |
|------------------------|-------------------------------------------------------------------------|
| `totals.itemsSubtotal` | `{id: "Items", name: "Total de los items", value: itemsSubtotal}`       |
| `totals.discountTotal` | `{id: "Discounts", name: "Total de descuentos", value: -discountTotal}` |
| `totals.shipping`      | `{id: "Shipping", name: "Costo total del envío", value: shipping}`      |
| -                      | `{id: "Tax", name: "Impuesto", value: null}`                            |

> **Nota:** Los descuentos siempre se envían con valor negativo en VTEX.

#### Información del Cliente

| Campo CoRD                | Campo VTEX                       | Mapeo                          |
|---------------------------|----------------------------------|--------------------------------|
| `customer.email`          | `clientProfileData.email`        | Directo                        |
| `customer.names`          | `clientProfileData.firstName`    | Directo                        |
| `customer.lastNames`      | `clientProfileData.lastName`     | Directo                        |
| `customer.phoneNumber`    | `clientProfileData.phone`        | Directo                        |
| `customer.documentType`   | `clientProfileData.documentType` | Directo                        |
| `customer.documentNumber` | `clientProfileData.document`     | Directo                        |
| -                         | `clientProfileData.id`           | Constante: "clientProfileData" |
| -                         | `clientProfileData.isCorporate`  | Constante: `false`             |

#### Información de Envío

##### Dirección

| Campo CoRD                                                | Campo VTEX                            | Mapeo             |
|-----------------------------------------------------------|---------------------------------------|-------------------|
| `customer.names + customer.lastNames`                     | `shippingData.address.receiverName`   | Concatenado       |
| `shipping.address.address`                                | `shippingData.address.street`         | Directo           |
| `shipping.address.addressNumber`                          | `shippingData.address.number`         | Directo           |
| `shipping.address.district`                               | `shippingData.address.neighborhood`   | Directo           |
| `shipping.address.province`                               | `shippingData.address.city`           | Directo           |
| `shipping.address.department`                             | `shippingData.address.state`          | Directo           |
| `shipping.address.reference`                              | `shippingData.address.reference`      | Directo           |
| `[shipping.address.longitude, shipping.address.latitude]` | `shippingData.address.geoCoordinates` | Array [lng, lat]  |
| -                                                         | `shippingData.address.country`        | Constante: "`PE`" |

##### Información Logística

Se crea un array con un único elemento:

| Campo CoRD                 | Campo VTEX                                     | Mapeo                 |
|----------------------------|------------------------------------------------|-----------------------|
| -                          | `logisticsInfo[0].itemIndex`                   | Constante: 0          |
| `shipping.modality`        | `logisticsInfo[0].selectedSla`                 | Directo               |
| `shipping.cost`            | `logisticsInfo[0].price`                       | Directo               |
| `shipping.cost`            | `logisticsInfo[0].listPrice`                   | Directo               |
| `shipping.cost`            | `logisticsInfo[0].sellingPrice`                | Directo               |
| `shipping.startDateWindow` | `logisticsInfo[0].deliveryWindow.startDateUtc` | Directo               |
| `shipping.endDateWindow`   | `logisticsInfo[0].deliveryWindow.endDateUtc`   | Directo               |
| `shipping.deliveryDate`    | `logisticsInfo[0].shippingEstimateDate`        | Directo               |
| `shipping.origin.code`     | `logisticsInfo[0].deliveryIds[0].warehouseId`  | Directo               |
| -                          | `logisticsInfo[0].deliveryWindow.price`        | Constante: 0          |
| -                          | `logisticsInfo[0].deliveryChannel`             | Constante: "delivery" |
| -                          | `logisticsInfo[0].deliveryIds[0].quantity`     | Constante: 1          |

#### Información de Pago

| Campo CoRD              | Campo VTEX                                                  | Mapeo   |
|-------------------------|-------------------------------------------------------------|---------|
| `payment.transactionId` | `paymentData.transactions[0].transactionId`                 | Directo |
| `payment.transactionId` | `paymentData.transactions[0].payments[0].id`                | Directo |
| `payment.methodType`    | `paymentData.transactions[0].payments[0].paymentSystem`     | Directo |
| `payment.methodType`    | `paymentData.transactions[0].payments[0].paymentSystemName` | Directo |
| `totals.total`          | `paymentData.transactions[0].payments[0].value`             | Directo |
| `payment.card.bin`      | `paymentData.transactions[0].payments[0].firstDigits`       | Directo |
| `payment.card.lastPan`  | `paymentData.transactions[0].payments[0].lastDigits`        | Directo |

#### Items de la Orden

##### Producto Principal

| Campo CoRD                        | Campo VTEX                | Mapeo                              |
|-----------------------------------|---------------------------|------------------------------------|
| `items[].id`                      | `items[].uniqueId`        | Directo                            |
| `items[].id`                      | `items[].id`              | Mismo valor que `items[].uniqueId` |
| `items[].product.id`              | `items[].productId`       | Directo                            |
| `items[].product.ean`             | `items[].ean`             | Directo                            |
| `items[].quantity`                | `items[].quantity`        | Directo                            |
| `items[].product.name`            | `items[].name`            | Directo                            |
| `items[].product.externalId`      | `items[].refId`           | Directo                            |
| `items[].product.sku`             | `items[].sellerSku`       | Directo                            |
| `items[].unitPrice`               | `items[].price`           | Directo (centavos)                 |
| `items[].unitPrice`               | `items[].listPrice`       | Directo (centavos)                 |
| `items[].total`                   | `items[].sellingPrice`    | Directo (centavos)                 |
| `items[].product.measurementUnit` | `items[].measurementUnit` | Directo                            |
| -                                 | `items[].seller`          | Constante: "1"                     |
| -                                 | `items[].unitMultiplier`  | Constante: 1.0                     |
| -                                 | `items[].isGift`          | Constante: false                   |

##### Información Adicional del Producto

| Campo CoRD                   | Campo VTEX                             | Mapeo   |
|------------------------------|----------------------------------------|---------|
| `items[].product.brand`      | `items[].additionalInfo.brandName`     | Directo |
| `items[].product.brandId`    | `items[].additionalInfo.brandId`       | Directo |
| `items[].product.categoryId` | `items[].additionalInfo.categoriesIds` | Directo |

##### Descuentos Aplicados

Los descuentos se mapean al array `priceTags`:

| Campo CoRD                                    | Campo VTEX                         | Mapeo               |
|-----------------------------------------------|------------------------------------|---------------------|
| `items[].appliedDiscounts[].code`             | `items[].priceTags[].name`         | Directo             |
| `items[].appliedDiscounts[].calculatedAmount` | `items[].priceTags[].value`        | Negativo (centavos) |
| `items[].appliedDiscounts[].code`             | `items[].priceTags[].identifier`   | Directo             |
| -                                             | `items[].priceTags[].isPercentual` | Constante: false    |

##### Productos Empaquetados (Pack Items)

Los `packItems` de CoRD se mapean al array `components` de VTEX:

##### Sellers Predeterminados

Para todas las órdenes en formato VTEX, se incluye un seller estático:

```json
[
  {
    "id": "1",
    "name": "Vivanda"
  }
]
```

#### Campos con Valores Constantes

Los siguientes campos siempre tienen valores predeterminados en el formato VTEX:

| Campo                                   | Valor              |
|-----------------------------------------|--------------------|
| `origin`                                | "`CORD`"           |
| `affiliateId`                           | `null`             |
| `salesChannel`                          | "1"                |
| `statusDescription`                     | `""`               |
| `sellers[0].id`                         | "1"                |
| `sellers[0].name`                       | "Vivanda"          |
| `clientProfileData.isCorporate`         | `false`            |
| `shippingData.address.country`          | "`PE`"             |
| `logisticsInfo[0].itemIndex`            | 0                  |
| `logisticsInfo[0].deliveryChannel`      | "delivery"         |
| `logisticsInfo[0].deliveryWindow.price` | 0                  |
| `items[].seller`                        | "1"                |
| `items[].unitMultiplier`                | 1.0                |
| `items[].isGift`                        | false              |
| `items[].bundleItems`                   | `[]` (array vacío) |

#### Campos Nulos por Defecto

Los siguientes campos se establecen como `null` cuando no hay equivalente en CoRD:

- `followUpEmail`
- `lastMessage`
- `hostname`
- `addressId` (en logisticsInfo y shippingData)
- `lockTTL`
- `deliveryCompany`
- `courierId`
- `courierName`
- `dockId`
- Varios campos de `marketingData`
- Campos corporativos en `clientProfileData`