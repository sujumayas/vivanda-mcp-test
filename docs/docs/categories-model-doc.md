# Categorías de Producto

<card-summary>
Describe el modelo de dominio para el sistema de categorías, incluyendo su estructura, reglas de negocio y casos de uso principales.
</card-summary>

Una categoría agrupa productos basándose en características o propiedades comunes. Las categorías permiten:

* Organizar productos de manera jerárquica
* Facilitar la navegación y búsqueda para los usuarios
* Establecer relaciones lógicas entre grupos de productos
* Aplicar propiedades o comportamientos comunes a conjuntos de productos

## Estructura Jerárquica {id="category-hierarchy"}

El sistema de categorías está organizado en una estructura de árbol con hasta cuatro niveles de profundidad. Cada
categoría **puede tener una categoría padre** (excepto las de nivel raíz) y **múltiples categorías hijas**.

<code-block lang="plantuml" src="../../puml/category-hierarchy-tree.puml"/>

Basado en su posición en la jerarquía, las categorías se clasifican en:

### Categorías de Nivel Raíz (Root-Level) {id="root-level-category"}

* No tienen un padre
* Representan las clasificaciones principales del sistema
* Pueden tener múltiples categorías hijas

### Categorías de Nivel Intermedio (Middle-Level) {id="middle-level-category"}

* Tienen un padre y al menos un hijo
* Sirven como nodos de conexión en la jerarquía
* Refinan la clasificación de las categorías superiores

### Categorías de Nivel Hoja (Leaf-Level) {id="leaf-level-category"}

* Tienen un padre, pero no tienen hijos
* Son las únicas que pueden tener productos asignados directamente
* Representan la clasificación más específica en la jerarquía

## Reglas de Negocio {id="category-business-rules"}

El sistema de categorías está sujeto a las siguientes reglas de negocio:

**1. Asignación de Productos**

* Únicamente las categorías de nivel hoja (leaf-level) pueden tener productos asignados directamente
* Si una categoría tiene productos asociados, no puede tener categorías hijas

**2. Estructura Jerárquica**

* La profundidad máxima de la jerarquía es de cuatro niveles (0-3)
* Toda categoría, excepto las de nivel raíz, debe tener exactamente una categoría padre
* Una categoría puede tener múltiples categorías hijas, siempre que no tenga productos asignados

**3. Nombre Completo (fullname) Unico**

* El nombre completo de una categoria debe ser unico.
* No puede existir ninguna otra categoria con exactamente el mismo nombre completo que otra.

**4. Estructura de Permalinks**

* El permalink de una categoría será generado a partir de su nombre completo si no es recibo como parte del request
* Los permalinks serán cadenas de textos en los que solo se admite caracteres alfanuméricos y guiones medios.
* En situaciones de actualización de permalink en categorías que se encuentren dentro de un árbol de jerarquía el impacto de dicha actualización afectara a:
  * La sección de permalink correspondiente a la categoría en cuestión.
  * La actualización del permalink será propagada de forma descendiente en la jerarquía a través de sus categorías hijas.

**5. Integridad Referencial**

> Al eliminar una categoría, se debe decidir si:
> {style="warning"}

* Eliminar también sus categorías hijas (cascada)
* Mover sus categorías hijas a otra categoría
* Rechazar la eliminación si tiene elementos dependientes

<code-block lang="plantuml" src="../../puml/category-business-rules.puml"/>

## Modelo {id="category-model"}

<code-block lang="plantuml" src="../../puml/category-domain-model.puml"/>

El diagrama anterior representa el modelo conceptual de categorías.

Proporciona una estructura jerárquica flexible y rica en metadatos. Los atributos se organizan en cuatro grupos
funcionales:

### Identificación {id="category-identification-attributes"}

| Atributo     | Tipo   | Descripción                                                                                                                   |
|--------------|--------|-------------------------------------------------------------------------------------------------------------------------------|
| `id`         | UUID   | Identificador único universal que sirve como clave primaria inmutable para la categoría en el sistema.                        |
| `externalId` | String | Identificador externo que permite la integración con sistemas de terceros, facilitando la sincronización e interoperabilidad. |

