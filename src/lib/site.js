// Dominio público del sitio, definido en NEXT_PUBLIC_SITE_URL en el momento del
// build (p. ej. https://vitrola.cl). Sin él no se generan canonical ni sitemap
// con un dominio inventado.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
