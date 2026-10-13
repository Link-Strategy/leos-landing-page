import type { AbstractIntlMessages } from "next-intl";

// Messages are embedded in every page's HTML when passed to NextIntlClientProvider. Server components read their own
// messages on the server, so only the namespaces that "use client" code actually reads are sent to the browser.
// `true` = the whole namespace, an object = only those children. Keep in sync with the useTranslations() calls in
// client-bundled files (HeaderTailwind, LanguageSwitcher, HeroOrbit, v2/Loop, HeartTab, TechArchitecture, ...).
const CLIENT_NAMESPACES = {
  header: true,
  hero: true,
  leadership: true,
  heartTab: true,
  partnerAccess: true,
  pillars: true,
  serviceModel: true,
  techArchitecture: true,
  v2: { common: true, products: true, loop: true },
} as const;

type Pick = true | { readonly [key: string]: Pick };

function pick(source: AbstractIntlMessages, shape: Pick): AbstractIntlMessages | string {
  if (shape === true) return source as AbstractIntlMessages;
  const out: AbstractIntlMessages = {};
  for (const key of Object.keys(shape)) {
    const value = source[key];
    if (value === undefined) continue;
    out[key] = typeof value === "string" ? value : (pick(value as AbstractIntlMessages, shape[key]) as AbstractIntlMessages);
  }
  return out;
}

export function pickClientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return pick(messages, CLIENT_NAMESPACES as unknown as Pick) as AbstractIntlMessages;
}
