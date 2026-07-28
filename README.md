# EventosBsAs

Agenda cultural de Buenos Aires (Capital Federal): eventos, recitales, teatro, arte, cine y mas, con mapa interactivo, filtros y links a entradas oficiales.

Sitio: https://izunacho.github.io/eventosbsas/

## Estructura del proyecto

```
index.html          Toda la app (HTML + CSS + JS), sin build ni dependencias de npm
data/events.json     Listado de eventos
data/lugares.json    Listado de lugares culturales (teatros, museos, centros culturales, etc.)
assets/og-image.png  Imagen usada para las previsualizaciones al compartir el link (og:image / twitter:image)
robots.txt
sitemap.xml
```

`index.html` carga `data/events.json` y `data/lugares.json` de forma asincrona (`fetch`) al iniciar. Por eso **no funciona abriendo el archivo directamente con `file://`** — necesita servirse por http.

## Correr en local

Cualquier servidor estatico simple alcanza, por ejemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000/index.html
```

## Como agregar o actualizar un evento

Editar `data/events.json` y agregar un objeto con estos campos:

| Campo | Descripcion |
|---|---|
| `id` | Numero unico. Usar el proximo disponible. |
| `venueId` | `id` del lugar en `data/lugares.json` si el evento ocurre en un lugar conocido, o `null` si es una direccion puntual (festival de un solo dia, etc). |
| `title` | Titulo del evento. |
| `cat` / `catLabel` | Categoria interna (`musica`, `teatro`, `arte`, `cine`, `literatura`, `gastronomia`, `festival`, `danza`) y su etiqueta visible. |
| `date` / `dateEnd` | Fecha de inicio y fin en formato `YYYY-MM-DD`. Para un evento de un solo dia, ambas son iguales. |
| `dateLabel` | Texto legible de la fecha, como se muestra en la tarjeta. |
| `time` | Horario legible. |
| `loc` / `addr` / `barrio` | Lugar, direccion y barrio. |
| `lat` / `lng` | Coordenadas (deben coincidir con las del lugar en `lugares.json` si `venueId` esta seteado). |
| `desc` | Descripcion. |
| `price` | Texto libre (`"Gratis"`, `"Gratis con reserva"`, `"Con entrada"`, etc). `"Gratis"` y `"Gratis con reserva"` se muestran con la etiqueta verde de gratuito. |
| `emoji` / `grad` | Emoji e imagen de fondo (gradiente CSS) de la tarjeta. |
| `link` / `linkLabel` | Link oficial de entradas/info y su texto. |

## Como agregar o actualizar un lugar

Editar `data/lugares.json`. Campos: `id` (slug unico, usado como `venueId` desde eventos), `name`, `addr`, `barrio`, `tipo` (`museo`, `teatro`, `centro cultural`, `estadio`, `galeria`, `jazz club`), `emoji`, `grad`, `lat`, `lng`, `link`.

## Notas / pendientes conocidos

- **Actualizacion de contenido**: los datos son estaticos. La pagina recalcula "Hoy/Manana/Finalizado" solo, pero **no agrega eventos nuevos por si sola** — hay que seguir cargando eventos a mano en `data/events.json` a medida que se anuncian.
- **SRI del CDN de Leaflet**: `index.html` carga Leaflet desde cdnjs sin atributo `integrity`. No se pudo generar el hash SRI porque el entorno de desarrollo usado no tenia salida de red hacia cdnjs/jsdelivr/unpkg. Antes de agregarlo, generar el hash real (por ejemplo con https://www.srihash.org/) para no romper la carga del mapa con un hash incorrecto.
- No hay build ni tests automatizados; los cambios se verifican manualmente sirviendo el archivo en local.
