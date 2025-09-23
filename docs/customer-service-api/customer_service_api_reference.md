# Customer Service

## Front - Endpoints

<card-summary>
Registrar, editar y obtener información de los usuarios.
</card-summary>

## Crear nuevo cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-crear-nuevo-cliente"}

Crea un nuevo cliente en el sistema.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/customer" method="POST">
    <response type="201">
        <description>Cliente creado exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "4162f6f7-22e6-4997-abd1-638a2b373a3f"
            }
        </sample>
    </response>
    <response type="400">
        <description>Datos inválidos</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "El campo 'email' debe tener un formato válido",
                "instance": "/api/v2/customers/profile",
                "properties": {
                    "code": "VALIDATION_EMAIL_FORMAT"
                }
            }
        </sample>
    </response>
    <response type="409">
        <description>El cliente ya existe (email o documento duplicado)</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 409,
                "detail": "Ya existe un cliente con ese email o documento",
                "instance": "/api/v2/customers/profile",
                "properties": {
                    "code": "DUPLICATE_CUSTOMER"
                }
            }
        </sample>
    </response>
    <response type="500">
        <description>Error interno del servidor</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/internal-error",
                "title": "Error interno",
                "status": 500,
                "detail": "Error inesperado en el servidor",
                "instance": "/api/v2/customers/profile",
                "properties": {
                    "code": "INTERNAL_SERVER_ERROR"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener lista de clientes <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-obtener-lista-clientes"}

Retorna una lista paginada de clientes con filtros opcionales.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/customer" method="GET">
    <response type="200">
        <description>Lista de clientes obtenida exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "page": {
                    "number": 2,
                    "size": 10,
                    "totalElements": 157,
                    "totalPages": 16,
                    "empty": false
                },
                "items": [
                    {
                        "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                        "email": "cliente@email.com",
                        "firstName": "Juan",
                        "lastName": "Pérez",
                        "urlPhoto": "https://cdn.miapp.com/perfiles/cliente123.jpg",
                        "status": "ACTIVE"
                    }
                ]
            }
        </sample>
    </response>
</api-endpoint>

## Obtener detalle del cliente por email <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-obtener-detalle-por-email"}

Retorna los datos completos de un cliente específico.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/profile/me" method="GET">
    <response type="200">
        <description>Cliente encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                "email": "cliente@email.com",
                "firstName": "Juan",
                "lastName": "Pérez",
                "birthDate": "1990-05-15",
                "gender": "M",
                "phone": "+51987654321",
                "segment": "Premium",
                "ruc": "20123456789",
                "legalName": "Mi Empresa SAC",
                "newsletter": true,
                "documentType": "DNI",
                "documentNumber": "12345678"
                "acceptToAdditionalDataUse": true,
                "acceptToShareDataWithIntercorp": true,
                "acceptTermsAndPrivacyPolicy": true,
                "legalPerson": false
            }
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró el cliente con el email proporcionado",
                "instance": "/customers/v2/profile/{email}",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Actualizar cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-actualizar-cliente"}

Actualiza los datos de un cliente existente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/profile/me" method="PUT">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "email": "cliente@email.com",
                "firstName": "Juan",
                "lastName": "Pérez",
                "birthDate": "1990-05-15",
                "gender": "M",
                "phone": "+51987654321",
                "segment": "Premium",
                "legalPerson": false,
                "ruc": "20123456789",
                "legalName": "Mi Empresa SAC",
                "documentType": "DNI",
                "documentNumber": "12345678",
                "newsletter": true,
                "acceptToAdditionalDataUse": true,
                "acceptToShareDataWithIntercorp": true,
                "acceptTermsAndPrivacyPolicy": true,
                "acceptedPurchaseTermsVersion": "v1.2",
                "urlPhoto": "https://cdn.miapp.com/perfiles/cliente123.jpg"
            }
        </sample>
    </request>
    <response type="200">
        <description>Customer profile successfully updated</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "email": "cliente@email.com",
                "firstName": "Juan",
                "lastName": "Pérez",
                "birthDate": "1990-05-15",
                "gender": "M",
                "phone": "+51987654321",
                "segment": "Premium",
                "legalPerson": false,
                "ruc": "20123456789",
                "legalName": "Mi Empresa SAC",
                "documentType": "DNI",
                "documentNumber": "12345678",
                "newsletter": true,
                "acceptToAdditionalDataUse": true,
                "acceptToShareDataWithIntercorp": true,
                "acceptTermsAndPrivacyPolicy": true,
                "acceptedPurchaseTermsVersion": "v1.2",
                "urlPhoto": "https://cdn.miapp.com/perfiles/cliente123.jpg"
            }
        </sample>
    </response>
    <response type="400">
        <description>Bad Request</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "El campo 'birthDate' no tiene un formato válido",
                "instance": "/customers/v2/profile/cliente@email.com",
                "properties": {
                    "code": "VALIDATION_BIRTHDATE_FORMAT"
                }
            }
        </sample>
    </response>
    <response type="404">
        <description>Not Found</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró el cliente para actualizar",
                "instance": "/customers/v2/profile/cliente@email.com",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Crear nueva dirección para cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-crear-direccion"}

