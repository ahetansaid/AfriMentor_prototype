import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Portrait } from "@/components/ui/Portrait";
import { Reveal } from "@/components/ui/Reveal";
import { genCover } from "@/lib/portrait";
import { getAllArticleIds, getArticle, getPioneer } from "@/lib/queries";

export async function generateStaticParams() {
  const ids = await getAllArticleIds();
  return ids.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article introuvable" };
  const author = await getPioneer(article.authorId);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: author?.photoUrl ? [author.photoUrl] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const author = await getPioneer(article.authorId);
  const hasAuthorPhoto = Boolean(author?.photoUrl);

  return (
    <article className="pb-24">
      {/* ---------- HERO COVER IMMERSIF ---------- */}
      <header className="relative min-h-[480px] overflow-hidden bg-indigo-deep text-ivory lg:min-h-[560px]">
        {hasAuthorPhoto && author ? (
          <div className="absolute inset-0">
            <Portrait
              seed={author.id}
              photoUrl={author.photoUrl}
              fill
              priority
              width={1600}
              height={900}
              alt={`Portrait de ${author.name}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep via-indigo-deep/80 to-indigo-deep/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-deep/85 via-indigo-deep/55 to-indigo-deep/15" />
          </div>
        ) : (
          <div
            className="absolute inset-0 opacity-80"
            dangerouslySetInnerHTML={{
              __html: genCover(article.id, 1600, 900),
            }}
          />
        )}

        <div className="relative z-10 mx-auto max-w-[1240px] px-5 pt-7 sm:px-8">
          <Link
            href="/fil-editorial"
            className="text-[13px] text-ivory/70 transition-colors hover:text-gold"
          >
            ← Fil éditorial
          </Link>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[400px] max-w-[1240px] flex-col justify-end px-5 pb-14 pt-16 sm:px-8 sm:pb-16 lg:min-h-[480px]">
          <Reveal>
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-8 bg-gold" />
                {article.kind} · {article.sector}
              </div>
              <h1 className="font-display text-3xl font-light leading-[1.1] tracking-tight sm:text-4xl lg:text-[3.4rem]">
                {article.title}
              </h1>
              {author && (
                <div className="mt-8 flex items-center gap-4 border-t border-ivory/15 pt-6">
                  <Link
                    href={`/pionniers/${author.id}`}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ivory/10 ring-2 ring-gold/40"
                  >
                    <Portrait
                      seed={author.id}
                      photoUrl={author.photoUrl}
                      width={48}
                      height={48}
                      alt={author.name}
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/pionniers/${author.id}`}
                      className="text-[14px] font-medium text-ivory hover:text-gold"
                    >
                      {author.name}
                    </Link>
                    <div className="text-xs text-ivory-shadow/70">
                      Publié {article.date} · {article.read} de lecture ·{" "}
                      {article.reads} lectures
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- CORPS ---------- */}
      <div className="mx-auto max-w-[820px] px-5 pt-16 sm:px-8">
        <Reveal>
          <div className="article-prose">
            {article.body.map((p, i) => (
              <p
                key={i}
                className="mb-6 text-[17.5px] leading-[1.75] text-ink"
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Pied — auteur + CTAs */}
        {author && (
          <Reveal>
            <div className="mt-16 border-t border-line pt-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <Link
                  href={`/pionniers/${author.id}`}
                  className="group flex items-center gap-4"
                >
                  <span className="h-14 w-14 overflow-hidden rounded-full bg-ivory-shadow">
                    <Portrait
                      seed={author.id}
                      photoUrl={author.photoUrl}
                      width={56}
                      height={56}
                      alt={author.name}
                    />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.15em] text-muted">
                      Auteur
                    </span>
                    <span className="block font-display text-lg font-medium text-indigo group-hover:text-terra">
                      {author.name}
                    </span>
                    <span className="block text-xs italic text-muted">
                      {author.sector} · {author.region}
                    </span>
                  </span>
                </Link>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/pionniers/${author.id}`}
                    className="rounded-sm border border-indigo px-5 py-2.5 text-[13px] font-medium text-indigo transition-colors hover:bg-indigo hover:text-ivory"
                  >
                    Voir le profil
                  </Link>
                  <Link
                    href={`/pionniers/${author.id}/mentorat`}
                    className="rounded-sm bg-indigo px-5 py-2.5 text-[13px] font-medium text-ivory transition-colors hover:bg-indigo-deep"
                  >
                    Demander un mentorat
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
