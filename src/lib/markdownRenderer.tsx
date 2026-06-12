// src/lib/markdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders a markdown string as styled HTML. */
export const MarkdownRenderer = ({ children }: { children: string }) => (
  <div
    className="prose prose-sm max-w-none dark:prose-invert
      prose-headings:font-serif prose-headings:text-foreground
      prose-p:text-foreground/85 prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-code:bg-muted prose-code:px-1.5 prose-code:rounded
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-img:rounded-lg prose-img:shadow-sm"
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

/** Renders the special <!-- gallery:start/end --> blocks inserted by MarkdownEditor. */
export const ImageGallery = ({ content }: { content: string }) => {
  const urls = content
    .split("\n")
    .map((line) => line.match(/!\[([^\]]*)\]\(([^)]+)\)/))
    .filter(Boolean) as RegExpMatchArray[];

  if (!urls.length) return null;

  return (
    <div
      className={`grid gap-2 ${
        urls.length === 1 ? "grid-cols-1" :
        urls.length === 2 ? "grid-cols-2" :
        "grid-cols-3"
      }`}
    >
      {urls.map(([, alt, src], i) => (
        <img
          key={i}
          src={src}
          alt={alt}
          className="w-full rounded-lg object-cover aspect-video shadow-sm"
        />
      ))}
    </div>
  );
};
