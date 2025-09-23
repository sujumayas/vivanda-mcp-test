# POST - Crear reglas de redirección

API para gestionar las reglas de redirección de búsqueda basadas en términos y condiciones.

## Crear una regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="create-redirect-rule"}

<api-schema openapi-path="search-management-schemas.yaml" name="RedirectRuleInput" depth="3" display-links-if-available="true"/>


<api-endpoint openapi-path="search-management.yaml" endpoint="/search/management/v1/stores/{storeId}/rules/redirect" method="POST" >
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createRedirectRule.json"/>
    </request>
    <response type="201">
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            }
        </sample>
    </response>
</api-endpoint>