# Autenticación

<card-summary>
Para el acceso seguro a todas las APIs
</card-summary>

Todas las APIs requieren autenticación mediante tokens JWT, excepto cuando se indique explícitamente lo contrario. El
sistema de autenticación soporta dos modalidades según las necesidades de integración de tu aplicación.

> **Nota:** Las operaciones de autenticación son gestionadas por el `IAM API`. Para información detallada sobre
> configuración, administración y funcionalidades avanzadas, consulta la [documentación específica](iam_service_api_reference.md)
> {style="note"}

## Tipos de Autenticación

### Autenticación Anónima {id="anonymous-auth"}

Genera un token sin requerir credenciales de usuario. Ideal para operaciones de lectura públicas como búsqueda de
productos, consulta de catálogo, carrito de compras.

### Autenticación de Usuario {id="user-auth"}

Requiere credenciales válidas para generar un token asociado a un usuario específico. Necesaria para operaciones que
involucran datos personales, gestión de perfil, métodos de pago, historial de órdenes.

## Formato del Token {id="token-format"}

Los tokens generados utilizan el estándar **JWT (JSON Web Token)** y deben incluirse en cada petición a través de la
cabecera `Authorization` con el formato Bearer:

```
Authorization: Bearer <jwt_token>
```

## Endpoints {id="authentication-endpoints"}

### Autenticación Anónima {id="anonymous-authentication"}

**Endpoint:** `POST /iam/v1/auth/anonymous`

Genera un token sin credenciales para acceso público limitado.

**Ejemplo de uso:**

```bash
curl -X POST "https://api.cord.pe/iam/v1/auth/anonymous" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Autenticación de Usuario {id="user-authentication"}

**Endpoint:** `POST /iam/v1/auth`

Genera un token asociado a un usuario mediante credenciales válidas.

**Ejemplo de uso:**

```bash
curl -X POST "https://api.cord.pe/iam/v1/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario@empresa.com",
    "password": "mi_password_seguro"
  }'
```

**Respuesta esperada:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user_id": "12345",
  "username": "usuario@empresa.com"
}
```

## Uso del Token {id="using-jwt-tokens"}

Una vez obtenido el token, inclúyelo en todas las peticiones posteriores:

```bash
curl -X GET "https://api.cord.pe/v2/catalog" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

## Consideraciones {id="auth-considerations"}

- **Expiración**: Los tokens tienen un tiempo de vida limitado (verificar campo `expires_in`)
- **Renovación**: Implementa lógica para renovar tokens antes de su expiración
- **Almacenamiento**: Almacena los tokens de manera segura en tu aplicación
- **HTTPS**: Siempre utiliza HTTPS en entornos de producción

## Flujo de Integración {id="integration-flow"}

1. **Desarrollo/Testing**: Utiliza autenticación anónima para pruebas de endpoints públicos
2. **Funcionalidades de Usuario**: Implementa autenticación de usuario para operaciones específicas
3. **Manejo de Errores**: Implementa renovación automática de tokens en caso de expiración
4. **Producción**: Configura almacenamiento seguro de credenciales y tokens
