---
lang: es
---

# Orders

Gestiona las órdenes de compra en la plataforma, incluyendo la creación, actualización y consulta de órdenes.

## Crear nueva orden <format style="superscript" color="Yellow">(proposed)</format> {id="create-order"}

Crea una nueva orden completa a partir de la información del checkout. Consolida todos los datos necesarios incluyendo
información del cliente, dirección de entrega, productos, totales y metadatos para el procesamiento completo de la
orden.

### Consideraciones importantes {id="create-order-considerations"}

> **Datos requeridos obligatorios**:
>
> **Cliente**: Email, nombres, apellidos, tipo y número de documento son obligatorios
>
> **Entrega**: Tipo de entrega, fecha y dirección completa son requeridos
>
> **Productos**: Al menos un producto con SKU, descripción, precio y cantidad
>
> **Transacción**: Debe provenir de un checkout completado exitosamente
>
> El endpoint valida la integridad de todos los datos antes de crear la orden y retorna el ID único generado.

<api-endpoint openapi-path="../../specifications/cord/orders-service.yaml" endpoint="/orders/v2" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "checkoutTransactionId": "1OzhM6RcMiz",
              "shoppingCartId": "10woVa94su3",
              "userId": "rLhHcAv9mNW1lH46MuvuFrBkF323",
              "customer": {
                "customerId": null,
                "email": "cliente@ejemplo.com",
                "names": "Juan",
                "lastNames": "Pérez",
                "phoneNumber": "987654321",
                "documentType": "DNI",
                "documentNumber": "12345678"
              },
              "shipping": {
                "modality": "HOME_DELIVERY",
                "deliveryType": "NORMAL",
                "deliveryDate": "2025-08-19",
                "startDateWindow": "14:00:00",
                "endDateWindow": "16:00:00",
                "cost": 35.5,
                "address": {
                  "address": "Av. Los Próceres 1234 Dpto. 501",
                  "addressNumber": null,
                  "reference": "Cerca al parque",
                  "district": "Santiago de Surco",
                  "province": "Lima",
                  "department": "Lima",
                  "ubigeo": "150140",
                  "latitude": -12.09857764,
                  "longitude": -77.00016975
                },
                "origin": {
                  "id": "cddf6b64-3eec-40b0-80c6-a2ac233778a9",
                  "code": "cddf6b64-3eec-40b0-80c6-a2ac233778a9",
                  "description": "BRANCH: cddf6b64-3eec-40b0-80c6-a2ac233778a9",
                  "type": "BRANCH"
                }
              },
              "items": [
                {
                  "quantity": 2,
                  "price": 35.99,
                  "product": {
                    "id": "6Y5G-33arD9",
                    "externalId": "222",
                    "name": "Manzana Nacional",
                    "brandId": "4BOBKGZuPYa",
                    "brand": "VIVANDA",
                    "categoryId": "4g8K7gsGdRt",
                    "category": "Manzana, Pera y Membrillo",
                    "sku": "63753",
                    "ean": "6543729129356",
                    "measurementUnit": "KILOGRAM",
                    "unitConversionFactor": 1,
                    "pack": false
                  },
                  "appliedDiscounts": [
                    {
                      "code": "discount_001",
                      "name": "Descuento Black Friday",
                      "type": "PERCENTAGE",
                      "value": 10,
                      "calculatedAmount": 10.9
                    }
                  ],
                  "productImage": {
                    "url": "https://storage.googleapis.com/cord-bucket-03-bo-mamagement-us-dev/public/images/8de08d11-bd4a-4269-93c1-5337d7dca0ee-cropped.jpeg",
                    "altText": "pollo artisan"
                  }
                },
                {
                  "quantity": 3,
                  "price": 55.99,
                  "product": {
                    "id": "6Y5G-33arD9",
                    "externalId": "63753",
                    "name": "Pera Nacional",
                    "brandId": "4BOBKGZuPYa",
                    "brand": "VIVANDA",
                    "categoryId": "4g8K7gsGdRt",
                    "category": "Manzana, Pera y Membrillo",
                    "sku": "63753",
                    "ean": "6543729129356",
                    "measurementUnit": "KILOGRAM",
                    "unitConversionFactor": 1,
                    "pack": false
                  },
                  "appliedDiscounts": [
                    {
                      "code": "discount_001",
                      "name": "Descuento Black Friday",
                      "type": "PERCENTAGE",
                      "value": 10,
                      "calculatedAmount": 259.9
                    }
                  ],
                  "productImage": {
                    "url": "https://storage.googleapis.com/cord-bucket-03-bo-mamagement-us-dev/public/images/8de08d11-bd4a-4269-93c1-5337d7dca0ee-cropped.jpeg",
                    "altText": "pollo artisan"
                  }
                },
                {
                  "quantity": 1,
                  "price": 25.99,
                  "product": {
                    "id": "6Y5G-33arD9",
                    "externalId": "63753",
                    "name": "Manzana Nacional",
                    "brandId": "4BOBKGZuPYa",
                    "brand": "VIVANDA",
                    "categoryId": "4g8K7gsGdRt",
                    "category": "Manzana, Pera y Membrillo",
                    "sku": "63753",
                    "ean": "6543729129356",
                    "measurementUnit": "KILOGRAM",
                    "unitConversionFactor": 1,
                    "pack": false
                  },
                  "appliedDiscounts": [],
                  "productImage": {
                    "url": "https://storage.googleapis.com/cord-bucket-03-bo-mamagement-us-dev/public/images/8de08d11-bd4a-4269-93c1-5337d7dca0ee-cropped.jpeg",
                    "altText": "pollo artisan"
                    }
                  }
                ]
             }
        </sample>
    </request>
     <response type="201">
        <description>Orden creada exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "2-rAkUp8UAY"
            }
        </sample>
    </response>
