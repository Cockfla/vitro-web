// Dominio público del sitio: NEXT_PUBLIC_SITE_URL, o el dominio de producción
// que Vercel expone, o localhost en desarrollo.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
