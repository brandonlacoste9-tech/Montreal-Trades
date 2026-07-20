import type { Metadata } from "next";
import DirectoryIndex from "@/components/directory/DirectoryIndex";
import { buildDirectoryMetadata } from "@/components/directory/directory-seo";

export const metadata: Metadata = buildDirectoryMetadata({
  lang: "en",
  title: "Contractor directory — Greater Montreal | MTLTrades",
  description:
    "Find a verified plumber, electrician, or roofer in Greater Montreal. RBQ licence, service areas, direct contact.",
  pathFr: "/annuaire",
  pathEn: "/en/annuaire",
});

export default function EnAnnuaireIndexPage() {
  return <DirectoryIndex lang="en" />;
}
