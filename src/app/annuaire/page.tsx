import type { Metadata } from "next";
import DirectoryIndex from "@/components/directory/DirectoryIndex";
import { buildDirectoryMetadata } from "@/components/directory/directory-seo";

export const metadata: Metadata = buildDirectoryMetadata({
  lang: "fr",
  title: "Annuaire des entrepreneurs — Grand Montréal | MTLTrades",
  description:
    "Trouvez un plombier, électricien ou couvreur vérifié sur le Grand Montréal. Licence RBQ, zones, contact direct.",
  pathFr: "/annuaire",
  pathEn: "/en/annuaire",
});

export default function AnnuaireIndexPage() {
  return <DirectoryIndex lang="fr" />;
}
