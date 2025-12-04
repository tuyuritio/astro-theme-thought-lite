import type { APIRoute } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "$config";
import i18nit from "$i18n";

export async function getStaticPaths() {
	// Create path for each locale, omitting default locale from URL
	return config.i18n.locales.map(locale => ({ params: { locale: config.i18n.defaultLocale === locale ? undefined : locale } }));
}

export const GET: APIRoute = ({ params }) => {
	const { locale = config.i18n.defaultLocale } = params;
	const t = i18nit(locale);

	const text = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" omit-xml-declaration="yes" />
  <xsl:template match="/">
    <html dir="${["ar", "he", "fa", "ur"].includes(locale) ? "rtl" : "ltr"}">

    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${t("navigation.subscription")} | <xsl:value-of select="atom:feed/atom:title" /></title>
      <link rel="stylesheet" href="/feed.css" />
      <link rel="icon" type="image/x-icon" href="{atom:feed/atom:icon}" />
    </head>

    <body>
      <header>
        <h1>
          <a href="{atom:feed/atom:link[@rel='alternate']/@href}">
            <xsl:value-of select="atom:feed/atom:title" />
          </a>
        </h1>
        <p>
          <xsl:value-of select="atom:feed/atom:subtitle" />
        </p>
      </header>

      <blockquote>
        <p>${t("feed.description")}</p>
        <p>${t("feed.usage")}</p>
        <p>
          ${t("feed.address")}:
          <code id="feed-url"><xsl:value-of select="concat(atom:feed/atom:link[@rel='alternate']/@href, '${getRelativeLocaleUrl(locale, "feed.xml").slice(1)}')" /></code>
          <button type="button" onclick="copy()" class="copy-btn">${t("feed.copy.name")}</button>
        </p>
      </blockquote>

      <script>
        function copy() {
          const URL = document.getElementById('feed-url').textContent;
          navigator.clipboard.writeText(URL).then(() => alert('${t("feed.copy.success")}')).catch((() => alert('${t("feed.copy.failure")}')));
        }
      </script>

      <main>
        <xsl:for-each select="atom:feed/atom:entry">
          <section>
            <article>
              <a href="{atom:link/@href}">
                <xsl:value-of select="atom:title" />
              </a>
              <time>
                <xsl:value-of select="substring(atom:updated, 1, 10)" />
                <xsl:text> </xsl:text>
                <xsl:value-of select="substring(atom:updated, 12, 8)" />
              </time>
            </article>
            <xsl:if test="atom:category">
              <aside>
                <xsl:for-each select="atom:category">
                  <span>#<xsl:value-of select="@term" /></span>
                </xsl:for-each>
              </aside>
            </xsl:if>
          </section>
        </xsl:for-each>
      </main>

      <footer>
        <p>${t("feed.visit", { title: `<a href="{atom:feed/atom:link[@rel='alternate']/@href}"><xsl:value-of select="atom:feed/atom:title" /></a>` })}</p>
        <p>
          ${t("feed.last")}:
          <xsl:value-of select="substring(atom:feed/atom:updated, 1, 10)" />
          <xsl:text> </xsl:text>
          <xsl:value-of select="substring(atom:feed/atom:updated, 12, 8)" />
        </p>
        <p><xsl:value-of select="atom:feed/atom:rights" /></p>
      </footer>
    </body>

    </html>
  </xsl:template>
</xsl:stylesheet>`;

	return new Response(text, { headers: { "Content-Type": "text/xsl" } });
};
