import React, { useState, useRef, useCallback } from "react";
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Image as ImageIcon, LayoutGrid, Table as TableIcon,
  Eye, Edit3, Columns2, X, Plus, Strikethrough,
  Minus,
} from "lucide-react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MarkdownRenderer, ImageGallery } from "@/lib/markdownRenderer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  uploading?: boolean;
}

type ViewMode = "edit" | "preview" | "split";

// ─── Gallery serializer ───────────────────────────────────────────────────────

const serializeGallery = (images: GalleryImage[]) => {
  const lines = images.map((img) => `![${img.alt || "image"}](${img.url})`).join("\n");
  return `\n<!-- gallery:start -->\n${lines}\n<!-- gallery:end -->\n`;
};

// ─── Drop Zone ────────────────────────────────────────────────────────────────

const DropZone = ({
  onFiles,
  disabled,
  children,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`transition-all duration-200 ${dragging ? "ring-2 ring-primary ring-offset-2 rounded-xl" : ""}`}
    >
      {children}
    </div>
  );
};

// ─── Toolbar separator ────────────────────────────────────────────────────────

const Separator = () => <div className="w-px h-5 bg-border/70 mx-0.5 shrink-0" />;

// ─── Toolbar button ───────────────────────────────────────────────────────────

const ToolBtn = ({
  icon: Icon,
  title,
  onClick,
  active,
  size = 15,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  active?: boolean;
  size?: number;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center w-7 h-7 rounded-md transition-all
      text-muted-foreground hover:text-foreground hover:bg-muted/60
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      ${active ? "bg-primary/10 text-primary" : ""}
    `}
  >
    <Icon size={size} />
  </button>
);

// ─── View mode button ─────────────────────────────────────────────────────────

const ViewBtn = ({
  icon: Icon,
  label,
  mode,
  current,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  mode: ViewMode;
  current: ViewMode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all
      ${current === mode
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      }
    `}
  >
    <Icon size={13} />
    {label}
  </button>
);

// ─── Editor pane ──────────────────────────────────────────────────────────────

const EditorPane = React.forwardRef<
  HTMLTextAreaElement,
  { value: string; onChange: (v: string) => void; placeholder?: string; minHeight: number }
>(({ value, onChange, placeholder, minHeight }, ref) => (
  <div className="relative flex-1 flex flex-col min-w-0">
    <div className="absolute top-2 right-3 text-[10px] text-muted-foreground/50 font-mono select-none z-10">
      {value.length} chars · {value.split("\n").length} lines
    </div>
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Start writing in Markdown…"}
      style={{ minHeight }}
      className="flex-1 w-full h-full border-0 focus-visible:ring-0 resize-none font-mono text-sm leading-[1.75] bg-transparent p-4 pt-5 text-foreground/90 placeholder:text-muted-foreground/50"
    />
  </div>
));
EditorPane.displayName = "EditorPane";

// ─── Preview pane ─────────────────────────────────────────────────────────────

