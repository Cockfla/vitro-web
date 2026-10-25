# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Sitio de una sola página para la radio "El Vitrola de Chile": información del locutor, links a redes sociales y un reproductor de la transmisión en vivo. Next.js 15 (App Router) + React 19 + Tailwind CSS 3, en JavaScript (no TypeScript). Todo el copy de la UI está en español.

## Comandos

Package manager: **npm** (hay `package-lock.json`).

- `npm run dev` — servidor de desarrollo con Turbopack (http://localhost:3000)
- `npm run build` / `npm start` — build y servidor de producción
- `npm run lint` — `next lint` (config flat en `eslint.config.mjs`, extiende `next/core-web-vitals`)

No hay framework de tests configurado, así que no existe `npm test`.

## Arquitectura

Proyecto muy pequeño; lo que hay que saber de un vistazo:

- [src/app/layout.js](src/app/layout.js) — layout raíz: fuentes Geist, metadata SEO, `viewport` (`viewportFit: "cover"`), `<Analytics />` de `@vercel/analytics`. `lang="es"`.
- [src/app/page.js](src/app/page.js) — Server Component con toda la página (hero con logo, reproductor, información, botones de contacto, footer) y el fondo fijo naranja/negro. Los links de redes sociales/WhatsApp/correo están hardcodeados aquí. Layout de una columna en móvil y dos en `lg`, con posiciones de grid explícitas (`lg:col-start-*`/`lg:row-start-*`).
- [src/components/LiveAudioPlayer.js](src/components/LiveAudioPlayer.js) — único Client Component (`"use client"`). Reproductor propio sobre `<audio>` nativo (sin librería) apuntando al stream Shoutcast v1 en `servers58.com`.
- [src/app/globals.css](src/app/globals.css) — solo directivas de Tailwind y base de `html`/`body`. La paleta (`vitro` = `#fab043`) y las animaciones (`wave`, `drift`) están en [tailwind.config.mjs](tailwind.config.mjs).

Particularidades:

- **Stream en vivo / iOS:** el stream responde `ICY 200 OK` (no HTTP estándar) e ignora `Range`. Por eso el reproductor no pausa: `stop()` hace `pause()` + `removeAttribute("src")` + `load()`, y `start()` asigna `src` con un `&t=Date.now()` nuevo y llama `play()` de forma síncrona dentro del tap (requisito de iOS). Reanudar una conexión pausada deja audio viejo y en iOS no reanuda. No volver a un modelo pausa/reanuda ni a una librería con barra de progreso.
- `audio.volume` es de solo lectura en iOS: el slider solo se muestra si el navegador respeta el cambio. Hay integración con Media Session (pantalla de bloqueo).
- El alias `@/*` apunta a `./src/*` (`jsconfig.json`).
- `next.config.mjs` está vacío (sin dominios de imagen remotos); las imágenes son locales en `public/`.
- `npm run lint` (`next lint`) falla con "Cannot serialize key "parse" in parser" por la config flat de ESLint; no es por el código. Usar `npx eslint src`.