</api-endpoint>

### Estructura de request

La orden debe incluir toda la información consolidada del proceso de checkout:

- **Identificadores**: TransactionId, ShoppingCartId, UserId
- **Cliente**: Datos personales completos y documento de identidad
- **Entrega**: Modalidad, fechas, dirección detallada con coordenadas
- **Origen**: Información de la sucursal o centro de distribución
- **Productos**: Lista completa con precios, cantidades y descuentos
- **Totales**: Subtotal, impuestos y moneda
- **Metadatos**: Información de trazabilidad y configuración

## Obtener detalle de una orden <format style="superscript" color="Yellow">(Desplegado en DEV)</format> {id="get-orders-details"}

Permite obtener el detalle completo de una orden existente, incluyendo cliente, items, totales, descuentos, envío, medio
de pago, etc.  
El formato de respuesta se define mediante el **header `Accept`**:

- `Accept: application/json` → Formato estándar.
- `Accept: application/vtex+json` → Formato compatible con integraciones externas (VTEX).

<api-endpoint
  openapi-path="../../specifications/cord/orders-service.yaml"
  endpoint="/orders/v2/{id}"
  method="GET">

  <response type="200">
    <title>Ejemplo (formato estándar)</title>
    <sample lang="json">
{
  "id": "VIV-00000001000",
  "sequence": 1000,
  "checkoutTransactionId": "CHK-123",
  "status": "PAYMENT_AUTHORIZED",
  "createdDate": "2025-09-03T05:52:30.344Z",
  "lastModifiedDate": "2025-09-03T06:10:02.100Z",
  "totals": {
    "currency": "PEN",
    "subtotal": 2599.00,
    "totalDiscount": 259.90,
    "shippingCost": 5.50,
    "total": 2344.60
  },
  "customer": {
    "customerId": "CUST-1",
    "email": "demo@example.com",
    "names": "Juan",
    "lastNames": "Pérez",
    "phoneNumber": "+51999999999",
    "documentType": "DNI",
    "documentNumber": "12345678"
  },
  "shipping": {
    "modality": "HOME_DELIVERY",
    "dispatchType": "NORMAL",
    "deliveryDate": "2025-09-05",
    "startDateWindow": "10:00:00",
    "endDateWindow": "12:00:00",
    "cost": 5.50,
    "address": {
      "address": "Av. Siempre Viva",
      "addressNumber": "742",
      "reference": "Frente al parque",
      "district": "Miraflores",
      "province": "Lima",
      "department": "Lima",
      "ubigeo": "150122",
      "latitude": -12.119,
      "longitude": -77.034
    },
    "origin": {
      "id": "ORIG-1",
      "type": "BRANCH",
      "code": "T001",
      "description": "LIM013"
    }
  },
  "payment": {
    "methodType": "CREDIT_CARD",
    "transactionId": "1c9a5851-3c69-48d6-b826-24d65f15e47a",
    "status": "AUTHORIZED",
    "card": {
      "brand": "VISA",
      "bin": "411111",
      "lastPan": "1111"
    }
  },
  "items": [
    {
      "id": "26kXKZOLhUY",
      "sequence": 1,
      "product": {
        "id": "PROD-HP-15",
        "externalId": "HP-PAV-15-001",
        "name": "Laptop HP Pavilion 15-eh2001la",
        "sku": "HP-PAV-15-EH2001LA",
        "ean": "194850012345",
        "pack": false,
        "brandId": "4hkF0ncp6HD",
        "brand": "HP",
        "categoryId": "6U1l2Hm1huN",
        "category": "Laptops",
        "measurementUnit": "UNIT",
        "unitConversionFactor": 1.0
      },
      "quantity": 1.0,
      "appliedDiscounts": [
        {
          "code": "discount_001",
          "name": "Descuento Black Friday",
          "type": "PERCENTAGE",
          "value": 10.0,
          "calculatedAmount": 259.90
        }
      ],
      "unitPrice": 2599.00,
      "subtotal": 2599.00,
      "totalAppliedDiscount": 259.90,
      "total": 2339.10,
      "productImage": {
        "url": "https://cdn.example.com/img/hp15.jpg",
        "altText": "Laptop HP Pavilion 15-eh2001la"
      }
    },
    {
      "id": "1QzA5hdVU42",
      "sequence": 2,
      "product": {
        "id": "PROD-PACK-ABC",
        "externalId": "PACK_ABC",
        "name": "Teclado & Mouse",
        "sku": "PACK_ABC",
        "ean": "194850012345",
        "pack": true,
        "brandId": null,
        "brand": null,
        "categoryId": "FnG1b4BAvn",
        "category": "PC & Laptops",
        "measurementUnit": "UNIT",
        "unitConversionFactor": 1.0,
        "packItems": [
          {
            "id": "PROD-TPK-001",
            "externalId": "TPLINK_KEYBOARD_001",
            "name": "Teclado mecánico TPLink",
            "sku": "TPLINK-0001",
            "ean": "194850987345",
            "brandId": "350OvujJDWY",
            "brand": "TP-Link",
            "categoryId": "FnG1b4BAvn",
            "category": "PC & Laptops",
            "measurementUnit": "UNIT",
            "unitConversionFactor": 1.0
          },
          {
            "id": "PROD-TPM-001",
            "externalId": "TPLINK_MOUSE_001",
            "name": "Mouse inalámbrico TPLink",
            "sku": "TPLINK-0002",
            "ean": "194850909845",
            "brandId": "350OvujJDWY",
            "brand": "TP-Link",
            "categoryId": "FnG1b4BAvn",
            "category": "PC & Laptops",
            "measurementUnit": "UNIT",
            "unitConversionFactor": 1.0
          }
        ]
      },
      "quantity": 1.0,
      "appliedDiscounts": [],
      "unitPrice": 150.00,
      "subtotal": 150.00,
      "totalAppliedDiscount": 0.00,
      "total": 150.00
    }
  ]
}
    </sample>
  </response>



