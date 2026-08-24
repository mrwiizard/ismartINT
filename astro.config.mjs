// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // The build emits directory-style pages (/business/index.html). Linking to
  // them WITHOUT the trailing slash makes the server issue a 301 to add it —
  // and a server that does not know its public hostname builds that redirect
  // from its own IP, which is unreachable from outside. Declaring the slash
  // here, and using it in every internal link, means no redirect is ever
  // requested and the misconfiguration cannot bite.
  // Set SITE_URL per environment; the fallback is the production origin.
  site: process.env.SITE_URL || 'https://ismartghana.com',
  trailingSlash: 'always',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});