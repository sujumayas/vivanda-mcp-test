---
lang: es
---

# Acuerdos legales y aceptaciones

Gestión de aceptaciones de documentos legales de clientes.

Permite registrar y consultar el estado de aceptaciones de documentos legales como términos y condiciones, políticas de
privacidad y consentimientos de marketing.

## Registrar aceptaciones <format style="superscript" color="DarkOrange">(developing)</format> {id="register-acceptances"}

### Consideraciones importantes {id="register-acceptances-considerations"}

> **Comportamiento idempotente:**
> - Si una aceptación ya existe, no se actualiza la fecha original
> - No retorna error si se envía la misma aceptación múltiples veces
> - El sistema captura automáticamente la fecha de aceptación para nuevas aceptaciones
>
> **Validaciones:**
> - Se permite rechazar documentos obligatorios (accepted: false)
> - El array de aceptaciones no puede estar vacío

<api-schema openapi-path="customer_legal-agreements-schemas.yaml" name="AcceptanceRequest" display-links-if-available="true"/>

<api-endpoint openapi-path="customer_legal-agreements-v1.yaml" endpoint="/customers/v2/{customerId}/legal-agreements/acceptances" method="POST" />

## Consultar aceptaciones <format style="superscript" color="DarkOrange">(developing)</format> {id="get-acceptances"}

### Consideraciones importantes {id="get-acceptances-considerations"}

> **Comportamiento:**
> - Retorna **TODOS** los tipos de documentos legales disponibles en el sistema
> - Incluye documentos que nunca han sido aceptados (accepted: false, acceptedAt: null)
> - Proporciona información sobre versiones actuales vs aceptadas
> - Indica qué documentos son obligatorios
> 
> **Estados posibles:**
> - Aceptado: accepted: true con fecha de aceptación
> - Rechazado: accepted: false con fecha de rechazo
> - No interactuado: accepted: false con acceptedAt: null

<api-endpoint openapi-path="customer_legal-agreements-v1.yaml" endpoint="/customers/v2/{customerId}/legal-agreements/acceptances" method="GET" />

### Estructura de respuesta {id="get-acceptances-response-object"}

<api-schema openapi-path="customer_legal-agreements-schemas.yaml" name="AcceptanceStatusResponse" display-links-if-available="true" />