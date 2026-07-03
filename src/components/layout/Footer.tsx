import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function normalizeFooterHtml(html: string) {
  return html
    .replace(/\r\n?/g, "\n")
    .replaceAll('src="wp-content/', 'src="/wp-content/')
    .replaceAll("src='wp-content/", "src='/wp-content/")
    .replaceAll('srcset="wp-content/', 'srcset="/wp-content/')
    .replaceAll(", wp-content/", ", /wp-content/")
    .replaceAll('href="wp-content/', 'href="/wp-content/')
    .replaceAll("href='wp-content/", "href='/wp-content/")
    .replace(/\bhref=""/g, 'href="/"')
    .replace(/\bhref="(?!https?:|mailto:|tel:|#|\/)([^"]+)"/g, 'href="/$1"');
}

function getFooterHtml() {
  const sourcePath = path.join(process.cwd(), "public", "landing", "index.html");

  if (!existsSync(sourcePath)) {
    return "";
  }

  const source = readFileSync(sourcePath, "utf8");
  const footerMatch = source.match(
    /<footer\b[^>]*class="elementor elementor-63 elementor-location-footer"[^>]*>([\s\S]*?)<\/footer>/i,
  );

  if (!footerMatch) {
    return "";
  }

  return normalizeFooterHtml(footerMatch[1]);
}

export default function Footer() {
  return (
    <footer
      className="elementor elementor-63 elementor-location-footer"
      data-elementor-id="63"
      data-elementor-post-type="elementor_library"
      data-elementor-type="footer"
      dangerouslySetInnerHTML={{ __html: getFooterHtml() }}
    />
  );
}
