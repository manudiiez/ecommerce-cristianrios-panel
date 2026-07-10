# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## API de la tienda "Hanna · Yesos y Aromas"

Backend headless para un frontend Next.js en otro repositorio. No hay pasarela de pagos: `orders` solo captura contacto + snapshot del carrito.

### Colecciones y global

`worlds`, `categories`, `sizes`, `finishes`, `products`, `whatsapp-items`, `kits`, `flash-deals`, `orders` (colecciones) y `store` (global). Catálogo: lectura pública, escritura solo admin. `orders`: creación pública (checkout), lectura/edición solo admin.

### Filtros en `GET /api/products`

Usan el `where` estándar de Payload (query params):

- Por categoría: `?where[category][equals]=<id>`
- Por mundo: `?where[world][equals]=<id>`
- Por tamaño (al menos uno de la lista): `?where[availableSizes][in][]=<id1>&where[availableSizes][in][]=<id2>`
- Solo con descuento: `?where[discount.pct][exists]=true`
- Paginación/orden: `?limit=12&page=2&sort=-createdAt` (defaults de Payload)

### Endpoints custom

- `GET /api/flash-deals/soonest` → la oferta relámpago con `endsAt` futuro más próximo, o `null` si no hay ninguna vigente. `endsAt` se expone como timestamp epoch ms (number). `variantGroups` describe los ejes de variación (ej. Talla, Color) con sus valores; el frontend arma las combinaciones (S + Negra, M + Blanca, etc.), no vienen pre-generadas por la API. No afectan el precio.
- `GET /api/products/:slug/related?limit=4` → productos relacionados: primero de la misma categoría, completando con productos del mismo mundo si no alcanza el límite.
- `POST /api/pricing/quote` → body `{ productSlug, sizeSlug, finishSlug }`, responde `{ price, was? }` con el precio calculado server-side (`was` solo si hay descuento aplicado).

### Variables de entorno de email

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` — usadas para notificar a la dueña (`store.email`) cuando entra un pedido nuevo. Sin `SMTP_HOST` configurado, el envío se omite (se loguea el error) sin bloquear la creación del pedido.

### Seed

`pnpm seed` carga datos placeholder idempotentes (upsert por slug/nombre): 2 mundos, categorías, tamaños, acabados, 24 productos, kits, ofertas relámpago e ítems de WhatsApp. Se puede correr varias veces sin duplicar.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
