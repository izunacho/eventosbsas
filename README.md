# EventosBsAs

Agenda cultural de Buenos Aires (Capital Federal): eventos, recitales, teatro, arte, cine y mas, con mapa interactivo, filtros y links a entradas oficiales.

Sitio: https://izunacho.github.io/eventosbsas/

## Estructura del proyecto

```
index.html                          Toda la app (HTML + CSS + JS), sin build ni dependencias de npm
data/events.json                    Listado de eventos
data/lugares.json                   Listado de lugares culturales (teatros, museos, centros culturales, etc.)
assets/og-image.png                 Imagen usada para las previsualizaciones al compartir el link (og:image / twitter:image)
scripts/prune-events.js             Elimina de data/events.json los eventos ya finalizados
.github/workflows/prune-events.yml  Corre prune-events.js todos los dias y commitea el resultado
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

## Eliminacion automatica de eventos finalizados

El workflow `.github/workflows/prune-events.yml` corre todos los dias a las 03:00 (Argentina) y ejecuta `scripts/prune-events.js`, que borra de `data/events.json` los eventos cuyo `dateEnd` ya paso, commiteando el cambio solo si hubo algo para eliminar. Ademas, la pagina misma deja de mostrar un evento en cuanto termina (no espera a que corra el workflow).

Para que el workflow pueda commitear, el repo necesita permisos de escritura para Actions: **Settings → Actions → General → Workflow permissions → "Read and write permissions"**.

Se puede correr manualmente en cualquier momento con:

```bash
node scripts/prune-events.js
```

## Notas / pendientes conocidos

- **Alta de eventos nuevos**: sigue siendo manual. La mayoria de los ~36 lugares no tiene una API o RSS publico, asi que no hay forma confiable de "vigilarlos" automaticamente sin construir un scraper por lugar (fragil, y riesgoso publicar sin revision datos reales de fechas/precios/entradas). Hay que seguir cargando eventos a mano en `data/events.json` a medida que se anuncian.
- **SRI del CDN de Leaflet**: `index.html` carga Leaflet desde cdnjs sin atributo `integrity`. No se pudo generar el hash SRI porque el entorno de desarrollo usado no tenia salida de red hacia cdnjs/jsdelivr/unpkg. Antes de agregarlo, generar el hash real (por ejemplo con https://www.srihash.org/) para no romper la carga del mapa con un hash incorrecto.
- No hay build ni tests automatizados; los cambios se verifican manualmente sirviendo el archivo en local.
