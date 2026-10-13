import { getTranslations } from "next-intl/server";
import { SectionHead, V2Button, V2CardGrid, V2Section, type V2CardItem } from "@/components/v2/ui";

// "Sản phẩm" section shared by the home page and /san-pham. Shows the V2 product line (status labels included);
// it replaced the old slider of the six company-named products.
export default async function Products() {
  const t = await getTranslations("v2");
  const items = t.raw("products") as V2CardItem[];

  return (
    <V2Section id="san-pham">
      <SectionHead
        eyebrow={t("pages.platform.eyebrow")}
        title={t("pages.platform.title")}
        lead={t("pages.platform.body")}
      />
      <V2CardGrid items={items} linkLabel={t("common.explore")} />
      <div className="mt-10">
        <V2Button route="platform" tone="outline">
          {t("pages.platform.metaTitle")}
        </V2Button>
      </div>
    </V2Section>
  );
}
