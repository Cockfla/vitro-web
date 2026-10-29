# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Sitio de una sola página para la radio "El Vitrola de Chile": información del locutor, links a redes sociales y un reproductor de la transmisión en vivo. Next.js 15 (App Router) + React 19 + Tailwind CSS 3, en JavaScript (no TypeScript), desplegado en Cloudflare Workers con `@opennextjs/cloudflare`. Todo el copy de la UI está en español.

## Comandos

Package manager: **npm** (hay `package-lock.json`).

- `npm run dev` — servidor de desarrollo con Turbopack (http://localhost:3000). `/api/radio` responde 501 aquí (necesita `cloudflare:sockets`).
- `npm run preview` — build con OpenNext y servidor local en el runtime real de Workers (`wrangler dev`); aquí sí funciona `/api/radio`.
- `npm run deploy` — build + deploy a Cloudflare Workers (Workers Builds: build `npm run build`... ver README)
- `npm run build` / `npm start` — build y servidor de producción
- `npm run lint` — `next lint` (config flat en `eslint.config.mjs`, extiende `next/core-web-vitals`)

No hay framework de tests configurado, así que no existe `npm test`.

## Arquitectura

Proyecto muy pequeño; lo que hay que saber de un vistazo:

- [src/app/layout.js](src/app/layout.js) — layout raíz: fuentes Geist, metadata SEO, `viewport` (`viewportFit: "cover"`), `lang="es"`.
- [src/app/page.js](src/app/page.js) — Server Component con toda la página (hero con logo, reproductor, información, botones de contacto, footer) y el fondo fijo naranja/negro. Los links de redes sociales/WhatsApp/correo están hardcodeados aquí. Layout de una columna en móvil y dos en `lg`, con posiciones de grid explícitas (`lg:col-start-*`/`lg:row-start-*`).
- [src/components/LiveAudioPlayer.js](src/components/LiveAudioPlayer.js) — único Client Component (`"use client"`). Reproductor propio sobre `<audio>` nativo (sin librería) que apunta a `/api/radio`.
- [src/app/api/radio/route.js](src/app/api/radio/route.js) — proxy del stream. Abre un socket TLS (`cloudflare:sockets`) a `servers58.com` (Shoutcast v1) y reexpone el audio como una respuesta HTTP normal (`audio/mpeg`, `Accept-Ranges: none`, `no-store`).
- [src/app/globals.css](src/app/globals.css) — solo directivas de Tailwind y base de `html`/`body`. La paleta (`vitro` = `#fab043`) y las animaciones (`wave`, `drift`) están en [tailwind.config.mjs](tailwind.config.mjs).

Particularidades:

- **Stream en vivo / iOS:** el origen responde `ICY 200 OK` (no HTTP estándar) e ignora `Range`; Safari iOS no lo reproduce directo en un `<audio>` y `fetch` de Node tampoco lo parsea. Por eso **el `<audio>` nunca apunta al origen**: usa el proxy same-origin `/api/radio` (mismo enfoque que el repo `Elias-Pablo/radio-web`). No cambiar `STREAM_URL` a la URL de `servers58.com`.
- **Reproductor:** no pausa. `stop()` hace `pause()` + `removeAttribute("src")` + `load()`, y `start()` asigna `src` con un `?t=Date.now()` nuevo y llama `play()` de forma síncrona dentro del tap (requisito de iOS). Reanudar una conexión pausada deja audio viejo y en iOS no reanuda. No volver a un modelo pausa/reanuda ni a una librería con barra de progreso.
- **Reconexión:** la conexión del proxy puede cortarse en cualquier momento (red, límites de Workers). El player reconecta solo en `ended`/`error` (máx. 5 intentos seguidos). Al terminar el stream el navegador dispara `pause` antes de `ended`: `onPause` ignora ese caso (`audio.ended`), si no el player vuelve a idle en vez de reconectar.
- **Probar el audio localmente:** `npm run preview` (Workers reales). En esta máquina Edge/Chromium **no recibe** respuestas HTTP en claro sin fin desde `localhost`, así que el player puede verse "Conectando…" para siempre; `curl` sí ve el stream. Para probar en un navegador hay que servirlo por HTTPS o usar el preview de Cloudflare.
- `audio.volume` es de solo lectura en iOS: el slider solo se muestra si el navegador respeta el cambio. Hay integración con Media Session (pantalla de bloqueo).
- El alias `@/*` apunta a `./src/*` (`jsconfig.json`).
- `next.config.mjs` está vacío (sin dominios de imagen remotos); las imágenes son locales en `public/`.
- Mantener `next` en un parche vigente de la línea 15 (`@opennextjs/cloudflare` exige `>=15.5.28`) y revisar `npm audit`.
- Variable de build `NEXT_PUBLIC_SITE_URL` (dominio público): sin ella no se generan `canonical` ni sitemap.
