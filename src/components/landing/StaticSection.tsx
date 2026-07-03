import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

interface StaticSectionProps {
  name: string;
}

export default function StaticSection({ name }: StaticSectionProps) {
  // Ensure we append .html extension if not present
  const filename = name.endsWith(".html") ? name : `${name}.html`;
  
  // Resolve path to the generated sections-html directory robustly
  let filePath = path.join(process.cwd(), "src", "app", "sections-html", filename);
  if (!existsSync(filePath)) {
    filePath = path.join(process.cwd(), "app", "landing-page", "src", "app", "sections-html", filename);
  }
  
  try {
    const htmlContent = readFileSync(filePath, "utf8");
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
        suppressHydrationWarning={true} 
        style={{ display: "contents" }}
      />
    );
  } catch (error) {
    console.error(`Failed to load static section: ${filename}`, error);
    return null;
  }
}
