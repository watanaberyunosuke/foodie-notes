import Link from "next/link";
import { getCulturalBackgroundRejectionContent } from "@/lib/cultural-background-rejection";

type PageProps = {
  searchParams: Promise<{
    background?: string;
  }>;
};

export default async function AccessUnavailablePage({ searchParams }: Readonly<PageProps>) {
  const params = await searchParams;
  const content = getCulturalBackgroundRejectionContent(params.background);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 dark:bg-neutral-950">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-neutral-900">
        <div lang={content.htmlLang} className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] opacity-75">Private access</p>
          <h1 className="mt-3 text-3xl font-bold">{content.title}</h1>
          <p className="mt-4 text-sm leading-6">{content.body}</p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Return
          </Link>
        </div>
      </div>
    </main>
  );
}