### Presentación {id="category-presentation-attributes"}

| Atributo              | Tipo   | Descripción                                                                                        |
|-----------------------|--------|----------------------------------------------------------------------------------------------------|
| `shortName`           | String | Nombre corto utilizado en espacios con restricciones de visualización (menús, breadcrumbs, etc.).  |
| `fullName`            | String | Nombre completo y descriptivo de la categoría.                                                     |
| `description`         | String | Texto detallado que describe el propósito y contenido de la categoría.                             |
| `deeplinkDescription` | String | Permite incluir una descripción de la categoría en los links.                                      |
| `colorHex`            | String | Código de color hexadecimal para representación visual de la categoría en interfaces gráficas.     |
| `imageUrl`            | URI    | URI que referencia una imagen representativa de la categoría.                                      |
| `ordinalNumber`       | int    | Número entero que determina el orden de visualización respecto a otras categorías del mismo nivel. |

### Indexación & SEO {id="category-indexing-attributes"}

| Atributo          | Tipo    | Descripción                                                                                                                                                                                                             |
|-------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `keywords`        | String  | Palabras clave relevantes que mejoran la descubribilidad de la categoría en búsquedas.                                                                                                                                  |
| `enabled`         | boolean | Bandera booleana que indica si la categoría está activa y debe ser incluida en resultados de búsqueda.                                                                                                                  |
| `metaTitle`       | String  | Título optimizado para SEO, utilizado en etiquetas meta de HTML.                                                                                                                                                        |
| `metaDescription` | String  | Descripción optimizada para SEO, utilizada en etiquetas meta de HTML.                                                                                                                                                   |
| `permalink`       | String  | URL amigable identifica la categoría en el sistema web. Restrigido a cadenas de texto ASCII en [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).<br/> Expresión regular: `^[a-z][a-z\-0-9]*$` |

### Relaciones {id="category-relations"}

| Atributo        | Tipo            | Descripción                                                                                                            |
|-----------------|-----------------|------------------------------------------------------------------------------------------------------------------------|
| `parent`        | Category        | Referencia a la categoría padre, nula para categorías de nivel raíz.                                                   |
| `level`         | int             | Número entero que indica la profundidad de la categoría en la jerarquía (0 para raíz, 1-3 para niveles subsiguientes). |
| `childrenCount` | int             | Contador de categorías hijas directas, optimiza consultas sin necesidad de cargar la colección completa.               |
| `children`      | Set of Category | Colección de referencias a las categorías hijas directas.                                                              |
| `productsCount` | int             | Contador de productos asociados directamente a la categoría, optimiza consultas y validaciones.                        |

### Consideraciones Técnicas {id="category-technical-considerations"}

El diseño del modelo de categorías tiene en cuenta varios aspectos técnicos importantes:

1. **Desnormalización controlada**: Atributos como `childrenCount` y `productsCount` representan una desnormalización
   estratégica para optimizar consultas frecuentes sin cargar colecciones completas.

2. **Características SEO incorporadas**: Los campos de metadatos permiten una gestión efectiva del SEO directamente
   desde el modelo de dominio.

3. **Flexibilidad visual**: La separación entre atributos funcionales y de presentación permite personalizar la
   apariencia sin afectar la lógica de negocio.

## Operaciones {id="category-operations"}

La gestión de categorías comprende diversas operaciones que permiten crear, modificar, consultar y eliminar elementos en
la estructura jerárquica. Para acceder a la documentación detallada de todas las operaciones disponibles, por favor
consulte el [API Reference de Categorías](categories-management-api_reference.md), donde encontrará:

* Descripción completa de cada endpoint
* Parámetros requeridos y opcionales
* Formato de solicitudes y respuestas
* Códigos de estado y manejo de errores
* Ejemplos de uso