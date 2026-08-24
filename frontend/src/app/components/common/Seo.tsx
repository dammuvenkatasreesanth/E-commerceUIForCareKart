import { Helmet } from "react-helmet-async";

const SITE_URL = "https://mycarekart.com";
const SITE_NAME = "CareKart";

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/products/nitrile-gloves" — the origin is added automatically. */
  path: string;
  image?: string;
  /** Raw JSON-LD object(s) — Product, BreadcrumbList, etc. Stringified as-is. */
  jsonLd?: object | object[];
}

// Central place for per-page <title>/description/canonical/OG tags. Every
// route rendered the exact same generic title before this — bad for SEO,
// since search results and shared links looked identical no matter which
// product or category page they pointed to.
export function Seo({ title, description, path, image, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {jsonLdList.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
