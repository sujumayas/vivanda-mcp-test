# Métodos de pago

## Descripción
Se encarga de gestionar los métodos de pago de los clientes.

> Este servicio determina **usuario** y la **aplicación** a partir de las [**cabeceras de la solicitud**](cord-api-reference.md#http-headers).
{style="note"}

## Sincronización de tarjetas <format style="superscript" color="Blue">(Desplegado DEV)</format>

Sincroniza las tarjetas de un usuario con un sistema de pago externo.
Actualmente, solo se admite el sistema de pago **ePago**.

<api-endpoint openapi-path="../../specifications/cord/payment-methods-service.yaml" endpoint="/payment-methods/v1/cards/sync" method="POST">
    <response type="500">
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Internal server error",
                "status": 500,
                "detail": "Ocurrió un error de conexión con el sistema ePagos",
                "instance": "/payment-methods/v1/cards/sync",
                "properties": {
                    "code": "BBR_CONNECTION_FAILED"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Listar tarjetas <format style="superscript" color="Blue">(Desplegado DEV)</format>

Lista **todas** las tarjetas de un usuario.

- No soporta paginación.
- Por defecto, la primera tarjeta se marca como `selected`.

<api-endpoint openapi-path="../../specifications/cord/payment-methods-service.yaml" endpoint="/payment-methods/v1/cards" method="GET"/>

## Establecer tarjeta como predeterminada <format style="superscript" color="Blue">(Desplegado DEV)</format>

Establece una tarjeta como predeterminada para un usuario y una aplicación determinada.

- **IDEMPOTENTE**: Puedes llamarlo varias veces sin problemas, si la tarjeta ya está marcada como predeterminada, no se realizará ningún cambio.

<api-endpoint openapi-path="../../specifications/cord/payment-methods-service.yaml" endpoint="/payment-methods/v1/cards/default-cards" method="PUT">
    <response type="404">
        <sample lang="json">
            {
                "type": "type:blank",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró la tarjeta",
                "instance": "/payment-methods/v1/cards/default-cards",
                "properties": {
                    "code": "CARD_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>