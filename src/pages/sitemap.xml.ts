// Alias for /sitemap-index.xml at the historical /sitemap.xml path.
// @astrojs/sitemap generates /sitemap-index.xml + /sitemap-0.xml; many
// crawlers (and our old links) point at /sitemap.xml — this endpoint
// emits a sitemapindex pointing at the same /sitemap-0.xml so both URLs
// stay valid.

export const prerender = true;

export async function GET() {
  const baseUrl = 'https://windkraft-nottuln.de';
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