</api-endpoint>

## Obtener detalle de una orden en formato VTEX <format style="superscript" color="Yellow">(Desplegado en DEV)</format> {id="get-orders-details-vtex"}

Permite obtener el detalle completo de una orden existente, incluyendo cliente, items, totales, descuentos, envío, medio
de pago, etc.  
El formato de respuesta se define mediante el **header `Accept`**:

- `Accept: application/vtex+json` → Formato compatible con integraciones externas (VTEX).

<api-endpoint
  openapi-path="../../specifications/cord/orders-service.yaml"
  endpoint="/orders/v2/{id}"
  method="GET">

<response type="200">
    <title>Ejemplo (formato VTEX)</title>
    <sample lang="json">
{
  "orderId": "793RIztfMF7",
  "sellerOrderId": "793RIztfMF7",
  "sequence": "1",
  "origin": "CORD",
  "salesChannel": "1",
  "status": "PAYMENT_AUTHORIZED",
  "statusDescription": "Payment authorized",
  "value": 14720,
  "creationDate": "2025-07-24T12:29:39.279Z",
  "lastChange": "2025-07-24T12:29:39.279Z",
  "orderGroup": "793RIztfMF7",
  "orderFormId": "chk-2PsbbrERc2Y",
  "totals": [
    { "id": "Items", "name": "Total de los items", "value": 15670 },
    { "id": "Discounts", "name": "Total de descuentos", "value": -1450 },
    { "id": "Shipping", "name": "Costo total del envío", "value": 500 }
  ],
  "sellers": [
    { "id": "1", "name": "Vivanda" }
  ],
  "paymentData": {
    "transactions": [
      {
        "isActive": true,
        "transactionId": "1c9a5851-3c69-48d6-b826-24d65f15e47a",
        "payments": [
          {
            "id": "1c9a5851-3c69-48d6-b826-24d65f15e47a",
            "paymentSystem": "CREDIT_CARD",
            "paymentSystemName": "CREDIT_CARD",
            "value": 14720,
            "referenceValue": 14720,
            "firstDigits": "411111",
            "lastDigits": "1111",
            "connectorResponses": {}
          }
        ]
      }
    ]
  },
  "shippingData": {
    "address": {
      "receiverName": "Alberto Fernando Valdez Peralta",
      "city": "Lima",
      "state": "Lima",
      "country": "PER",
      "street": "Jirón Juan Cajahuamán",
      "number": "739",
      "neighborhood": "Pueblo Libre",
      "reference": "a espalda de pollería leña y carbón",
      "geoCoordinates": [-77.068465, -12.006578]
    },
    "logisticsInfo": [
      {
        "itemIndex": 0,
        "selectedSla": "NORMAL",
        "price": 500,
        "listPrice": 500,
        "sellingPrice": 500,
        "deliveryWindow": {
          "startDateUtc": "2025-07-24T12:29:39.279Z",
          "endDateUtc": "2025-07-24T12:29:39.279Z",
          "price": 0
        },
        "shippingEstimate": "2025-07-24",
        "shippingEstimateDate": "2025-07-24",
        "deliveryIds": [
          {
            "quantity": 1,
            "warehouseId": "SPSA-957"
          }
        ],
        "deliveryChannel": "delivery",
        "pickupStoreInfo": {
          "isPickupStore": false
        }
      }
    ]
  },
  "ratesAndBenefitsData": {
    "rateAndBenefitsIdentifiers": []
  },
  "clientProfileData": {
    "id": "clientProfileData",
    "email": "customer@sample.com",
    "firstName": "Alberto Fernando",
    "lastName": "Valdez Peralta",
    "documentType": "DNI",
    "document": "08546254",
    "phone": "+51987538408",
    "isCorporate": false
  },
  "items": [
    {
      "uniqueId": "26kXKZOLhUY",
      "id": "26kXKZOLhUY",
      "productId": "2QVAulBmQ3A",
      "ean": "194850012345",
      "quantity": 1,
      "seller": "1",
      "name": "Laptop HP Pavilion 15-eh2001la",
      "refId": "HP-PAV-15-001",
      "price": 259900,
      "listPrice": 259900,
      "priceTags": [
        {
          "name": "discount_001",
          "value": -25990,
          "isPercentual": false,
          "identifier": "discount_001",
          "rawValue": -259.90
        }
      ],
      "sellerSku": "HP-PAV-15-EH2001LA",
      "additionalInfo": {
        "brandName": "HP",
        "brandId": "4hkF0ncp6HD",
        "categoriesIds": "6U1l2Hm1huN"
      },
      "measurementUnit": "UNIT",
      "unitMultiplier": 1.0,
      "sellingPrice": 233910,
      "isGift": false,
      "priceDefinition": {
        "sellingPrices": [
          { "value": 233910, "quantity": 1 }
        ]
      }
    },
    {
      "uniqueId": "1QzA5hdVU42",
      "id": "1QzA5hdVU42",
      "productId": "2QVAulBmQ3A",
      "ean": "194850012345",
      "quantity": 1,
      "seller": "1",
      "name": "Teclado & Mouse",
      "refId": "PACK_ABC",
      "price": 15000,
      "listPrice": 15000,
      "components": [
        {
          "uniqueId": "2QVAulBmQ3A",
          "id": "2QVAulBmQ3A",
          "productId": "2QVAulBmQ3A",
          "ean": "194850987345",
          "quantity": 1,
          "seller": "1",
          "name": "Teclado mecánico TPLink",
          "refId": "TPLINK_KEYBOARD_001",
          "sellerSku": "TPLINK-0001",
          "additionalInfo": {
            "brandName": "TP-Link",
            "brandId": "350OvujJDWY",
            "categoriesIds": "FnG1b4BAvn"
          },
          "measurementUnit": "UNIT",
          "unitMultiplier": 1.0,
          "isGift": false
        },
        {
          "uniqueId": "6XPdalik7Lu",
          "id": "6XPdalik7Lu",
          "productId": "6XPdalik7Lu",
          "ean": "194850909845",
          "quantity": 1,
          "seller": "1",
          "name": "Mouse inalámbrico TPLink",
          "refId": "TPLINK_MOUSE_001",
          "sellerSku": "TPLINK-0002",
          "additionalInfo": {
            "brandName": "TP-Link",
            "brandId": "350OvujJDWY",
            "categoriesIds": "FnG1b4BAvn"
          },
          "measurementUnit": "UNIT",
          "unitMultiplier": 1.0,
          "isGift": false
        }
      ],
      "sellerSku": "PACK_ABC",
      "measurementUnit": "UNIT",
      "unitMultiplier": 1.0,
      "sellingPrice": 15000,
      "isGift": false,
      "priceDefinition": {
        "sellingPrices": [
          { "value": 15000, "quantity": 1 }
        ]
      }
    }
  ]
}
    </sample>
  </response>



