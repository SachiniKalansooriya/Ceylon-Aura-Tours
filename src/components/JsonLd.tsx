import { jsonLdString } from "@/lib/seo";

/** Renders structured data for search engines. */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
