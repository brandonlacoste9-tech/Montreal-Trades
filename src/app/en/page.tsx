import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import {
  OrganizationJsonLd,
  LocalServiceJsonLd,
  FaqJsonLd,
} from "@/components/JsonLd";
import { buildMetadata, HOME_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en", HOME_SEO);

export default function EnHomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <LocalServiceJsonLd lang="en" />
      <FaqJsonLd lang="en" />
      <HomePage lang="en" />
    </>
  );
}
