"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import LeadForm from "./LeadForm";
import { LEAD_FORM_SLOT_ID } from "./lead-form-slot";

const subscribe = () => () => {};
const getSlot = () => document.getElementById(LEAD_FORM_SLOT_ID);
const getServerSlot = () => null;

/**
 * Mounts <LeadForm> into the placeholder that static-landing.tsx leaves where the
 * dead Elementor form used to be (the static HTML is injected as a string, so a portal is needed).
 * Server render and hydration see no slot; the portal attaches on the client.
 */
export default function LeadFormPortal(props: React.ComponentProps<typeof LeadForm>) {
  const slot = useSyncExternalStore(subscribe, getSlot, getServerSlot);
  return slot ? createPortal(<LeadForm {...props} />, slot) : null;
}
