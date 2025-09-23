# Eventos

Microservicio dedicado a recibir y almacenar eventos de usuario del frontend (clics, búsquedas, conversiones) para alimentar las métricas de relevancia.

## Registra un evento de interacción del cliente <format style="superscript" color="Yellow">(proposed)</format> {id="event-ingestion"}


<api-endpoint openapi-path="search-management.yaml" endpoint="/search/v1/stores/{storeId}/events" method="POST" >
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="event-search.json"/>
    </request>
</api-endpoint>