// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://windkraft-nottuln.de',
  trailingSlash: 'ignore',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
