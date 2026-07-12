import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LangHtml from "@/components/LangHtml";
import LoginForm from "@/components/LoginForm";

export default function EnLoginPage() {
  const lang = "en" as const;
  return (
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-zinc-100">
      <LangHtml lang={lang} />
      <Navbar lang={lang} />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <LoginForm lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