</api-endpoint>

## Actualizar datos de customer por Orden ID <format style="superscript" color="Yellow">(proposed)</format> {id="update-customer-by-order-id"}

Este endpoint permite actualizar parcialmente la información de un cliente asociada a una orden específica. Solo los
campos proporcionados en la solicitud serán actualizados (por ejemplo, nombre, correo electrónico, número de documento,
etc.). El ID de la orden se utiliza como parámetro para identificar la orden correspondiente.

### Consideraciones importantes {id="update-customer-by-order-id-considerations"}

> **Datos requeridos**:
>
> Los campos que se proporcionen en la solicitud serán actualizados. Los campos no enviados no sufrirán modificaciones.
>
> **Orden**: El ID de la orden es requerido para identificar al cliente asociado a dicha orden.
>
> El endpoint valida los datos recibidos antes de proceder con la actualización parcial de los datos del cliente en la
> orden indicada. Si un campo no es proporcionado en la solicitud, no se actualizará.


<api-endpoint openapi-path="../../specifications/cord/orders-service.yaml" endpoint="/orders/v2/{id}/customer" method="PATCH">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "customerId": "abc123",
              "email": "cliente@ejemplo.com",
              "names": "Juan",
              "lastNames": "Pérez",
              "phoneNumber": "987654321",
              "documentType": "DNI",
              "documentNumber": "12345678"
            }
        </sample>
    </request>
    <response type="201">
        <description>Datos de cliente actualizados correctamente</description>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Orden no encontrada",
                "status": 404,
                "detail": "No se encontró la orden solicitada",
                "instance": "/orders/v2/{orderId}",
                "properties": {
                    "code": "ORDER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Comenzar a procesar una orden <format style="superscript" color="Yellow">(Desplegado en DEV)</format> {id="start-handling-order"}

Cambia el estado de una orden para indicar que esta en proceso

<api-endpoint openapi-path="../../specifications/cord/orders-service.yaml" endpoint="/orders/v2/{id}/start-handling" method="POST">
     <response type="204">
        <description>Orden cancelada exitosamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Cancelar una orden existente <format style="superscript" color="Yellow">(Desplegado en DEV)</format> {id="cancel-order"}

Permite cancelar una orden existente

<api-endpoint openapi-path="../../specifications/cord/orders-service.yaml" endpoint="/orders/v2/{id}/cancel" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "reason": "PAYMENT FAILED"
            }
        </sample>
    </request>
     <response type="204">
        <description>Orden cancelada exitosamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>