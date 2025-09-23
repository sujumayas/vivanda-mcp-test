# Checkout

Gestiona toda la experiencia de compra en la plataforma, desde la creación del
carrito de compras hasta la finalización exitosa de la transacción.

---

## Identificar cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="set-customer-identification"}

<api-schema openapi-path="checkout-service-schemas.yaml" name="CheckoutCustomerIdentificationRequest"/>

### Consideraciones importantes {id="customer-identification-considerations"}

> **2 maneras** de identificar al cliente:
>
> **CustomerId**: Cuando el cliente ya está autenticado y registrado en el sistema.
>
> **Información completa del cliente**: Se puede incluir correo electrónico, nombre completo, número de documento, etc.
>
> **Email**: Siempre es requerido, incluso si se cuenta con un **`customerId`**.
>
> Puede consultar más detalles del [subproceso de identificación de cliente aquí](checkout.md#customer-identification).

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/transaction/customer" method="POST"/>

---

## Establecer dirección de entrega <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="set-delivery-address"}

<api-schema openapi-path="checkout-service-schemas.yaml" name="CheckoutSetDeliveryAddressRequest"/>

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/transaction/delivery-address" method="POST"/>

---

## Consultar opciones de envío <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="get-shipping-modalities"}

Permite obtener las opciones de envío disponibles para un modo específico de entrega. Este endpoint evalúa las opciones basándose en la dirección de entrega configurada, los productos en el carrito, y el modo de entrega seleccionado.

### Parámetros requeridos {id="shipping-modalities-parameters"}

> **mode** (obligatorio): Especifica el modo de entrega para el cual se consultan las opciones.
>
> Valores válidos:
> - `HOME_DELIVERY`: Entrega a domicilio
> - `PICKUP_IN_STORE`: Recojo en tienda

### Consideraciones importantes {id="shipping-modalities-considerations"}

> **Prerrequisitos obligatorios**:
>
> - **Dirección de entrega** previamente configurada.
> - **Carrito con productos** válidos.
> - **Transacción activa** (no completada ni fallida).
> - **Parámetro mode** especificado en la consulta.
>
> **Cambio importante**: Este endpoint ahora requiere el parámetro `mode` para determinar qué tipo de opciones de envío consultar.

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/shipping-modalities" method="GET"/>

### Estructura de respuesta - Opciones de Envío {id="response-shipping-modalities"}

<api-schema openapi-path="checkout-service-schemas.yaml" name="ShippingModalitiesResponse"/>

#### Explicación de la estructura:

- **mode**: El modo de entrega consultado (HOME_DELIVERY, PICKUP_IN_STORE)
- **dispatchType**: Tipo de despacho derivado automáticamente (NORMAL/EXPRESS)
- **price**: Precio base para el modo seleccionado
- **currency**: Moneda del precio (siempre "PEN")
- **dispatchWindows**: Lista de ventanas de despacho disponibles con fechas y horarios específicos
    - **date**: Fecha de entrega en formato YYYY-MM-DD
    - **availability**: Indica si la fecha está disponible
    - **estimatedDays**: Días calculados dinámicamente desde la fecha actual hasta la entrega
    - **slots**: Franjas horarias disponibles para esa fecha con formato HH:mm:ss

### Ejemplo de respuesta {id="shipping-modalities-example"}

```json
{
  "mode": "HOME_DELIVERY",
  "dispatchType": "NORMAL", 
  "price": 5.5,
  "currency": "PEN",
  "dispatchWindows": [
    {
      "date": "2025-08-21",
      "availability": true,
      "estimatedDays": 0,
      "slots": [
        {
          "availability": false,
          "from": "02:00:00",
          "to": "06:00:00"
        },
        {
          "availability": true,
          "from": "17:00:00", 
          "to": "18:00:00"
        }
      ]
    },
    {
      "date": "2025-08-22",
      "availability": false,
      "estimatedDays": 1,
      "slots": []
    }
  ]
}
```

---

## Configurar preferencias de envío <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="configure-shipping-settings"}

Establece las preferencias de envío del cliente, incluyendo el modo de entrega, tipo de despacho, fecha y franja horaria específica. Valida que las opciones seleccionadas estén disponibles y actualiza los costos de la transacción.

<api-schema openapi-path="checkout-service-schemas.yaml" name="ShippingSettingsRequest"/>

### Consideraciones importantes {id="shipping-settings-considerations"}

> **Validaciones automáticas**:
>
> - Modo y tipo de despacho válidos.
> - Fecha y franja horaria disponibles.
> - Estado de transacción permitido.
> - Solo se permite configurar una vez por transacción.
>
> **Campos obligatorios**:
> - `mode`: Modo de entrega (HOME_DELIVERY, PICKUP_IN_STORE)
> - `dispatchType`: Tipo de despacho (NORMAL, EXPRESS)
> - `date`: Fecha de entrega en formato YYYY-MM-DD
> - `from`: Hora de inicio en formato HH:mm:ss
> - `to`: Hora de fin en formato HH:mm:ss
>
> **Cambios en la estructura**:
> - Se simplificaron los campos de request a solo 5 campos obligatorios
> - Los horarios ahora usan formato HH:mm:ss consistente
> - Todos los campos son obligatorios

### Ejemplo de request {id="shipping-settings-request-example"}

```json
{
  "mode": "HOME_DELIVERY",
  "dispatchType": "NORMAL",
  "date": "2025-08-21",
  "from": "02:00:00",
  "to": "06:00:00"
}
```

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/shipping-settings" method="POST"/>

### Estructura de respuesta - Configuración de Envío {id="response-shipping-settings"}

<api-schema openapi-path="checkout-service-schemas.yaml" name="ShippingSettingsResponse"/>

#### Cambios en la respuesta:

- **mode**: Modo de entrega configurado
- **dispatchType**: Tipo de despacho configurado
- **cost**: Costo final calculado del envío
- **deliveryDate**: Fecha de entrega confirmada
- **deliveryDay**: Horario configurado
    - **from**: Hora de inicio en formato HH:mm:ss
    - **to**: Hora de fin en formato HH:mm:ss

### Ejemplo de respuesta {id="shipping-settings-response-example"}

```json
{
  "mode": "HOME_DELIVERY",
  "dispatchType": "NORMAL",
  "cost": 5.50,
  "deliveryDate": "2025-08-21", 
  "deliveryDay": {
    "from": "02:00:00",
    "to": "06:00:00"
  }
}
```

---

## Configurar información de facturación <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="configure-billing-settings"}

Establece la configuración de facturación para la transacción de checkout, permitiendo al cliente elegir entre boleta (RECEIPT) o factura (INVOICE). Para facturas, valida automáticamente que se proporcionen RUC y razón social.

<api-schema openapi-path="checkout-service-schemas.yaml" name="BillingSettingsRequest"/>

### Consideraciones importantes {id="billing-settings-considerations"}

> **Tipos de facturación soportados**:
>
> - **RECEIPT (Boleta)**: Solo requiere especificar el tipo.
> - **INVOICE (Factura)**: Requiere RUC (taxId) y razón social (legalName).
> - **Validaciones automáticas** para campos requeridos según el tipo.
> - **Transacción activa** del usuario autenticado requerida.

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/v2/billing-settings" method="POST"/>

---

## Crear la orden <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="place-order"}

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/transaction/order" method="POST"/>

---


## Informar inicio de pago <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="payment-initated"}

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/transaction/payment-result" method="POST"/>

---
## Obtener detalle de la transacción de checkout <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="get-transaction-details"}

<api-endpoint openapi-path="checkout-service-v2.yaml" endpoint="/checkout/v2/transaction" method="GET"/>

### Estructura de respuesta - Detalle de Transacción {id="response-transaction-details"}

<api-schema openapi-path="checkout-service-schemas.yaml" name="TransactionDetailsResponse"/>
