import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArticleCard } from "@/components/article/ArticleCard";
import { getArticles, getPioneer } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Fil éditorial",
  description:
    "Retours d'expérience, analyses sectorielles et mémoire historique — ce que les pionniers d'Afrique ont à transmettre.",
};

export default async function EditorialPage() {
  const articles = await getArticles();
  const main = articles[0];
  const rest = articles.slice(1);
  const mainAuthor = main ? await getPioneer(main.authorId) : null;

  const restAuthors = await Promise.all(
    rest.map((a) => getPioneer(a.authorId)),
  );

  return (
    <>
      {/* ---------- HERO SOMBRE ---------- */}
      <section className="relative overflow-hidden bg-indigo-deep text-ivory">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, rgba(201,162,39,0.10) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139,58,31,0.13) 0%, transparent 50%)",
          }}
        />
        <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
          <Reveal>
            <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Le fil éditorial AfriMentor
            </div>
            <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
              Ce que les pionniers{" "}
              <em className="font-normal text-gold-soft">ont à dire</em>.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-shadow/85 sm:text-lg">
              Retours d&apos;expérience, analyses sectorielles, mémoire
              historique, transmission pédagogique. Chaque publication respecte
              une charte exigeante : ton respectueux, contenu constructif,
              dignité maintenue.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------- LISTE ---------- */}
      <Container className="py-14 pb-24 sm:py-16">
        {/* Article du mois — split avec photo de l'auteur */}
        {main && mainAuthor && (
          <Reveal>
            <article className="group mb-16 grid items-stretch overflow-hidden border border-line bg-white lg:grid-cols-[1.1fr_1fr]">
              <div className="order-2 p-7 sm:p-10 lg:order-1 lg:p-12">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-terra">
                  Article du mois · {main.sector}
                </div>
                <Link href={`/fil-editorial/${main.id}`}>
                  <h2 className="font-display text-3xl font-normal leading-tight text-indigo transition-colors hover:text-terra sm:text-4xl lg:text-[2.6rem]">
                    {main.title}
                  </h2>
                </Link>
                <p className="mt-5 text-base leading-relaxed text-ink-soft">
                  {main.excerpt}
                </p>
                <div className="mt-7 flex items-center gap-3.5">
                  <Link
                    href={`/pionniers/${mainAuthor.id}`}
                    className="h-11 w-11 overflow-hidden rounded-full bg-ivory-shadow"
                  >
                    <Portrait
                      seed={mainAuthor.id}
                      photoUrl={mainAuthor.photoUrl}
                      width={44}
                      height={44}
                      alt={mainAuthor.name}
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/pionniers/${mainAuthor.id}`}
                      className="text-[13px] font-medium text-indigo hover:text-terra"
                    >
                      {mainAuthor.name}
                    </Link>
                    <div className="text-xs text-muted">
                      Publié {main.date} · {main.read} · {main.reads} lectures
                    </div>
                  </div>
                </div>
                <Link
                  href={`/fil-editorial/${main.id}`}
                  className="mt-8 inline-flex items-center gap-3 rounded-sm bg-indigo px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-indigo-deep"
                >
                  Lire l&apos;article →
                </Link>
              </div>
              <div className="order-1 relative h-72 overflow-hidden bg-ivory-soft lg:order-2 lg:h-auto">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                  <Portrait
                    seed={mainAuthor.id}
                    photoUrl={mainAuthor.photoUrl}
                    fill
                    priority
                    width={800}
                    height={600}
                    alt={`Portrait de ${mainAuthor.name}`}
                  />
                </div>
                {mainAuthor.photoUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-deep/30 to-transparent" />
                )}
              </div>
            </article>
          </Reveal>
        )}

        {/* Grille */}
        <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <StaggerItem key={a.id}>
              <ArticleCard article={a} author={restAuthors[i] ?? undefined} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </>
  );
}
