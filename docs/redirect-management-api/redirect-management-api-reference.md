# Gestión de Redirecciones

La **API de Redirecciones** permite al equipo de contenido configurar y administrar reglas de redirección para cada tienda en la plataforma Ecommerce.  
Las reglas controlan cómo se redirigen ciertas URLs hacia otras, dentro de un rango de tiempo definido y con el código HTTP apropiado para SEO (**301** o **302**).


## Crear regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="create-redirect-rule"}

<api-endpoint openapi-path="redirect-management.yaml" endpoint="/cms/stores/{storeId}/redirects" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="JSON" src="createRedirectRule.json"/>
    </request>
    <response type="201">
        <description>Regla de redirección creada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
              "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
            }
        </sample>
    </response>
</api-endpoint>

## Listar todas las reglas de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="list-redirect-rules"}

<api-endpoint openapi-path="redirect-management.yaml" endpoint="/cms/stores/{storeId}/redirects" method="GET">
</api-endpoint>

## Obtener regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="get-redirect-rules"}

<api-endpoint openapi-path="redirect-management.yaml" endpoint="/stores/{storeId}/redirects/{id}" method="GET">
</api-endpoint>


## Actualiza regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="update-redirect-rules"}

<api-endpoint openapi-path="redirect-management.yaml" endpoint="/stores/{storeId}/redirects/{id}" method="PUT">
</api-endpoint>

## Elimina regla de redirección <format style="superscript" color="Yellow">(proposed)</format> {id="delete-redirect-rules"}

<api-endpoint openapi-path="redirect-management.yaml" endpoint="/stores/{storeId}/redirects/{id}" method="DELETE">
</api-endpoint>