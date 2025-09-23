# Webhook Service

API para administrar subscriptores de webhooks, permitiendo su creación, consulta, actualización y activación o
desactivación,
con soporte para configuración de seguridad y preferencias de eventos.

## Objeto `SubcriptorWebhook`

El objeto `SubcriptorWebhook` se utiliza para enviar toda la data relacionada a la orden a los subscriptores de los
eventos. Este objeto contiene los siguientes componentes:

### Estructura del `SubcriptorWebhook`

Para obtener la estructura completa del objeto `SubcriptorWebhook`, consulta el archivo `webhook-service-schemas.yaml`
que contiene la definición detallada del esquema.

O bien, la estructura es la siguiente:

```json
{
  "id": "abc123",
  "event": "OrdersCreatedEvent",
  "sentAt": "2025-08-14T10:01:30.480762Z",
  "ocurretAt": "2025-08-14T10:01:25.066266600Z",
  "source": "CORD-WEBHOOK-SERVICE",
  "data": {
    "order": {
      "id": "order123",
      "transactionId": "tx123456",
      "shoppingCartId": "cart98765",
      "userId": "user456",
      "customer": {
        "id": "customer123",
        "email": "customer@example.com",
        "names": "John Doe"
      },
      "delivery": {
        "address": "1234 Elm St",
        "date": "2025-08-15",
        "cost": 5.99
      },
      "totals": {
        "subtotal": 100.00,
        "igv": 18.00,
        "currency": "USD"
      },
      "payment": {
        "methodType": "CreditCard",
        "status": "Completed"
      }
    }
  }
}
```

### Consideraciones importantes: {id="subscriptions-considerations"}

> **Estado inicial**: todos los subscriptores se crean con estado `ACTIVE`.
>
> **Campo `type`**: indica el tipo de evento que el subscriptor desea recibir.
>
> **Reintentos fallidos**: después de 3 intentos fallidos al enviar el *payload* mediante un POST a la `destinyUrl`, el
> subscriptor se cambia automáticamente a estado `INACTIVE`.

## Crear nuevo subscriptor <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-crear-nuevo-subscriptor"}

Crea un nuevo subscriptor en el sistema.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "destinyUrl": "https://api.destino.com/webhook",
                "withSecurity": true,
                "username": "usuario123",
                "password": "passwordSecreto",
                "preferences": [
                    {
                        "type": "OrdersCreatedEvent"
                    },
                    {
                        "type": "OrdersPaidEvent"
                    }
                ]
            }
        </sample>
    </request>
    <response type="201">
        <description>Subscriptor creado exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "2-rAkUp8UAY"
            }
        </sample>
    </response>
    <response type="400">
        <description>Datos inválidos</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "El campo 'destinyUrl' debe tener un formato válido",
                "instance": "/subscriptions/v2/subscription",
                "properties": {
                    "code": "VALIDATION_DESTINY_URL_FORMAT"
                }
            }
        </sample>
    </response>
    <response type="409">
        <description>El subscriptor ya existe</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 409,
                "detail": "Ya existe un subscriptor con esa URL de destino",
                "instance": "/subscriptions/v2/subscription",
                "properties": {
                    "code": "DUPLICATE_SUBSCRIPTION"
                }
            }
        </sample>
    </response>
    <response type="500">
        <description>Error interno del servidor</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/internal-error",
                "title": "Error interno",
                "status": 500,
                "detail": "Error inesperado en el servidor",
                "instance": "/subscriptions/v2/subscription",
                "properties": {
                    "code": "INTERNAL_SERVER_ERROR"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener lista de subscriptores <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-obtener-lista-subscriptores"}

Retorna una lista paginada de subscriptores con filtros opcionales.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription" method="GET">
    <response type="200">
        <description>Lista de subscriptores obtenida exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "page": {
                    "number": 1,
                    "size": 10,
                    "totalElements": 25,
                    "totalPages": 3,
                    "empty": false
                },
                "items": [
                    {
                        "id": "2-rAkUp8UAY",
                        "urlDestiny": "https://api.destino.com/webhook",
                        "preferences": [
                            { 
                               "type": "OrdersCreatedEvent" 
                            },
                            { 
                               "type": "OrdersPaidEvent" 
                            }
                        ]
                    },
                    {
                        "id": "8-NkT92QwZ1",
                        "urlDestiny": "https://hooks.partner.com/order-events",
                        "preferences": [
                            { "type": "OrdersCreatedEvent" }
                        ]
                    }
                ]
            }
        </sample>
    </response>
