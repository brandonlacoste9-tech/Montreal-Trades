import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang="fr" />
      <Navbar lang="fr" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <DashboardClient lang="fr" welcome={sp.welcome === "1"} />
      </main>
      <Footer lang="fr" />
    </div>
  );
}
