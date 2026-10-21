<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - ErenCodes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh; padding: 40px 20px; color: #e4e4e7;
          }
          .container { max-width: 900px; margin: 0 auto; }
          h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #7c3aed, #a78bfa);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; margin-bottom: 8px;
          }
          .subtitle { color: #a1a1aa; margin-bottom: 30px; font-size: 1rem; }
          .stats { display: flex; gap: 20px; margin-bottom: 30px; }
          .stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 24px; }
          .stat-value { font-size: 1.5rem; font-weight: 700; color: #a78bfa; }
          .stat-label { font-size: 0.875rem; color: #a1a1aa; }
          table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
          th { background: rgba(124,58,237,0.1); text-align: left; padding: 16px 20px; font-weight: 600; color: #a78bfa; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.05); }
          tr:hover td { background: rgba(255,255,255,0.02); }
          a { color: #60a5fa; text-decoration: none; word-break: break-all; }
          a:hover { color: #93c5fd; text-decoration: underline; }
          .priority-high { color: #4ade80; font-weight: 600; }
          .priority-medium { color: #facc15; }
          .priority-low { color: #a1a1aa; }
          .footer { text-align: center; margin-top: 40px; color: #71717a; font-size: 0.875rem; }
          .footer a { color: #a78bfa; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🗺️ XML Sitemap</h1>
          <p class="subtitle">This sitemap helps search engines discover and index pages on erenncodes.site</p>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              <div class="stat-label">Total URLs</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending"/>
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td>
                    <xsl:attribute name="class">
                      <xsl:choose>
                        <xsl:when test="sitemap:priority >= 0.8">priority-high</xsl:when>
                        <xsl:when test="sitemap:priority >= 0.5">priority-medium</xsl:when>
                        <xsl:otherwise>priority-low</xsl:otherwise>
                      </xsl:choose>
                    </xsl:attribute>
                    <xsl:value-of select="sitemap:priority"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <div class="footer">
            <p>Generated for <a href="https://www.erenncodes.site">ErenCodes</a> • Stunning Website Templates for Life's Best Moments ✨</p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>