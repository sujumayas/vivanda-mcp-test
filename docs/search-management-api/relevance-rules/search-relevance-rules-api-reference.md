# Reglas de relevancia

La **API de Gestion del Search** gestionar las reglas de relevancia basadas en pesos.

## Crear o actualizar una regla de relevancia <format style="superscript" color="Yellow">(proposed)</format> {id="create-update-relevance-rule"}

<api-endpoint openapi-path="search-management.yaml" endpoint="/search/management/v1/stores/{storeId}/rules/relevance" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createRelevanceRule.json"/>
    </request>
    <response type="200">
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            }
        </sample>
    </response>
    <response type="201">
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            }
        </sample>
    </response>
</api-endpoint>


## Obtener reglas de relevancia <format style="superscript" color="Yellow">(proposed)</format> {id="get-relevance-rule"}

<api-endpoint openapi-path="search-management.yaml" endpoint="/search/management/v1/stores/{storeId}/rules/relevance" method="GET">
    <response type="200">
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                "configuration": {
                    "catalog_score": 10,
                    "release_date": 0,
                    "best_selling": 3,
                    "discount": 8
                  }
            }
        </sample>
    </response>
</api-endpoint>