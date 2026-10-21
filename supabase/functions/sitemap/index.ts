import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

const SITE_URL = "https://www.erenncodes.site";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Generating dynamic sitemap...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, image_url, updated_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    console.log(`Found ${products?.length || 0} active products`);

    const today = new Date().toISOString().split("T")[0];

    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/products", priority: "0.9", changefreq: "weekly" },
      { loc: "/about", priority: "0.8", changefreq: "monthly" },
      { loc: "/contact", priority: "0.7", changefreq: "monthly" },
      { loc: "/privacy-policy", priority: "0.4", changefreq: "monthly" },
      { loc: "/terms-of-service", priority: "0.4", changefreq: "monthly" },
      { loc: "/refund-policy", priority: "0.4", changefreq: "monthly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    xml += `  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/logo.png</image:loc>
      <image:title>Erenn Logo</image:title>
      <image:caption>Erenn - Stunning Website Templates for Life's Best Moments</image:caption>
    </image:image>
  </url>
`;

    for (const page of staticPages.slice(1)) {
      xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    if (products && products.length > 0) {
      for (const product of products) {
        const lastmod = product.updated_at 
          ? new Date(product.updated_at).toISOString().split("T")[0]
          : today;
        
        const imageUrl = product.image_url?.startsWith("http") 
          ? product.image_url 
          : `${SITE_URL}${product.image_url}`;

        xml += `  <url>
    <loc>${SITE_URL}/products/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

        if (product.image_url) {
          xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${product.title} - Website Template by Erenn</image:title>
      <image:caption>${product.title} - custom website template crafted by ErenCodes</image:caption>
    </image:image>`;
        }

        xml += `
  </url>
`;
      }
    }

    xml += `</urlset>`;

    console.log("Sitemap generated successfully");

    return new Response(xml, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate sitemap</error>`,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});