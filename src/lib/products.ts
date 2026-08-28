export const CANONICAL_PRODUCT_IDS = ["ledb", "lesb", "lese", "lesm", "legm", "lesc"] as const;

export type ProductId = (typeof CANONICAL_PRODUCT_IDS)[number];

// The canonical slug each product resolves to (used for the sub-nav pills / cross-links).
export const CANONICAL_PRODUCT_SLUGS: Record<ProductId, string> = {
  ledb: "ledb-bo-nao-so-4",
  lesb: "lesb-xay-dung-thong-minh",
  lese: "lese-nang-luong-thong-minh",
  lesm: "lesm-di-chuyen-thong-minh",
  legm: "legm-vat-lieu-xanh",
  lesc: "lesc-do-thi-thong-minh",
};

// Every static-export slug under public/landing/san-pham, including CMS duplicate/orphan pages,
// mapped to the canonical product it represents so the detail template can still resolve a title
// and highlight the right sub-nav pill for them.
export const PRODUCT_SLUG_TO_ID: Record<string, ProductId> = {
  "ledb-bo-nao-so-4": "ledb",
  "ledb-bo-nao-so-2": "ledb",
  "ledb-bo-nao-so": "ledb",
  "lesb-xay-dung-thong-minh": "lesb",
  "lese-nang-luong-thong-minh": "lese",
  "lesm-di-chuyen-thong-minh-2": "lese",
  "lesm-di-chuyen-thong-minh": "lesm",
  "legm-vat-lieu-xanh": "legm",
  "lesc-do-thi-thong-minh": "lesc",
};