Agrega una nueva dirección a un cliente existente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/me" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "country": "Perú",
                "state": "Lima",
                "province": "Lima",
                "district": "San Isidro",
                "street": "Av. Javier Prado",
                "streetNumber": "1234",
                "postalCode": "1234",
                "locationCode": "1234",
                "floor": "3B",
                "reference": "Frente al parque",
                "receiverName": "Carlos Pérez",
                "latitude": -12.0453,
                "longitude": -77.0301,
                "additionalInfo": "Tocar el timbre rojo"
            }
        </sample>
    </request>
    <response type="201">
        <description>Dirección creada exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "4162f6f7-22e6-4997-abd1-638a2b373a3f"
            }
        </sample>
    </response>
    <response type="400">
        <description>Datos inválidos</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "Fields are required",
                "instance": "/customers/v2/address/me",
                "properties": {
                    "code": "ADDRESS_VALIDATION_ERROR"
                }
            }
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Cliente no encontrado",
                "status": 404,
                "detail": "No se encontró un cliente con ese email",
                "instance": "/customers/v2/address/me",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener direcciones del cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-obtener-direcciones"}

Retorna todas las direcciones asociadas a un cliente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/me" method="GET">
    <response type="200">
        <description>Lista de direcciones del cliente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                {
                    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                    "country": "Perú",
                    "state": "Lima",
                    "province": "Lima",
                    "district": "San Isidro",
                    "street": "Av. Javier Prado",
                    "streetNumber": "1234",
                    "postalCode": "1234",
                    "locationCode": "1234",
                    "floor": "3B",
                    "reference": "Frente al parque",
                    "receiverName": "Carlos Pérez",
                    "latitude": -12.0453,
                    "longitude": -77.0301,
                    "additionalInfo": "Tocar el timbre rojo"
                }
            ]
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Cliente no encontrado",
                "status": 404,
                "detail": "No se encontró el cliente solicitado",
                "instance": "/customers/v2/address/{email}",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener dirección específica <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-obtener-direccion-especifica"}

Retorna una dirección específica de un cliente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/{addressId}/customer/me" method="GET">
    <response type="200">
        <description>Dirección encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
           {
               "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
               "country": "Perú",
               "state": "Lima",
               "province": "Lima",
               "district": "San Isidro",
               "street": "Av. Javier Prado",
               "streetNumber": "1234",
               "postalCode": "1234",
               "locationCode": "1234",
               "floor": "3B",
               "reference": "Frente al parque",
               "receiverName": "Carlos Pérez",
               "latitude": -12.0453,
               "longitude": -77.0301,
               "additionalInfo": "Tocar el timbre rojo"
           }
        </sample>
    </response>
    <response type="404">
        <description>Cliente o dirección no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Cliente o dirección no encontrada",
                "status": 404,
                "detail": "No se encontró la dirección con el ID y email proporcionado",
                "instance": "/customers/v2/address/{addressId}/customer/{email}",
                "properties": {
                    "code": "ADDRESS_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Actualizar dirección <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-actualizar-direccion"}