const PreviewPane = ({ value, minHeight }: { value: string; minHeight: number }) => (
  <div
    className="flex-1 overflow-y-auto px-6 py-5 min-w-0 border-l border-border/50"
    style={{ minHeight }}
  >
    {value.trim() ? (
      <MarkdownRenderer>{value}</MarkdownRenderer>
    ) : (
      <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-muted-foreground/50 select-none">
        <Eye size={32} className="mb-3 opacity-30" />
        <p className="text-sm">Nothing to preview yet…</p>
      </div>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: MarkdownEditorProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [dialog, setDialog] = useState<"link" | "image" | "gallery" | "table" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [linkData, setLinkData] = useState({ text: "", url: "" });
  const [imageData, setImageData] = useState({ alt: "", url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [tableData, setTableData] = useState({
    rows: 3,
    cols: 3,
    data: Array(4).fill(null).map(() => Array(3).fill("")) as string[][],
  });

  // Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // ── Cursor helpers ────────────────────────────────────────────────────────────

  const insertAtCursor = useCallback(
    (before: string, after = "") => {
      const ta = textareaRef.current;
      if (!ta) { onChange(value + before + after); return; }
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.substring(start, end);
      const next =
        value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(next);
      setDialog(null);
      setImageData({ alt: "", url: "" });
      setLinkData({ text: "", url: "" });
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + before.length + selected.length + after.length;
        ta.setSelectionRange(pos, pos);
      });
    },
    [value, onChange]
  );

  const wrap = (sym: string) => insertAtCursor(sym, sym);

  // ── Image upload helpers ──────────────────────────────────────────────────────

  const uploadOneFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("post_images")
      .upload(`markdown/${name}`, file);
    if (error) throw error;
    return supabase.storage.from("post_images").getPublicUrl(data.path).data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";

    // Multiple files → close image dialog and route into gallery flow
    if (files.length > 1) {
      setDialog("gallery");
      setImageData({ alt: "", url: "" });
      await handleGalleryFiles(files);
      return;
    }

    const file = files[0];
    setIsUploading(true);
    const id = toast.loading("Uploading image…");
    try {
      const url = await uploadOneFile(file);
      setImageData((p) => ({ ...p, url, alt: p.alt || file.name.replace(/\.[^.]+$/, "") }));
      toast.success("Uploaded!", { id });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed", { id });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryFiles = async (files: File[]) => {
    const placeholders: GalleryImage[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
      alt: f.name.replace(/\.[^.]+$/, ""),
      uploading: true,
    }));
    setGalleryImages((p) => [...p, ...placeholders]);
    await Promise.all(
      files.map(async (file, i) => {
        try {
          const url = await uploadOneFile(file);
          setGalleryImages((p) =>
            p.map((img) => (img.id === placeholders[i].id ? { ...img, url, uploading: false } : img))
          );
        } catch {
          toast.error(`Failed to upload ${file.name}`);
          setGalleryImages((p) => p.filter((img) => img.id !== placeholders[i].id));
        }
      })
    );
  };

  const handleGalleryInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) await handleGalleryFiles(files);
    e.target.value = "";
  };

  const insertGallery = () => {
    if (!galleryImages.length) return;
    insertAtCursor(serializeGallery(galleryImages));
    setGalleryImages([]);
  };

  // ── Table builder ─────────────────────────────────────────────────────────────

  const resizeTable = (type: "rows" | "cols", val: number) => {
    const n = Math.max(1, Math.min(val, 15));
    setTableData((prev) => {
      const rows = type === "rows" ? n : prev.rows;
      const cols = type === "cols" ? n : prev.cols;
      const data = Array(rows + 1)
        .fill(null)
        .map((_, r) => Array(cols).fill("").map((_, c) => prev.data[r]?.[c] ?? ""));
      return { rows, cols, data };
    });
  };

  const buildTable = () => {
    const header = "| " + tableData.data[0].map((c) => c || "Header").join(" | ") + " |";
    const divider = "| " + Array(tableData.cols).fill("---").join(" | ") + " |";
    const rows = Array.from({ length: tableData.rows }, (_, i) =>
      "| " + tableData.data[i + 1].map((c) => c || "Cell").join(" | ") + " |"
    );
    insertAtCursor("\n" + [header, divider, ...rows].join("\n") + "\n");
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <DropZone onFiles={handleGalleryFiles} disabled={!!dialog}>
      <div className="flex flex-col w-full border border-border rounded-xl overflow-hidden bg-card shadow-sm">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 bg-muted/40 border-b border-border">
          {/* Format */}
          <ToolBtn icon={Bold} title="Bold (Ctrl+B)" onClick={() => wrap("**")} />
          <ToolBtn icon={Italic} title="Italic (Ctrl+I)" onClick={() => wrap("*")} />
          <ToolBtn icon={Strikethrough} title="Strikethrough" onClick={() => wrap("~~")} />
          <Separator />
          {/* Headings */}
          <ToolBtn icon={Heading1} title="Heading 1" onClick={() => insertAtCursor("# ")} />
          <ToolBtn icon={Heading2} title="Heading 2" onClick={() => insertAtCursor("## ")} />
          <ToolBtn icon={Heading3} title="Heading 3" onClick={() => insertAtCursor("### ")} />
          <Separator />
          {/* Lists */}
          <ToolBtn icon={List} title="Bullet list" onClick={() => insertAtCursor("- ")} />
          <ToolBtn icon={ListOrdered} title="Numbered list" onClick={() => insertAtCursor("1. ")} />
          <ToolBtn icon={Quote} title="Blockquote" onClick={() => insertAtCursor("> ")} />
          <ToolBtn icon={Code} title="Inline code" onClick={() => wrap("`")} />
          <ToolBtn icon={Minus} title="Horizontal rule" onClick={() => insertAtCursor("\n---\n")} />
          <Separator />
          {/* Insert */}
          <ToolBtn icon={LinkIcon} title="Insert link" onClick={() => setDialog("link")} />
          <ToolBtn icon={ImageIcon} title="Insert image" onClick={() => setDialog("image")} />
          <ToolBtn icon={LayoutGrid} title="Image gallery" onClick={() => { setGalleryImages([]); setDialog("gallery"); }} />
          <ToolBtn icon={TableIcon} title="Insert table" onClick={() => setDialog("table")} />
          <div className="flex-1" />
          {/* View mode switcher */}
          <div className="flex items-center gap-0.5 p-0.5 bg-background/60 rounded-lg border border-border/60">
            <ViewBtn icon={Edit3} label="Edit" mode="edit" current={viewMode} onClick={() => setViewMode("edit")} />
            <ViewBtn icon={Columns2} label="Split" mode="split" current={viewMode} onClick={() => setViewMode("split")} />
            <ViewBtn icon={Eye} label="Preview" mode="preview" current={viewMode} onClick={() => setViewMode("preview")} />
          </div>
        </div>

        {/* ── Main area ── */}
        <div
          className={`flex ${viewMode === "split" ? "divide-x divide-border/50" : ""}`}
          style={{ minHeight }}
        >
          {viewMode !== "preview" && (
            <EditorPane
              ref={textareaRef}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              minHeight={minHeight}
            />
          )}
          {viewMode !== "edit" && (
            <PreviewPane value={value} minHeight={minHeight} />
          )}
        </div>

        {/* ── Status bar ── */}
        <div className="flex items-center gap-3 px-4 py-1 bg-muted/30 border-t border-border text-[11px] text-muted-foreground/60 font-mono">
          <span>Markdown</span>
          <span className="flex-1" />
          {viewMode !== "preview" && (
            <span className="italic">💡 Drag & drop images to insert a gallery</span>
          )}
        </div>
      </div>

      {/* ── LINK DIALOG ── */}
      <Dialog open={dialog === "link"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Link text</Label>
              <Input value={linkData.text} onChange={(e) => setLinkData({ ...linkData, text: e.target.value })} placeholder="e.g. Read more" />
            </div>
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input value={linkData.url} onChange={(e) => setLinkData({ ...linkData, url: e.target.value })} placeholder="https://…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button onClick={() => insertAtCursor(`[${linkData.text || "link"}](${linkData.url || "https://"})`)} disabled={!linkData.url}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── IMAGE DIALOG ── */}
      <Dialog open={dialog === "image"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Insert Image</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all"
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : imageData.url ? (
                <img src={imageData.url} alt="Preview" className="h-24 w-auto object-cover rounded-lg shadow-sm" />
              ) : (
                <>
                  <Upload className="h-7 w-7 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Click to upload from computer</p>
                </>
              )}
            </div>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
            <p className="text-[11px] text-muted-foreground/70 text-center -mt-2">Tip: select multiple files to insert a gallery instead.</p>
            <div className="relative flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or use URL</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={imageData.url} onChange={(e) => setImageData({ ...imageData, url: e.target.value })} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label>Alt text / caption</Label>
              <Input value={imageData.alt} onChange={(e) => setImageData({ ...imageData, alt: e.target.value })} placeholder="e.g. Maize field at sunrise" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button disabled={!imageData.url || isUploading} onClick={() => insertAtCursor(`![${imageData.alt || "image"}](${imageData.url})`)}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── GALLERY DIALOG ── */}
      <Dialog open={dialog === "gallery"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutGrid size={18} /> Image Gallery
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
            {/* Upload zone */}
            <div
              onClick={() => galleryInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                if (files.length) await handleGalleryFiles(files);
              }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Click or drag images here</p>
              <p className="text-xs text-muted-foreground mt-1">Multiple images form a responsive grid</p>
            </div>
            <input type="file" ref={galleryInputRef} onChange={handleGalleryInput} className="hidden" accept="image/*" multiple />

            {galleryImages.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{galleryImages.length} image{galleryImages.length > 1 ? "s" : ""} — edit captions below</p>
                  <Button variant="ghost" size="sm" onClick={() => galleryInputRef.current?.click()} className="gap-1 text-xs">
                    <Plus size={13} /> Add more
                  </Button>
                </div>
                <div className={`grid gap-3 ${galleryImages.length === 1 ? "grid-cols-1" : galleryImages.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {galleryImages.map((img) => (
                    <div key={img.id} className="group space-y-1.5">
                      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                        {img.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                          </div>
                        )}
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages((p) => p.filter((x) => x.id !== img.id))}
                          className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <Input
                        value={img.alt}
                        onChange={(e) => setGalleryImages((p) => p.map((x) => x.id === img.id ? { ...x, alt: e.target.value } : x))}
                        placeholder="Caption (optional)"
                        className="h-7 text-xs"
                        disabled={img.uploading}
                      />
                    </div>
                  ))}
                </div>

                {/* Live preview */}
                <div className="rounded-xl border border-border p-4 bg-muted/20">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Preview</p>
                  <ImageGallery content={galleryImages.map((img) => `![${img.alt}](${img.url})`).join("\n")} />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="border-t border-border pt-4 mt-2">
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button
              onClick={insertGallery}
              disabled={!galleryImages.length || galleryImages.some((i) => i.uploading)}
              className="gap-2"
            >
              <LayoutGrid size={15} />
              Insert Gallery ({galleryImages.length} image{galleryImages.length !== 1 ? "s" : ""})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── TABLE DIALOG ── */}
      <Dialog open={dialog === "table"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Insert Table</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label>Rows (excl. header)</Label>
              <Input type="number" min="1" max="15" value={tableData.rows} onChange={(e) => resizeTable("rows", parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label>Columns</Label>
              <Input type="number" min="1" max="10" value={tableData.cols} onChange={(e) => resizeTable("cols", parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="overflow-x-auto border border-border rounded-xl bg-card">
            {tableData.data.map((row, r) => (
              <div key={r} className={`flex min-w-max divide-x divide-border border-b border-border last:border-b-0 ${r === 0 ? "bg-muted/50" : ""}`}>
                {row.map((cell, c) => (
                  <div key={c} className="p-1 min-w-[110px] flex-1">
                    <Input
                      value={cell}
                      onChange={(e) => {
                        const next = tableData.data.map((row) => [...row]);
                        next[r][c] = e.target.value;
                        setTableData((p) => ({ ...p, data: next }));
                      }}
                      placeholder={r === 0 ? `Header ${c + 1}` : `Row ${r} Col ${c + 1}`}
                      className={`border-0 shadow-none h-9 hover:bg-muted/30 focus-visible:ring-1 ${r === 0 ? "font-semibold text-xs uppercase tracking-wider" : "text-sm"}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button onClick={buildTable}>Insert Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropZone>
  );
};

export default MarkdownEditor;
