import Link from "next/link";
import { genCover } from "@/lib/portrait";
import type { Article, Pioneer } from "@/lib/types";

export function ArticleCard({
  article,
  author,
}: {
  article: Article;
  author?: Pioneer;
}) {
  return (
    <Link href={`/fil-editorial/${article.id}`} className="group block">
      <div
        className="mb-5 h-48 overflow-hidden bg-ivory-soft"
        dangerouslySetInnerHTML={{ __html: genCover(article.id, 400, 200) }}
      />
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-terra">
        {article.kind} · {article.sector}
      </div>
      <h3 className="mt-2.5 font-display text-xl font-medium leading-tight text-indigo transition-colors group-hover:text-terra">
        {article.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {article.excerpt}
      </p>
      <p className="mt-3.5 text-xs text-muted">
        {author && (
          <strong className="font-medium text-indigo">{author.name}</strong>
        )}{" "}
        · {article.read} de lecture
      </p>
    </Link>
  );
}
