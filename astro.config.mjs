// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://windkraft-nottuln.de',
  trailingSlash: 'ignore',
  build: {
    format: 'preserve',
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
