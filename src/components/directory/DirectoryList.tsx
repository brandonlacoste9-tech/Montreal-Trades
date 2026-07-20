import type { Lang } from "@/lib/i18n";
import type { DirectoryListing } from "@/lib/directory";
import ContractorCard from "./ContractorCard";

export default function DirectoryList({
  listings,
  lang,
  emptyMessage,
}: {
  listings: DirectoryListing[];
  lang: Lang;
  emptyMessage: string;
}) {
  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-zinc-400">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {listings.map((l) => (
        <li key={l.id}>
          <ContractorCard listing={l} lang={lang} />
        </li>
      ))}
    </ul>
  );
}
