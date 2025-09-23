# PUT - Actualizar regla de redirección

API para actualizar regla de redirección de búsqueda basadas en términos y condiciones.

## Actualiza una regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="update-redirect-rule"}

<api-schema openapi-path="search-management-schemas.yaml" name="RedirectRuleInput" depth="3" display-links-if-available="true"/>


<api-endpoint openapi-path="search-management.yaml" endpoint="/search/management/v1/stores/{storeId}/rules/redirect/{ruleId}" method="PUT" >
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="updateRedirectRule.json"/>
    </request>
</api-endpoint>