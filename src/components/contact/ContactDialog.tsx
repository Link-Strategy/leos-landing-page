"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import MasterButton from "@/components/ui/master-button";
import { LeadForm } from "@/components/subpage/LeadForm";

// Every call to action on the site opens this one dialog instead of routing: the only thing we want a visitor to do
// is start a conversation. `topic` names what they clicked (a product, the factory scenario, investor access...),
// is pre-filled into the message and recorded as the lead source. The form itself is the V2 contact form.

type OpenOptions = { topic?: string; interest?: string };
type ContactDialogApi = { open: (options?: OpenOptions) => void };

const ContactDialogContext = createContext<ContactDialogApi | null>(null);

export function useContactDialog(): ContactDialogApi {
  const api = useContext(ContactDialogContext);
  if (!api) throw new Error("useContactDialog must be used inside ContactDialogProvider");
  return api;
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; topic?: string; interest?: string; key: number }>({ open: false, key: 0 });
  const t = useTranslations("v2.dialog");
  const v2 = useTranslations("v2.contactV2");
  const tc = useTranslations("contact");

  // Remounting the form (key) on each open clears a previous "sent" state.
  const open = useCallback((options: OpenOptions = {}) => {
    setState((s) => ({ open: true, topic: options.topic, interest: options.interest, key: s.key + 1 }));
  }, []);
  const api = useMemo(() => ({ open }), [open]);

  // `#lien-he` in the URL also opens it, so plain links and shared URLs work too.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#lien-he") open();
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [open]);

  const onOpenChange = (next: boolean) => {
    setState((s) => ({ ...s, open: next }));
    if (!next && window.location.hash === "#lien-he") history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <ContactDialogContext.Provider value={api}>
      {children}
      <Dialog open={state.open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] max-w-[640px] overflow-y-auto border-[#2A9FFF]/55 bg-[linear-gradient(135deg,#0a2a63_0%,#061a40_100%)] p-6 sm:p-8">
          <div className="flex flex-col gap-1.5 pr-8">
            <span className="font-inter text-[12px] font-bold uppercase tracking-[2.6px] text-[#63D9FF]">{t("eyebrow")}</span>
            <DialogTitle className="font-inter m-0 text-[24px] font-bold normal-case not-italic leading-[30px] tracking-normal text-white sm:text-[28px] sm:leading-[34px]">
              {state.topic ? t("titleWithTopic", { topic: state.topic }) : t("title")}
            </DialogTitle>
            <p className="font-open-sans m-0 text-[15px] leading-[24px] text-[#E5F0FA]">{t("body")}</p>
            <p className="font-open-sans m-0 text-[13px] leading-[20px] text-white/65">
              {t("direct")}{" "}
              <a className="text-[#63D9FF] no-underline hover:text-white" href={`tel:${tc("phone1").replace(/\./g, "")}`}>
                {tc("phone1")}
              </a>{" "}
              ·{" "}
              <a className="text-[#63D9FF] no-underline hover:text-white" href={`mailto:${tc("email")}`}>
                {tc("email")}
              </a>
            </p>
          </div>
          <LeadForm
            key={state.key}
            buttonLabel={t("submit")}
            namePlaceholder={tc("formNamePlaceholder")}
            emailPlaceholder={v2("emailPlaceholder")}
            phonePlaceholder={v2("phonePlaceholder")}
            phoneRequired={false}
            messagePlaceholder={v2("problemPlaceholder") + "*"}
            organizationPlaceholder={v2("organizationPlaceholder")}
            interestLabel={v2("interest")}
            interestPlaceholder={v2("interestPlaceholder")}
            interestOptions={v2.raw("interestOptions") as string[]}
            defaultInterest={state.interest}
            defaultMessage={state.topic ? t("messagePrefix", { topic: state.topic }) + "\n" : undefined}
            maxMessage={1000}
            counterSuffix={v2("counter")}
            notice={v2("notice")}
            thankYou={v2.raw("thanks") as { title: string; body: string; steps: { eyebrow: string; title: string; body: string }[] }}
            source={state.topic ? `dialog:${state.topic}` : "dialog"}
            lead_type="contact"
          />
        </DialogContent>
      </Dialog>
    </ContactDialogContext.Provider>
  );
}

type CtaProps = {
  children: ReactNode;
  topic?: string;
  interest?: string;
  className?: string;
};

// Usable from server components. Renders a real link to /lien-he (crawlable, works without JS) that opens the dialog
// instead when clicked.
export function ContactCta({ children, topic, interest, className = "", variant = "button", tone = "primary" }: CtaProps & {
  variant?: "button" | "link";
  tone?: "primary" | "outline";
}) {
  const { open } = useContactDialog();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    open({ topic, interest });
  };
  if (variant === "link") {
    return (
      <Link
        href="/lien-he"
        onClick={onClick}
        className={`group inline-flex w-fit items-center gap-2 font-inter text-[14px] font-semibold text-[#63D9FF] no-underline transition-colors hover:text-white ${className}`}
      >
        {children}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
      </Link>
    );
  }
  return (
    <Link
      href="/lien-he"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-inter text-[15px] font-semibold text-white no-underline transition-transform duration-300 hover:-translate-y-0.5 ${
        tone === "primary" ? "bg-gradient-to-b from-[#76c6ff] to-[#2a75f3]" : "border border-white/40 bg-transparent hover:border-[#63D9FF]"
      } ${className}`}
    >
      {children}
      <ArrowRight className="size-4" strokeWidth={2} />
    </Link>
  );
}

// Same, in the site's pill "master button" style (hero, investor block).
export function ContactMasterButton({ content, topic, interest, type = "full-fill", className }: {
  content: ReactNode;
  topic?: string;
  interest?: string;
  type?: "full-fill" | "out-line";
  className?: string;
}) {
  const { open } = useContactDialog();
  return <MasterButton type={type} isShowIcon content={content} className={className} onClick={() => open({ topic, interest })} />;
}
