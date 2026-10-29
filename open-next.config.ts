import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `npm run build` ejecuta el build de OpenNext (que es lo que necesita
// `wrangler deploy`), así que OpenNext debe llamar a `next build` directamente
// y no volver a `npm run build`.
export default {
  ...defineCloudflareConfig(),
  buildCommand: "npx next build",
};
