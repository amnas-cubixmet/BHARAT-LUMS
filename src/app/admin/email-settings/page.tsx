import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { authorized } from "@/lib/admin-auth";
import { EmailSettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Email settings", robots: { index: false, follow: false } };

export default async function EmailSettingsPage() {
  if (!authorized((await headers()).get("authorization"))) notFound();
  return <section className="shell section-tight mx-auto max-w-3xl"><h1 className="mb-6 text-3xl font-bold md:text-5xl">Email settings</h1><EmailSettingsForm /></section>;
}