Actualiza una dirección existente de un cliente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/{addressId}/customer/me" method="PUT">
    <request>
        <content-type>application/json</content-type>
         <sample lang="json">
           {
               "country": "Perú",
               "state": "Lima",
               "province": "Lima",
               "district": "San Isidro",
               "street": "Av. Javier Prado",
               "streetNumber": "1234",
               "postalCode": "1234",
               "locationCode": "1234",
               "floor": "3B",
               "reference": "Frente al parque",
               "receiverName": "Carlos Pérez",
               "latitude": -12.0453,
               "longitude": -77.0301,
               "additionalInfo": "Tocar el timbre rojo"
           }
        </sample>
    </request>
    <response type="204">
        <description>Address successfully updated</description>
        <content-type>application/json</content-type>
    </response>
    <response type="400">
        <description>Bad Request</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "Faltan campos obligatorios o datos inválidos",
                "instance": "/customers/v2/address/{addressId}/customer/{email}",
                "properties": {
                    "code": "ADDRESS_VALIDATION_ERROR"
                }
            }
        </sample>
    </response>
    <response type="404">
        <description>Not Found</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "No encontrado",
                "status": 404,
                "detail": "No se encontró la dirección a actualizar",
                "instance": "/customers/v2/address/{addressId}/customer/{email}",
                "properties": {
                    "code": "ADDRESS_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Eliminar dirección <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-eliminar-direccion"}

Elimina una dirección específica de un cliente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/{addressId}/customer/me" method="DELETE">
    <response type="204">
        <description>Dirección eliminada exitosamente</description>
        <content-type>application/json</content-type>
    </response>
    <response type="404">
        <description>Cliente o dirección no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "No encontrado",
                "status": 404,
                "detail": "No se encontró la dirección a eliminar",
                "instance": "/customers/v2/address/{addressId}/customer/{email}",
                "properties": {
                    "code": "ADDRESS_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Suscribe email a newsletter <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="newsletter-suscribir-email"}

Registra un email para el envío de newsletter.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/newsletter" method="POST">
    <request>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "email": "usuario@example.com"
            }
        </sample>
    </request>
    <response type="201">
        <description>Email suscrito al newsletter exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "success": true,
                "message": "Email suscrito al newsletter exitosamente",
                "email": "usuario@example.com"
            }
        </sample>
    </response>
    <response type="400">
        <description>Datos inválidos</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/validation-error",
                "title": "Error de validación",
                "status": 400,
                "detail": "El email ingresado no es válido",
                "instance": "/customers/v2/newsletter",
                "properties": {
                    "code": "INVALID_EMAIL"
                }
            }
        </sample>
    </response>
    <response type="409">
        <description>Email ya suscrito</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/conflict",
                "title": "Conflicto",
                "status": 409,
                "detail": "El email ya se encuentra suscrito al newsletter",
                "instance": "/customers/v2/newsletter",
                "properties": {
                    "code": "EMAIL_ALREADY_SUBSCRIBED"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener direcciones encriptadas del cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="addresses-obtener-direcciones-encriptadas"}

Retorna todas las direcciones asociadas a un cliente, con los datos parcialmente ofuscados.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/obfuscate/{email}" method="GET">
    <response type="200">
        <description>Lista de direcciones del cliente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            [
                {
                    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                    "country": "Pe***",
                    "state": "Li***",
                    "province": "Li***",
                    "district": "San ***",
                    "street": "Av. Ja***",
                    "streetNumber": "12**",
                    "floor": "3*",
                    "reference": "Frent***",
                    "receiverName": "Car*** Pé***",
                    "latitude": -12.0453,
                    "longitude": -77.0301
                }
            ]
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Cliente no encontrado",
                "status": 404,
                "detail": "No se encontró el cliente solicitado",
                "instance": "/customers/v2/address/obfuscate/{email}",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener ubigeos

Obtener ubigeos

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/addresses/ubigeos" method="GET"/>

## Suscribir correo a newsletter {id="leads-suscribir-correo"}

