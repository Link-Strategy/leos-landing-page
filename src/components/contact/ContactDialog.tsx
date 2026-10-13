"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConsentCheckbox from "@/components/legal/ConsentCheckbox";
import MasterButton from "@/components/ui/master-button";

// Every call to action on the site opens this one dialog: the only thing we want a visitor to do is leave a way to
// reach them. It asks for the minimum (name, email, phone) and fits one screen; `topic` records what they clicked,
// which is enough context for the follow-up call. The long form stays on /lien-he for people who want it.

type OpenOptions = { topic?: string };
type ContactDialogApi = { open: (options?: OpenOptions) => void };

const ContactDialogContext = createContext<ContactDialogApi | null>(null);

export function useContactDialog(): ContactDialogApi {
  const api = useContext(ContactDialogContext);
  if (!api) throw new Error("useContactDialog must be used inside ContactDialogProvider");
  return api;
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; topic?: string; key: number }>({ open: false, key: 0 });

  // Remounting the form (key) on each open clears a previous "sent" state.
  const open = useCallback((options: OpenOptions = {}) => {
    setState((s) => ({ open: true, topic: options.topic, key: s.key + 1 }));
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
        <DialogContent className="max-w-[420px] p-6 sm:p-7">
          <QuickContactForm key={state.key} topic={state.topic} onDone={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    </ContactDialogContext.Provider>
  );
}

function QuickContactForm({ topic, onDone }: { topic?: string; onDone: () => void }) {
  const t = useTranslations("v2.dialog");
  const tc = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          message: topic ? t("messagePrefix", { topic }) : undefined,
          website: data.get("website") || undefined,
          consent: data.get("consent") === "on",
          source: topic ? `dialog:${topic}` : "dialog",
          lead_type: "contact",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
      } else {
        const fields = Array.isArray(json.fields) ? json.fields.map((f: { message?: string }) => f.message).filter(Boolean).join(" · ") : "";
        setError(fields || json.message || t("error"));
        setStatus("idle");
      }
    } catch {
      setError(t("error"));
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <>
        <DialogHeader className="items-center text-center sm:text-center">
          <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Check className="size-6" strokeWidth={2.5} />
          </span>
          <DialogTitle className="normal-case not-italic tracking-normal">{t("sentTitle")}</DialogTitle>
          <DialogDescription className="text-white/70">{t("sentBody")}</DialogDescription>
        </DialogHeader>
        <Button type="button" variant="brand" size="landing" className="w-full" onClick={onDone}>
          {t("close")}
        </Button>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle className="normal-case not-italic tracking-normal">{t("title")}</DialogTitle>
        <DialogDescription className="text-white/70">{topic ? t("bodyWithTopic", { topic }) : t("body")}</DialogDescription>
      </DialogHeader>

      {/* Honeypot: hidden from people, filled by bots; /api/contact silently drops these. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[10000px] size-px overflow-hidden" />

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qc-name" className="text-white/85">{t("name")}</Label>
          <Input id="qc-name" name="name" required minLength={2} maxLength={100} autoComplete="name" variant="pill" className="px-4" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qc-email" className="text-white/85">{t("email")}</Label>
          <Input id="qc-email" name="email" type="email" required maxLength={200} autoComplete="email" variant="pill" className="px-4" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qc-phone" className="text-white/85">
            {t("phone")} <span className="font-normal text-white/50">{t("optional")}</span>
          </Label>
          <Input id="qc-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" variant="pill" className="px-4" />
        </div>
      </div>

      <ConsentCheckbox id="qc-consent" className="text-[13px] leading-5 text-white/70" />

      {error && <p role="alert" className="m-0 text-sm text-red-300">{error}</p>}

      <Button type="submit" variant="brand" size="landing" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
        {t("submit")}
      </Button>

      <p className="m-0 text-center text-[13px] text-white/55">
        {t("direct")}{" "}
        <a className="font-medium text-[#63D9FF] no-underline hover:text-white" href={`tel:${tc("phone1").replace(/\./g, "")}`}>
          {tc("phone1")}
        </a>
      </p>
    </form>
  );
}

type CtaProps = { children: ReactNode; topic?: string; className?: string };

// Usable from server components. Renders a real link to /lien-he (crawlable, works without JS) that opens the dialog
// instead when clicked.
export function ContactCta({ children, topic, className = "", variant = "button", tone = "primary" }: CtaProps & {
  variant?: "button" | "link";
  tone?: "primary" | "outline";
}) {
  const { open } = useContactDialog();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    open({ topic });
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
export function ContactMasterButton({ content, topic, type = "full-fill", className }: {
  content: ReactNode;
  topic?: string;
  type?: "full-fill" | "out-line";
  className?: string;
}) {
  const { open } = useContactDialog();
  return <MasterButton type={type} isShowIcon content={content} className={className} onClick={() => open({ topic })} />;
}
