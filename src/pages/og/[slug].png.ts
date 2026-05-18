import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { html as htmlToSatori } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

let displayFont: Buffer | null = null;
let bodyFont: Buffer | null = null;

async function loadFont(pkg: string, fileName: string): Promise<Buffer> {
  const path = fileURLToPath(
    new URL(`../../../node_modules/${pkg}/files/${fileName}`, import.meta.url),
  );
  return await readFile(path);
}

export async function getStaticPaths() {
  const entries = await getCollection('faktenchecks');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function GET({ props }: APIContext) {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection>>[number] };
  const { data } = entry;

  if (!displayFont)
    displayFont = await loadFont('@fontsource/dm-serif-display', 'dm-serif-display-latin-400-normal.woff');
  if (!bodyFont)
    bodyFont = await loadFont('@fontsource/source-sans-3', 'source-sans-3-latin-600-normal.woff');

  const formatDate = (d: Date) =>
    d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const subtitleBlock = data.subtitle
    ? `<div style="margin-top:24px;font-size:28px;color:rgba(255,255,255,0.78);line-height:1.35;display:flex;">${escape(data.subtitle)}</div>`
    : '';
  const markup = htmlToSatori(`<div style="width:1200px;height:630px;display:flex;flex-direction:column;background:linear-gradient(135deg,#0d2a30 0%,#134249 60%,#1a5f6a 100%);padding:70px 80px;font-family:'Body';color:#ffffff;"><div style="display:flex;align-items:center;font-size:24px;font-weight:600;letter-spacing:0.02em;color:rgba(255,255,255,0.9);"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1a5f6a 0%,#7da87b 100%);display:flex;align-items:center;justify-content:center;margin-right:14px;"><div style="width:5px;height:19px;background:white;border-radius:1px;display:flex;"></div></div><div style="display:flex;">Windkraft Nottuln</div></div><div style="flex:1;display:flex;flex-direction:column;justify-content:center;"><div style="font-family:'Display';font-size:62px;line-height:1.1;font-weight:400;letter-spacing:-0.01em;color:#ffffff;display:flex;">${escape(data.title)}</div>${subtitleBlock}</div><div style="display:flex;justify-content:space-between;align-items:flex-end;color:rgba(255,255,255,0.6);font-size:20px;border-top:1px solid rgba(255,255,255,0.18);padding-top:22px;"><div style="display:flex;">Faktencheck · ${escape(formatDate(data.publishedAt))}</div><div style="display:flex;">windkraft-nottuln.de</div></div></div>`);

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Display', data: displayFont, weight: 400, style: 'normal' },
      { name: 'Body', data: bodyFont, weight: 600, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