</api-endpoint>

## Obtener subscriptor por ID <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-obtener-subscriptor-por-id"}

Retorna un solo subscriptor.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription/{subscriptionId}" method="GET">
    <response type="200">
        <description>Detalles del subscriptor</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "2-rAkUp8UAY",
                "urlDestiny": "https://api.destino.com/webhook",
                "preferences": [
                    { 
                        "type": "OrdersCreatedEvent" 
                    },
                    { 
                        "type": "OrdersPaidEvent" 
                    },
                ]
            },
        </sample>
    </response>
    <response type="404">
        <description>Subscriptor no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró el subscriptor con el ID proporcionado",
                "instance": "/subscriptions/v2/subscription/{subscriptionId}",
                "properties": {
                    "code": "SUBSCRIPTION_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Actualizar subscriptor <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-actualizar-subscriptor"}

Actualiza los datos de un subscriptor existente.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription/{subscriptionId}" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "destinyUrl": "https://api.destino.com/webhook",
                "withSecurity": true,
                "username": "usuario123",
                "password": "passwordSecreto",
                "preferences": [
                    {
                        "type": "OrderCreated"
                    },
                    {
                        "type": "StockUpdated"
                    }
                ]
            }
        </sample>
    </request>
    <response type="204">
        <description>Subscriptor actualizado exitosamente</description>
    </response>
    <response type="400">
        <description>Solicitud inválida</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "El campo 'destinyUrl' debe tener un formato válido",
                "instance": "/subscriptions/v2/subscription/{subscriptionId}",
                "properties": {
                    "code": "VALIDATION_DESTINY_URL_FORMAT"
                }
            }
        </sample>
    </response>
    <response type="404">
        <description>Subscriptor no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "No encontrado",
                "status": 404,
                "detail": "No se encontró el subscriptor para actualizar",
                "instance": "/subscriptions/v2/subscription/{subscriptionId}",
                "properties": {
                    "code": "SUBSCRIPTION_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Activar subscriptores <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-activar-subscriptores"}

Cambia el estado de los subscriptores a `ACTIVE`, haciéndolos visibles.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription/enabled" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                "0895aea3-76d4-4c22-b0a1-785e61355a87",
                "7c5dc6d3-8ad0-49ce-89f7-04d3c0c1d43b"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Subscriptores activados exitosamente</description>
    </response>
    <response type="422">
        <description>No se puede activar el subscriptor</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/unprocessable-entity",
                "title": "Entidad no procesable",
                "status": 422,
                "detail": "Uno o más IDs no pueden ser activados por estar en estado inválido",
                "instance": "/subscriptions/v2/subscription/enabled",
                "properties": {
                    "code": "SUBSCRIPTION_ENABLE_ERROR"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Desactivar subscriptores <format style="superscript" color="Blue">(Planificado)</format> {id="subscriptions-desactivar-subscriptores"}

Cambia el estado de los subscriptores a `INACTIVE`, ocultándolos del acceso público sin eliminar su información.

<api-endpoint openapi-path="webhook-service-v1.yaml" endpoint="/subscriptions/v2/subscription/disabled" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                "0895aea3-76d4-4c22-b0a1-785e61355a87",
                "7c5dc6d3-8ad0-49ce-89f7-04d3c0c1d43b"
            ]
        </sample>
    </request>
    <response type="204">
        <description>Subscriptores desactivados exitosamente</description>
    </response>

</api-endpoint>

