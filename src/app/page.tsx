import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import {
  OrganizationJsonLd,
  LocalServiceJsonLd,
  FaqJsonLd,
} from "@/components/JsonLd";
import { buildMetadata, HOME_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("fr", HOME_SEO);

export default function Page() {
  return (
    <>
      <OrganizationJsonLd />
      <LocalServiceJsonLd lang="fr" />
      <FaqJsonLd lang="fr" />
      <HomePage lang="fr" />
    </>
  );
}
