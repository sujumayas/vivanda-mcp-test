---
lang: es
---

# Sucursales

## Buscar Sucursales por geolocalizacion <format style="superscript" color="Blue">(Desplegado DEV)</format>

<api-endpoint openapi-path="branch.yaml" endpoint="/qry/catalog/v3/store-subsidiaries/location" method="GET">
  <response type="200">
    <description>OK</description>
    <content-type>application/json</content-type>
    <sample lang="JSON" src="getStoreBranchSearchByLocationList.json"/>
  </response>
  <response type="400">
    <description>Bad Request</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="branchesErrorResponsesSamples.json" include-lines="2-6"/>
  </response>
  <response type="404">
    <description>Not Found</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="branchesErrorResponsesSamples.json" include-lines="8-12"/>
  </response>
  <response type="500">
    <description>Internal Server Error</description>
    <content-type>application/json</content-type>
    <sample lang="json" src="branchesErrorResponsesSamples.json" include-lines="14-18"/>
  </response>
</api-endpoint>