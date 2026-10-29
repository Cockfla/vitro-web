This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Despliegue en Cloudflare Workers

Next.js corre en Workers con [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Configuración en `wrangler.jsonc` y `open-next.config.ts`.

En **Workers Builds** (Settings → Build) usar:

- Build command: `npm run build:cf`
- Deploy command: `npx wrangler deploy`

Variable de build (Settings → Variables and Secrets → *Build*): `NEXT_PUBLIC_SITE_URL` con el dominio público (p. ej. `https://tudominio.cl`), usada para canonical, Open Graph y sitemap.

Probar en local con el runtime real de Workers (necesario para `/api/radio`):

```bash
npm run preview
```