Suscribe un email al newsletter para el envío de comunicaciones periódicas.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/leads/subscribe" method="POST">
    <summary>Suscribe email a newsletter</summary>
    <description>Registra un email para el envío de newsletter</description>
    <tags>
        <tag>Newsletter</tag>
    </tags>
    <requestBody required="true">
        <content-type>application/json</content-type>
        <schema>
            <ref>customer-service-schemas.yaml#/components/schemas/SubscribeLeadRequest</ref>
        </schema>
    </requestBody>
    <response type="200">
        <description>Email suscrito al newsletter exitosamente</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "status": "success",
                "message": "Email suscrito al newsletter exitosamente"
            }
        </sample>
    </response>
    <response type="400">
        <description>Datos inválidos</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/invalid-data",
                "title": "Datos inválidos",
                "status": 400,
                "detail": "El formato del correo electrónico no es válido",
                "instance": "/customers/v2/leads/subscribe",
                "properties": {
                    "code": "INVALID_EMAIL_FORMAT"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Checkout - Endpoints

## Obtener detalle del cliente por id <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-obtener-detalle-por-id"}

Retorna los datos completos de un cliente específico.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/profile/{customerId}" method="GET">
    <response type="200">
        <description>Cliente encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                "email": "cliente@email.com",
                "firstName": "Juan",
                "lastName": "Pérez",
                "birthDate": "1990-05-15",
                "gender": "M",
                "phone": "+51987654321",
                "segment": "Premium",
                "ruc": "20123456789",
                "legalName": "Mi Empresa SAC",
                "newsletter": true,
                "documentType": "DNI",
                "documentNumber": "12345678",
                "acceptToAdditionalDataUse": true,
                "acceptToShareDataWithIntercorp": true,
                "acceptTermsAndPrivacyPolicy": true,
                "legalPerson": false
            }
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró el cliente con el ID proporcionado",
                "instance": "/customers/v2/profile/{customerId}",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener detalle del cliente por email <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-obtener-detalle-por-email-path"}

Retorna los datos completos de un cliente específico.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/profile/email/{email}" method="GET">
    <response type="200">
        <description>Cliente encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
                "email": "cliente@email.com",
                "firstName": "Juan",
                "lastName": "Pérez",
                "birthDate": "1990-05-15",
                "gender": "M",
                "phone": "+51987654321",
                "segment": "Premium",
                "ruc": "20123456789",
                "legalName": "Mi Empresa SAC",
                "newsletter": true,
                "documentType": "DNI",
                "documentNumber": "12345678",
                "acceptToAdditionalDataUse": true,
                "acceptToShareDataWithIntercorp": true,
                "acceptTermsAndPrivacyPolicy": true,
                "legalPerson": false
            }
        </sample>
    </response>
    <response type="404">
        <description>Cliente no encontrado</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró el cliente con el email proporcionado",
                "instance": "/customers/v2/profile/email/{email}",
                "properties": {
                    "code": "CUSTOMER_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>

## Obtener dirección específica de un cliente <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="customers-obtener-direccion-por-id"}

Retorna una dirección específica de un cliente.

<api-endpoint openapi-path="customer-service-v1.yaml" endpoint="/customers/v2/address/{addressId}/customer/{customerId}" method="GET">
    <response type="200">
        <description>Dirección encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "id": "2-rAkUp8UAY",
                "country": "Perú",
                "state": "Lima",
                "province": "Lima",
                "district": "San Isidro",
                "street": "Av. Javier Prado",
                "locationCode": "LC12345",
                "postalCode": "15074",
                "streetNumber": "1234",
                "floor": "3B",
                "reference": "Frente al parque",
                "receiverName": "Carlos Pérez",
                "latitude": -12.0453,
                "longitude": -77.0301,
                "additionalInfo": "Tocar el timbre rojo"
            }
        </sample>
    </response>
    <response type="404">
        <description>Cliente o dirección no encontrada</description>
        <content-type>application/json</content-type>
        <sample lang="json">
            {
                "type": "https://api.example.com/problems/not-found",
                "title": "Not found",
                "status": 404,
                "detail": "No se encontró la dirección para el cliente con el ID proporcionado",
                "instance": "/customers/v2/address/{addressId}/customer/{customerId}",
                "properties": {
                    "code": "ADDRESS_NOT_FOUND"
                }
            }
        </sample>
    </response>
</api-endpoint>


