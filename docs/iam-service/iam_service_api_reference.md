# IAM Service

<card-summary>
El servicio de gestión de identidad y autenticación (IAM) permite la creación, verificación y administración de usuarios, así como la autenticación sin contraseña mediante OTP y enlaces mágicos. También soporta la gestión de sesiones anónimas y la renovación de tokens de acceso.
</card-summary>

Este servicio ofrece funcionalidades clave para la autenticación de usuarios, incluyendo el registro, inicio y cierre de
sesión, la recuperación de contraseñas y la creación de sesiones anónimas. Utiliza métodos como OTP (One Time Password)
y Magic Link para facilitar el acceso sin necesidad de contraseñas, mejorando la seguridad y la experiencia del usuario.
Además, permite la gestión de tokens de acceso y refresco para mantener las sesiones activas.

## Iniciar OTP por email (passwordless) <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="otp-start"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/passwordless/email-otp/start" method="POST">
    <response type="200">
        <description>OTP iniciado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Verificar OTP por email (passwordless) <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="otp-verify"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/passwordless/email-otp/verify" method="POST">
    <response type="200">
        <description>OTP verificado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Iniciar Magic Link (passwordless) <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="magiclink-start"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/passwordless/magic-link/start" method="POST">
    <response type="200">
        <description>Magic Link enviado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Verificar Magic Link (passwordless) <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="magiclink-verify"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/passwordless/magic-link/verify" method="POST">
    <response type="200">
        <description>Enlace verificado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Iniciar sesión <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-login"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/login" method="POST">
    <response type="200">
        <description>Sesión iniciada correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Cerrar sesión <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-logout"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/logout" method="POST">
    <response type="204">
        <description>Sesión cerrada correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Refrescar token de sesión <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-refresh-token"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/refresh-token" method="POST">
    <response type="200">
        <description>Token refrescado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Enviar correo para reset de contraseña <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-reset-password"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/reset-password" method="POST">
    <response type="200">
        <description>Correo enviado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Registrar usuario <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-register"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/register" method="POST">
    <response type="200">
        <description>Usuario creado correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>

## Crear sesión anónima <format style="superscript" color="Blue">(Desplegado en DEV)</format> {id="auth-anonymous"}

<api-endpoint openapi-path="iam-service.yaml" endpoint="/api/auth/anonymous" method="POST">
    <response type="200">
        <description>Sesión anónima creada correctamente</description>
        <content-type>application/json</content-type>
    </response>
</api-endpoint>