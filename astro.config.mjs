// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://windkraft-nottuln.de',
  trailingSlash: 'ignore',
  build: {
    format: 'preserve',
  },
  fonts: [
    {
      name: 'DM Serif Display',
      cssVariable: '--font-display',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Source Sans 3',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },
  ],
  integrations: [
    mdx(),
    pagefind(),
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
      serialize(item) {
        // Faktencheck-Pages werden als .html-Files ausgegeben (build.format: 'preserve').
        // Astro-Sitemap setzt default eine URL ohne .html, was inkonsistent zum canonical-Tag ist.
        // Hier explizit .html anhaengen, damit sitemap + canonical uebereinstimmen.
        if (item.url.includes('/dokumentation/') && !item.url.endsWith('.html') && !item.url.endsWith('/')) {
          item.url += '.html';
        }
        return item;
      },
    }),
  ],
});
