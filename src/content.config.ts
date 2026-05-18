import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const navSection = z.object({
  id: z.string(),
  label: z.string(),
  mobileLabel: z.string().optional(),
});

const claimSection = z.object({
  id: z.string(),
  label: z.string(),
});

const weiterfuehrend = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});

const metaItem = z.object({
  label: z.string(),
  value: z.string(),
});

const faktenchecks = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/faktenchecks' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    publishedAt: z.date(),
    description: z.string(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    /** Box oben mit Anlass + Frage (Vahl-Stil) */
    anlass: z.string().optional(),
    frage: z.string().optional(),
    /** Meta-Liste (Schulte-Stil: Veranstaltung, Grundlage, Bezug …) */
    metaList: z.array(metaItem).optional(),
    /** Intro-Note („Kurzantwort" / „Kontext") */
    intro: z.string().optional(),
    /** SideNav-Hauptabschnitte */
    sections: z.array(navSection),
    /** Optional: Claim-Sub-Nav (Schulte-Pages mit Read-Counter) */
    claims: z.array(claimSection).optional(),
    /** „Weiterführend"-Box am Seitenende */
    weiterfuehrend: z.array(weiterfuehrend).optional(),
  }),
});

export const collections = { faktenchecks };
