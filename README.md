# EventosBsAs

Mapa interactivo de lugares culturales de Buenos Aires (Capital Federal): teatros, museos, centros culturales, estadios, galerias y jazz clubs, cada uno con link directo a su sitio oficial para ver su cartelera y comprar entradas.

Sitio: https://izunacho.github.io/eventosbsas/

## Estructura del proyecto

```
index.html               Toda la app (HTML + CSS + JS), sin build ni dependencias de npm
data/lugares.json         Listado de lugares culturales (teatros, museos, centros culturales, etc.)
manifest.webmanifest      Manifiesto PWA (nombre, iconos, colores) que permite instalar la app
sw.js                     Service worker: cachea la app para que funcione sin conexion
assets/icon-*.png         Iconos de la app instalada (192, 512 y 512 maskable)
assets/og-image.png       Imagen para las previsualizaciones al compartir el link (og:image / twitter:image)
robots.txt
sitemap.xml
```

`index.html` carga `data/lugares.json` de forma asincrona (`fetch`) al iniciar. Por eso **no funciona abriendo el archivo directamente con `file://`** — necesita servirse por http.

## Correr en local

Cualquier servidor estatico simple alcanza, por ejemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/index.html
```

## Como agregar o actualizar un lugar

Editar `data/lugares.json` y agregar/modificar un objeto con estos campos:

| Campo | Descripcion |
|---|---|
| `id` | Slug unico (ej: `teatro-colon`). |
| `name` | Nombre del lugar. |
| `addr` | Direccion. |
| `barrio` | Barrio. |
| `tipo` | Uno de: `museo`, `teatro`, `centro cultural`, `estadio`, `galeria`, `jazz club`. Define el color del marcador en el mapa. |
| `emoji` | Emoji que se muestra en la tarjeta y en el marcador del mapa. |
| `grad` | Gradiente CSS de fondo para la tarjeta (ej: `"linear-gradient(135deg,#d4af37,#b8860b)"`). |
| `lat` / `lng` | Coordenadas. |
| `link` | Sitio oficial del lugar (a donde se manda al usuario para ver su cartelera y comprar entradas). |

## Diseño

El mapa es la pantalla principal. Cada lugar es un marcador coloreado segun su `tipo`; al hacer click muestra nombre, direccion, un boton "Ver cartelera y entradas" (va al `link` oficial del lugar) y un boton "Como llegar" (Google Maps / Apple Maps / Waze). La seccion "Lugares" ofrece la misma informacion en formato grilla, con busqueda y filtro por tipo.

La pagina no muestra una agenda de eventos propia: cada lugar es responsable de su propia cartelera, y el sitio solo linkea hacia ella.

## App instalable (PWA)

El sitio es una PWA: se puede instalar en el celular o en la computadora y abrirse en su propia ventana, sin barra del navegador. La seccion **Info** explica los pasos para Android, iPhone/iPad y computadora, y muestra un boton **Instalar app** cuando el navegador soporta instalacion directa (Chrome/Edge; en iOS hay que usar "Agregar a inicio" desde Safari).

`sw.js` cachea la app con estrategia **network-first**: mientras hay conexion siempre se sirve la version fresca de la red, y el cache solo entra como respaldo si no hay red. Asi la app abre offline sin riesgo de quedar mostrando datos viejos.

Si se cambia la estructura de archivos precacheados, conviene subir la version del cache (`const CACHE = 'eventosbsas-v1'` en `sw.js`) para que los service workers ya instalados descarten el cache anterior.

Requisitos: la instalacion solo funciona sobre **HTTPS** (GitHub Pages ya lo cumple) o en `localhost`.

## Notas / pendientes conocidos

- **SRI del CDN de Leaflet**: `index.html` carga Leaflet desde cdnjs sin atributo `integrity`. No se pudo generar el hash SRI porque el entorno de desarrollo usado no tenia salida de red hacia cdnjs/jsdelivr/unpkg. Antes de agregarlo, generar el hash real (por ejemplo con https://www.srihash.org/) para no romper la carga del mapa con un hash incorrecto.
- No hay build ni tests automatizados; los cambios se verifican manualmente sirviendo el archivo en local.
