# Task: Replace Plain Textarea with `MarkdownEditor` in `AdminPostEditor`

## Context

`AdminPostEditor` (`src/pages/admin/AdminPostEditor.tsx`) currently uses a plain `<textarea>` for the article body field. A fully-featured `MarkdownEditor` component already exists and should be wired in instead.

The component lives at:

```
src/components/MarkdownEditor.tsx
```

It depends on a companion renderer that must also be created:

```
src/lib/markdownRenderer.tsx   ← MarkdownRenderer + ImageGallery exports
```

---

## Step 1 — Create `src/lib/markdownRenderer.tsx`

`MarkdownEditor` imports two named exports from this module:

```ts
import { MarkdownRenderer, ImageGallery } from "@/lib/markdownRenderer";
```

Install the required packages first:

```bash
npm install react-markdown remark-gfm
```

Then create the file:

```tsx
// src/lib/markdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders a markdown string as styled HTML. */
export const MarkdownRenderer = ({ children }: { children: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    className="prose prose-sm max-w-none dark:prose-invert
      prose-headings:font-serif prose-headings:text-foreground
      prose-p:text-foreground/85 prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-code:bg-muted prose-code:px-1.5 prose-code:rounded
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-img:rounded-lg prose-img:shadow-sm"
  >
    {children}
  </ReactMarkdown>
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
```

---

## Step 2 — Place `MarkdownEditor.tsx`

Move or copy the uploaded file to:

```
src/components/MarkdownEditor.tsx
```

The component also uploads images to a Supabase Storage bucket called `blog-images`. Create that bucket in your Supabase dashboard (public, policy: authenticated users can upload) or rename the bucket reference in `uploadOneFile` to match your existing `post_images` bucket:

```ts
// src/components/MarkdownEditor.tsx  ~line 244
const { data, error } = await supabase.storage
  .from("post_images")          // ← change "blog-images" → "post_images"
  .upload(`markdown/${name}`, file);
// and the public URL line:
return supabase.storage.from("post_images").getPublicUrl(data.path).data.publicUrl;
```

---

## Step 3 — Update `AdminPostEditor`

### 3a. Add the import

```tsx
// src/pages/admin/AdminPostEditor.tsx
import MarkdownEditor from "@/components/MarkdownEditor";
```

### 3b. Replace the body `<textarea>` with `<MarkdownEditor>`

**Remove** the existing body field (around line 130 in the current file):

```tsx
// REMOVE THIS:
<div>
  <Label htmlFor="body" className="font-sans text-sm">Body</Label>
  <textarea
    id="body"
    value={form.body}
    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
    placeholder="Full article content..."
    rows={12}
    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
  />
</div>
```

**Replace** it with:

```tsx
<div>
  <Label className="font-sans text-sm mb-2 block">Body</Label>
  <MarkdownEditor
    value={form.body}
    onChange={(body) => setForm((f) => ({ ...f, body }))}
    placeholder="Write your article in Markdown…"
    minHeight={480}
  />
</div>
```

---

## Step 4 — Widen the editor layout (optional but recommended)

`AdminPostEditor` is currently capped at `max-w-3xl`. The split-view mode in `MarkdownEditor` benefits from extra width. Change the wrapper:

```tsx
// Before
<div className="p-6 md:p-8 max-w-3xl">

// After
<div className="p-6 md:p-8 max-w-5xl">
```

---

## Expected result

| Feature | Before | After |
|---|---|---|
| Body input | Plain `<textarea>` | Rich `MarkdownEditor` with toolbar |
| Formatting | None | Bold, italic, headings, lists, code, HR |
| Media | URL-only via separate field | Drag-and-drop upload, gallery builder |
| Preview | None | Edit / Split / Preview toggle |
| Tables | Manual markdown | Visual table builder dialog |

---

## Files changed summary

| File | Action |
|---|---|
| `src/components/MarkdownEditor.tsx` | **Add** (copy from upload) |
| `src/lib/markdownRenderer.tsx` | **Create** (new file) |
| `src/pages/admin/AdminPostEditor.tsx` | **Edit** — swap textarea → `<MarkdownEditor>` |
| Supabase Storage | **Confirm** `post_images` bucket exists and is public |
