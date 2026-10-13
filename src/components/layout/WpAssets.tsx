import { WP_STYLESHEETS } from "@/lib/wp-assets";

/** Loads the legacy WordPress/Elementor CSS. Rendered only by the (wp) route group layout; React hoists the links into <head>. */
export default function WpAssets() {
  return (
    <>
      {WP_STYLESHEETS.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="wp" />
      ))}
    </>
  );
}
