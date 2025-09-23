---
lang: es
---

# Fulfillment Service

<card-summary>
Calcula modalidades de entrega, disponibilidad por ubicación geográfica, embalajes requeridos y ventanas horarias para despacho a domicilio y recojo en tienda.
</card-summary>

Determina cómo y cuándo se pueden entregar los productos de un carrito. Evalúa la disponibilidad de cada SKU según el
destino, calcula automáticamente el número de paquetes necesarios para el despacho y proporciona las ventanas horarias
disponibles para cada modalidad de entrega.

## Modalidades soportadas

* **`HOME_DELIVERY`**: Entrega a domicilio con ventanas horarias flexibles
* **`PICKUP_IN_STORE`**: Retiro en tienda con horarios disponibles por punto de recojo

## Modalidad de despacho por SKU <format style="superscript" color="Yellow">(proposed)</format> {id="individual-sku-dispatch-modalities"}

<api-endpoint openapi-path="fulfillment-v1.yaml" endpoint="/fulfillment/v1/skus/{sku}/shipping-options" method="GET" />

### Estructura de respuesta {id="individual-sku-dispatch-modalities-response"}

<api-schema openapi-path="fulfillment-schemas.yaml" name="SkuShippingOptionsResponse" display-links-if-available="true" />

## Simulación de envío <format style="superscript" color="Yellow">(proposed)</format> {id="shipping-simulation"}

<api-schema openapi-path="fulfillment-schemas.yaml" name="ShippingSimulationRequest" display-links-if-available="true"/>

### Consideraciones importantes {id="shipping-simulation-considerations"}

> **Empaquetado automático:** Los productos se agrupan según reglas de negocio internas. El mismo
> carrito puede generar diferentes combinaciones de paquetes según disponibilidad y origen.
>
> **Paquetes por origen:** Items de diferentes orígenes siempre se separan en paquetes independientes, cada uno con sus
> propios costos de envío.
>
> **Filtros restrictivos:** Los filtros pueden resultar en respuestas vacías si ningún paquete tiene opciones
> disponibles para los modos especificados.
>
> **Cálculo de fechas por origen:** Cada origen tiene sus propias ventanas de procesamiento y lead times.
>
> **Pickup points dinámicos:** Para **`PICKUP_IN_STORE`**, diferentes paquetes pueden mostrar diferentes puntos de
> recojo según proximidad al destino y capacidad de almacenamiento.
>
> **No determinístico:** El algoritmo puede devolver resultados diferentes para la misma consulta debido a cambios en
> tiempo real de inventario, capacidad de orígenes y políticas de fulfillment.


<api-endpoint openapi-path="fulfillment-v1.yaml" endpoint="/fulfillment/v1/shipping-simulation" method="POST"/>

### Estructura de respuesta {id="shipping-simulation-response"}

<api-schema openapi-path="fulfillment-schemas.yaml" name="ShippingSimulationResponse" display-links-if-available="true"/>