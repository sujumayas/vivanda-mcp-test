# Overview

<card-summary>
Entiende rápidamente cómo comenzar con el uso de las REST APIs
</card-summary>

> Todas las APIs de CoRD utilizan [REST](https://en.wikipedia.org/wiki/Representational_state_transfer), se autentican
> con tokens JWT y devuelven códigos de respuesta HTTP y respuestas codificadas en JSON.

Para realizar una solicitud HTTP, utilice el verbo `GET`, `POST`, `PUT`, `DELETE` o `PATCH` que corresponda a la
operación que se desea realizar, la URL hacia el API del servicio, la URI hacia el recurso, enviar los datos (payload)
para crear, actualizar o elminar, además una o más de las cabeceras soportadas.

## URLs bases {id="base-urls"}

| Ambiente       | Código | Base URL                                |
|----------------|--------|-----------------------------------------|
| **Desarrollo** | `dev`  | **`https://api-dev.cord.pe/cord-rest`** |
| **QA**         | `qa`   | **`https://api-qa.cord.pe/cord-rest`**  |

Opcionalmente, se puede incluir párametros de consulta (query params) en las llamadas `GET` para establecer filtros,
parámetros de paginación y ordenamiento. La mayoría de los verbos `POST`, `PUT` Y `PATCH` requieres un JSON payload con
los datos a enviar.

## Cabeceras HTTP {id="http-headers"}

| Cabecera        | Descripción                                                  | Valores aceptados                             |
|-----------------|--------------------------------------------------------------|-----------------------------------------------|
| `X-Application` | Identificador de la aplicación desde donde consumen las APIs | `MRK`, `JOKR`, `EXP`, `BACKOFFICE`, `VIVANDA` |
| `X-Device-Id`   | Identificador del dispositivo que consume el servicio        | Pattern: `[A-Za-z0-9-:_]{2,300}`              |
| `X-Platform`    | Plataforma del dispositivo que consume el servicio           | `AND`, `IOS`, `WEB`                           |

## Versión {id="api-version"}

Todas las APIs expresan su versión a través de la URL para garantizar compatibilidad y evolución controlada de los servicios.

### Formato de Versionado

Las versiones se especifican inmediatamente después del path de dominio de la ruta del endpoint utilizando el formato `v{número}`:

```
https://api.cord.pe/catalog/v2/search
https://api.cord.pe/customers/v1/profile
```

### Consideraciones

- Cada endpoint puede tener diferentes versiones disponibles
- Se recomienda usar siempre la versión específica en lugar de omitirla
- Las versiones anteriores se mantienen por compatibilidad durante períodos definidos
- Consulte la documentación de cada API para conocer las versiones disponibles y su estado de soporte

## Paginación {id="pagination"}

Debido a los conjuntos de resultados potencialmente muy grandes de las llamadas a la API, las respuestas se devuelven
como páginas más cortas para optimizar el rendimiento.

Muchas de las llamadas **GET** a las APIs admiten parámetros de consulta de
paginación y ordenamiento.

> Para los parámetros de búsqueda específicos, revise la documentación de cada endpoint individual.
> {style="note"}

### Parámetros de Paginación

Para limitar, paginar y ordenar los datos devueltos en las respuestas de la API, utilice los siguientes parámetros de
consulta:

| Parámetro | Descripción                                                                                              | Valores aceptados                  | Ejemplo     |
|-----------|----------------------------------------------------------------------------------------------------------|------------------------------------|-------------|
| `page`    | Número de página que se desea consultar. La primera página es **0** (valor por defecto).                 | Número entero ≥ 0                  | `0`         |
| `size`    | Número de elementos por página. Si no se especifica, se aplica el valor por defecto del endpoint.        | Número entero > 0                  | `10`        |
| `sort`    | Criterio de ordenamiento. Por defecto es ascendente. Se admiten múltiples criterios separados por comas. | `propiedad,asc` o `propiedad,desc` | `name,desc` |

### Valores por Defecto

La paginación se puede personalizar según las necesidades. Si no se especifican parámetros, se aplicarán los valores por
defecto de cada endpoint (consulte la documentación específica de cada API).

## Especificaciones OpenAPI {id="openapi-specs"}

Descarga las especificaciones completas formato [OpenAPI 3.0](https://swagger.io/specification/) para integrar con tus herramientas de desarrollo favoritas.

### Descarga del Paquete Completo

> Descarga especificaciones API <resource src="cord-api.zip" />
> {style="note"}

### Mantenimiento y Actualizaciones

- **Frecuencia**: Las especificaciones se actualizan con cada release

> **Consejo**: Configura un workflow de CI/CD para descargar automáticamente las especificaciones actualizadas y regenerar tus clientes
> {style="tip"}