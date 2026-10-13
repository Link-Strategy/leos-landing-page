/** Loads the legacy WordPress/Elementor CSS for the (wp) routes: one purged file (see scripts/build-wp-css.mjs). */
export default function WpAssets() {
  return <link rel="stylesheet" href="/wp-content/wp-legacy.min.css?v=1" precedence="wp" />;
}
