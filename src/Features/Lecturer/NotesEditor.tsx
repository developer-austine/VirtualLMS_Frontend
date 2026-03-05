import { useState } from "react";
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Undo, Redo, Minus, RemoveFormatting,
  Link2, Type, Highlighter, Palette,
  Send, Save, CheckCircle2, ChevronDown, ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useNotesEditor } from "../../hooks/useNotesEditor";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { createNote } from "@/Redux-Toolkit/features/Notes/noteThunk";
import { useBanner } from "@/hooks/useBanner";

// ── Toolbar helpers ───────────────────────────────────────────────────────────
const TB = ({ onClick, title, children }: {
  onClick: () => void; title: string; children: React.ReactNode;
}) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className="w-8 h-8 flex items-center justify-center rounded transition-all text-gray-600 hover:bg-gray-100 hover:text-[#1a2a5e]"
  >
    {children}
  </button>
);

const Sep = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

const FONT_SIZES: Record<string, string> = {
  "1": "8pt","2":"10pt","3":"12pt","4":"14pt","5":"18pt","6":"24pt","7":"36pt",
};
const TEXT_COLORS      = ["#000000","#1a2a5e","#c9a227","#ef4444","#22c55e","#3b82f6","#8b5cf6","#f97316","#6b7280","#ffffff"];
const HIGHLIGHT_COLORS = ["#fef08a","#bbf7d0","#bfdbfe","#fde68a","#fecaca","#e9d5ff","#fed7aa","#f0f0f0"];

// ─────────────────────────────────────────────────────────────────────────────

