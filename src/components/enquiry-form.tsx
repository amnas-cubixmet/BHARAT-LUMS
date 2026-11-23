"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  enquiryEmailHref,
  enquirySchema,
  enquiryText,
  type Enquiry,
} from "@/lib/enquiry";

type Defaults = { interest?: string; message?: string };
type Status = { kind: "ok" | "error" | "draft"; message: string };
const fields = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    auto: "name",
    required: true,
  },
  {
    name: "company",
    label: "Company name",
    type: "text",
    auto: "organization",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    auto: "email",
    required: true,
  },
  { name: "phone", label: "Phone number", type: "tel", auto: "tel" },
  { name: "interest", label: "Product interest", type: "text" },
  { name: "location", label: "Project location", type: "text" },
  {
    name: "quantity",
    label: "Estimated quantity",
    type: "text",
    inputMode: "numeric",
  },
] as const;

export default function EnquiryForm({
  online,
  email,
  whatsappNumber,
  defaults,
}: {
  online: boolean;
  email: string;
  whatsappNumber: string;
  defaults?: Defaults;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      interest: defaults?.interest ?? "",
      projectType: "",
      location: "",
      quantity: "",
      message: defaults?.message ?? "",
      website: "",
    },
  });
  const [status, setStatus] = useState<Status | null>(null);
  const [draft, setDraft] = useState("");
  const attempt = useRef<{ body: string; id: string } | null>(null);
  async function submit(values: Enquiry) {
    setDraft(enquiryText(values));
    if (!online) {
      setStatus({
        kind: "draft",
        message: "Your enquiry draft is ready. Choose email or WhatsApp to review and send it.",
      });
      return;
    }
    setStatus(null);
    const body = JSON.stringify(values);
    if (body !== attempt.current?.body)
      attempt.current = { body, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId: attempt.current.id }),
      });
      const result = await response.json();
      setStatus({
        kind: response.ok && result.ok ? "ok" : "error",
        message: result.message || "The enquiry could not be sent.",
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Online submission is temporarily unavailable. You can send your draft by email or WhatsApp.",
      });
    }
  }

  return (
    <form
      className="enquiry-form"
      aria-labelledby="enquiry-title"
      onSubmit={(event) => {
        void handleSubmit(submit, () => {
          setStatus(null);
          setDraft("");
        })(event);
      }}
      noValidate
    >
      {fields.map((field) => (
        <label key={field.name}>
          <span>
            {field.label}
            {"required" in field && " *"}
          </span>
          <input
            type={field.type}
            autoComplete={"auto" in field ? field.auto : undefined}
            inputMode={"inputMode" in field ? field.inputMode : undefined}
            aria-invalid={Boolean(errors[field.name])}
            aria-required={"required" in field}
            aria-describedby={
              errors[field.name] ? `${field.name}-error` : undefined
            }
            {...register(field.name)}
          />
          {errors[field.name] && (
            <small className="field-error" id={`${field.name}-error`}>
              {errors[field.name]?.message}
            </small>
          )}
        </label>
      ))}
      <label>
        <span>Project type</span>
        <select {...register("projectType")}>
          <option value="">Select a project type</option>
          {[
            "Residential",
            "Commercial",
            "Hospitality",
            "Retail",
            "Industrial",
            "Outdoor",
            "Other",
          ].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className="full">
        <span>Message *</span>
        <textarea
          rows={5}
          aria-required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us about the space, timeline or lighting you need."
          {...register("message")}
        />
        {errors.message && (
          <small id="message-error" className="field-error">
            {errors.message.message}
          </small>
        )}
      </label>
      <label className="form-trap" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </label>
      <p className="form-note full">
        {online
          ? "We’ll use these details to respond to your enquiry."
          : "Prepare your enquiry to send by email or WhatsApp."}
      </p>
      <button
        className="button button-primary full"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting…"
          : online
            ? "Submit enquiry"
            : "Prepare enquiry"}{" "}
        <Send size={16} />
      </button>
      <div className="full" aria-live="polite">
        {status && <p className="form-result">{status.message}</p>}
      </div>
      {draft && status && status.kind !== "ok" && (
        <div className="full flex flex-wrap gap-3">
          <a
            className="button button-outline"
            href={enquiryEmailHref(email, draft)}
          >
            Open email app <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            className="button button-outline"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draft)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open WhatsApp <MessageCircle size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </form>
  );
}
