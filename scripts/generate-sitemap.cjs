const fs = require('fs');

// Read defaultProducts.ts
const content = fs.readFileSync('src/data/defaultProducts.ts', 'utf8');

// Parse products
const productRegex = /id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]*)",\s*price:\s*([0-9.]+),\s*currency:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*image_url:\s*"([^"]+)"/g;

let matches;
const products = [];
while ((matches = productRegex.exec(content)) !== null) {
  products.push({
    id: matches[1],
    title: matches[2],
    description: matches[3],
    category: matches[6],
    image: matches[7]
  });
}

console.log(`Parsed ${products.length} products`);

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="https://www.erenncodes.site/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Pages -->
  <url>
    <loc>https://www.erenncodes.site/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.erenncodes.site/logo.png</image:loc>
      <image:title>Eren Codes Logo</image:title>
      <image:caption>Eren - Bespoke Celebration Websites for Birthdays, Proposals &amp; Anniversaries</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.erenncodes.site/products</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.erenncodes.site/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.erenncodes.site/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.erenncodes.site/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.erenncodes.site/terms-of-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.erenncodes.site/refund-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Product & Celebration Templates (21 Templates) -->
`;

for (const p of products) {
  const cleanTitle = p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const imgUrl = p.image.startsWith('http') ? p.image : `https://www.erenncodes.site${p.image.startsWith('/') ? '' : '/'}${p.image}`;
  xml += `  <url>
    <loc>https://www.erenncodes.site/products/${p.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle} Celebration Website Template</image:title>
      <image:caption>Custom ${cleanTitle} website by Eren</image:caption>
    </image:image>
  </url>
`;
}

xml += `</urlset>\n`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log('Saved updated public/sitemap.xml with', products.length + 7, 'URLs!');
