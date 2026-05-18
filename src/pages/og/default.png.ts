import type { APIContext } from 'astro';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { html as htmlToSatori } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

async function loadFont(pkg: string, fileName: string): Promise<Buffer> {
  const path = fileURLToPath(
    new URL(`../../../node_modules/${pkg}/files/${fileName}`, import.meta.url),
  );
  return await readFile(path);
}

export async function GET(_ctx: APIContext) {
  const displayFont = await loadFont('@fontsource/dm-serif-display', 'dm-serif-display-latin-400-normal.woff');
  const bodyFont = await loadFont('@fontsource/source-sans-3', 'source-sans-3-latin-600-normal.woff');

  const markup = htmlToSatori(`<div style="width:1200px;height:630px;display:flex;flex-direction:column;background:linear-gradient(135deg,#0d2a30 0%,#134249 60%,#1a5f6a 100%);padding:70px 80px;font-family:'Body';color:#ffffff;"><div style="display:flex;align-items:center;font-size:24px;font-weight:600;letter-spacing:0.02em;color:rgba(255,255,255,0.9);"><div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#1a5f6a 0%,#7da87b 100%);display:flex;align-items:center;justify-content:center;margin-right:14px;"><div style="width:5px;height:19px;background:white;border-radius:1px;display:flex;"></div></div><div style="display:flex;">Windkraft Nottuln</div></div><div style="flex:1;display:flex;flex-direction:column;justify-content:center;"><div style="font-family:'Display';font-size:72px;line-height:1.05;font-weight:400;letter-spacing:-0.01em;color:#ffffff;display:flex;">Windkraft in Nottuln – Die Fakten</div><div style="margin-top:28px;font-size:30px;color:rgba(255,255,255,0.8);line-height:1.35;display:flex;">Quellenbasierte Informationen zu Windenergie im Kreis Coesfeld.</div></div><div style="display:flex;justify-content:space-between;align-items:flex-end;color:rgba(255,255,255,0.6);font-size:20px;border-top:1px solid rgba(255,255,255,0.18);padding-top:22px;"><div style="display:flex;">Faktencheck · Quellen · FAQ</div><div style="display:flex;">windkraft-nottuln.de</div></div></div>`);

  const svg = await satori(markup as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Display', data: displayFont, weight: 400, style: 'normal' },
      { name: 'Body', data: bodyFont, weight: 600, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