const NotesEditor = () => {
  const { id, noteId } = useParams();
  const navigate       = useNavigate();
  const location       = useLocation();
  const dispatch       = useDispatch<AppDispatch>();

  const { jwt }               = useSelector((state: RootState) => state.auth);
  const { loading: saving }   = useSelector((state: RootState) => state.notes);
  const token = jwt || localStorage.getItem("jwt") || "";

  // subUnitId may be passed via location.state when creating a new note
  const subUnitId   = (location.state as any)?.subUnitId as number | undefined;
  const initialTitle = (location.state as { title?: string })?.title ?? "Untitled Note";

  const ed = useNotesEditor(noteId ?? "new", initialTitle);

  const [linkDialog, setLinkDialog] = useState(false);
  const [linkUrl,    setLinkUrl]    = useState("");
  const [linkText,   setLinkText]   = useState("");
  const [published,  setPublished]  = useState(false);
  const [publishing, setPublishing] = useState(false);

  // ── Publish = POST to backend ─────────────────────────────────────────────
  const handlePublish = async () => {
    if (!id || !subUnitId) {
      toast.error("Missing course or sub-unit context. Cannot publish.");
      return;
    }
    // Read content directly from the contentEditable div via the ref
    const content = (ed.initContent as unknown as React.RefObject<HTMLDivElement>).current?.innerHTML ?? "";
    if (!content.trim() || content === "<br>") {
      toast.error("Note has no content to publish");
      return;
    }

    setPublishing(true);
    const result = await dispatch(createNote({
      courseId:  Number(id),
      subUnitId: Number(subUnitId),
      token,
      data: {
        title:   ed.title,
        content: content,
      },
    }));
    setPublishing(false);

    if (createNote.fulfilled.match(result)) {
      toast.success("Note published successfully!");
      setPublished(true);
      setTimeout(() => navigate(`/lecturer/course/${id}`), 1200);
    } else {
      toast.error(result.payload as string || "Failed to publish note");
    }
  };

  // ── Local save (keeps using useNotesEditor hook's local save) ─────────────
  const handleSave = () => {
    ed.save();
    toast.success("Draft saved locally");
  };

  const handleLink = () => {
    ed.insertLink(linkUrl, linkText);
    setLinkUrl(""); setLinkText(""); setLinkDialog(false);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${useBanner()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* ── Top bar ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate(`/lecturer/course/${id}`)}
                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline flex-shrink-0"
              >
                <ArrowLeft size={13} /> Back
              </button>
              <div className="h-4 w-px bg-gray-200 flex-shrink-0" />
              <input
                value={ed.title}
                onChange={(e) => ed.setTitle(e.target.value)}
                className="flex-1 text-lg font-black text-[#1a2a5e] bg-transparent border-none outline-none min-w-0 placeholder:text-gray-300"
                placeholder="Note title..."
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {ed.lastSaved && (
                <span className="text-[10px] text-gray-400 hidden sm:block">
                  Draft saved {ed.lastSaved}
                </span>
              )}
              <span className="text-[10px] text-gray-400 hidden sm:block">
                {ed.wordCount} words
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 text-xs border-gray-200"
              >
                <Save size={13} /> Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={publishing || published}
                className={`gap-1.5 text-xs font-bold text-white ${
                  published
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#1a2a5e] hover:bg-[#132047]"
                }`}
              >
                {publishing
                  ? <><Loader2 size={13} className="animate-spin" /> Publishing...</>
                  : published
                  ? <><CheckCircle2 size={13} /> Published!</>
                  : <><Send size={13} /> Publish</>
                }
              </Button>
            </div>
          </div>

          {/* Sub-unit context badge */}
          {subUnitId && (
            <div className="px-6 py-2 bg-indigo-50/60 border-b border-gray-100 flex items-center gap-2">
              <span className="text-xs text-indigo-500 font-semibold">
                Publishing to sub-unit #{subUnitId}
              </span>
            </div>
          )}

          {/* ── Toolbar ──────────────────────────────────────────────────── */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/80">
            <div className="flex flex-wrap items-center gap-0.5">
              <TB onClick={ed.undo} title="Undo"><Undo size={14} /></TB>
              <TB onClick={ed.redo} title="Redo"><Redo size={14} /></TB>
              <Sep />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 h-8 px-2 rounded text-xs font-bold text-gray-600 hover:bg-gray-100">
                    <Type size={13} /> Style <ChevronDown size={10} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={ed.heading1}  className="font-black text-xl">Heading 1</DropdownMenuItem>
                  <DropdownMenuItem onSelect={ed.heading2}  className="font-black text-lg">Heading 2</DropdownMenuItem>
                  <DropdownMenuItem onSelect={ed.heading3}  className="font-black text-base">Heading 3</DropdownMenuItem>
                  <DropdownMenuItem onSelect={ed.paragraph}>Paragraph</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 h-8 px-2 rounded text-xs font-bold text-gray-600 hover:bg-gray-100">
                    Size <ChevronDown size={10} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(FONT_SIZES).map(([v, label]) => (
                    <DropdownMenuItem key={v} onSelect={() => ed.setFontSize(v)}>{label}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Sep />
              <TB onClick={ed.bold}          title="Bold">         <Bold size={14} /></TB>
              <TB onClick={ed.italic}        title="Italic">       <Italic size={14} /></TB>
              <TB onClick={ed.underline}     title="Underline">    <Underline size={14} /></TB>
              <TB onClick={ed.strikethrough} title="Strikethrough"><Strikethrough size={14} /></TB>
              <Sep />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button title="Text color" className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                    <Palette size={14} className="text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 w-44">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Text Color</p>
                  <div className="grid grid-cols-5 gap-1">
                    {TEXT_COLORS.map((c) => (
                      <button key={c} onMouseDown={(e) => { e.preventDefault(); ed.setColor(c); }}
                        style={{ backgroundColor: c }}
                        className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform" />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button title="Highlight" className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">
                    <Highlighter size={14} className="text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 w-40">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 px-1">Highlight</p>
                  <div className="grid grid-cols-4 gap-1">
                    {HIGHLIGHT_COLORS.map((c) => (
                      <button key={c} onMouseDown={(e) => { e.preventDefault(); ed.setHighlight(c); }}
                        style={{ backgroundColor: c }}
                        className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform" />
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Sep />
              <TB onClick={ed.alignLeft}    title="Align left">   <AlignLeft size={14} /></TB>
              <TB onClick={ed.alignCenter}  title="Align center"> <AlignCenter size={14} /></TB>
              <TB onClick={ed.alignRight}   title="Align right">  <AlignRight size={14} /></TB>
              <TB onClick={ed.alignJustify} title="Justify">      <AlignJustify size={14} /></TB>
              <Sep />
              <TB onClick={ed.bulletList}   title="Bullet list">  <List size={14} /></TB>
              <TB onClick={ed.numberedList} title="Numbered list"><ListOrdered size={14} /></TB>
              <TB onClick={ed.indent}       title="Indent">       <Indent size={14} /></TB>
              <TB onClick={ed.outdent}      title="Outdent">      <Outdent size={14} /></TB>
              <Sep />
              <TB onClick={() => setLinkDialog(true)} title="Insert link"><Link2 size={14} /></TB>
              <TB onClick={ed.insertHR}     title="Horizontal rule"><Minus size={14} /></TB>
              <TB onClick={ed.removeFormat} title="Clear formatting"><RemoveFormatting size={14} /></TB>
            </div>
          </div>

          {/* ── Editor body ──────────────────────────────────────────────── */}
          <div className="relative px-12 py-10 min-h-[520px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
                backgroundPositionY: "40px",
                opacity: 0.4,
              }}
            />
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-200/60 pointer-events-none" />
            <div
              ref={ed.initContent}
              contentEditable
              suppressContentEditableWarning
              onInput={ed.countWords}
              data-placeholder="Start writing your notes here..."
              className="relative z-10 min-h-[480px] outline-none text-[#1a2a5e] text-base leading-8"
              style={{ fontFamily: "'Georgia', serif", lineHeight: "2rem" }}
            />
          </div>

          {/* ── Status bar ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span>{ed.wordCount} words</span>
              {ed.lastSaved && <span>Draft saved: {ed.lastSaved}</span>}
              {published && (
                <span className="flex items-center gap-1 text-green-600 font-bold">
                  <CheckCircle2 size={10} /> Published to backend
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-300">
              SKYLIMIT Virtual Campus · Lecturer Notes
            </span>
          </div>
        </div>
      </div>

      {/* ── Link dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#1a2a5e] font-black text-sm">Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Display Text</label>
              <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="e.g. Click here" className="text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">URL</label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className="text-sm" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-sm" onClick={() => setLinkDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white text-sm" onClick={handleLink}>Insert</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        [data-placeholder]:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; font-style: italic; }
        [contenteditable] h1 { font-size: 2rem; font-weight: 900; color: #1a2a5e; margin: 0.5em 0; }
        [contenteditable] h2 { font-size: 1.5rem; font-weight: 800; color: #1a2a5e; margin: 0.4em 0; }
        [contenteditable] h3 { font-size: 1.2rem; font-weight: 700; color: #1a2a5e; margin: 0.3em 0; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; }
        [contenteditable] hr { border: none; border-top: 2px solid #c9a227; margin: 1rem 0; }
        [contenteditable] p  { margin: 0; }
      `}</style>
    </div>
  );
};

export default NotesEditor;