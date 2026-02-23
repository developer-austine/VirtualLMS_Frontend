import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Undo, Redo, Minus, RemoveFormatting,
  Link2, Type, Highlighter, Palette,
  Send, Save, CheckCircle2, ChevronDown, ArrowLeft,
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
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

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
const TEXT_COLORS = ["#000000","#1a2a5e","#c9a227","#ef4444","#22c55e","#3b82f6","#8b5cf6","#f97316","#6b7280","#ffffff"];
const HIGHLIGHT_COLORS = ["#fef08a","#bbf7d0","#bfdbfe","#fde68a","#fecaca","#e9d5ff","#fed7aa","#f0f0f0"];

const NotesEditor = () => {
  const { id, noteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const course = lecturerCourses.find((c) => c.id === id);

  const initialTitle = (location.state as { title?: string })?.title ?? "Untitled Note";
  const ed = useNotesEditor(noteId ?? "new", initialTitle);

  const [linkDialog, setLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl]       = useState("");
  const [linkText, setLinkText]     = useState("");

  const handlePublish = async () => {
    await ed.publish();
    setTimeout(() => navigate(`/lecturer/course/${id}`), 1000);
  };

  const handleLink = () => {
    ed.insertLink(linkUrl, linkText);
    setLinkUrl(""); setLinkText(""); setLinkDialog(false);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${schoolOfBusiness})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* ── Top bar ─────────────────────────── */}
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
                <span className="text-[10px] text-gray-400 hidden sm:block">Saved {ed.lastSaved}</span>
              )}
              <span className="text-[10px] text-gray-400 hidden sm:block">{ed.wordCount} words</span>
              <Button variant="outline" size="sm" onClick={() => ed.save()} disabled={ed.saving} className="gap-1.5 text-xs border-gray-200">
                {ed.saving
                  ? <><div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Saving...</>
                  : <><Save size={13} /> Save</>
                }
              </Button>
              <Button size="sm" onClick={handlePublish}
                className={`gap-1.5 text-xs font-bold text-white ${ed.published ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"}`}>
                {ed.published ? <><CheckCircle2 size={13} /> Published!</> : <><Send size={13} /> Publish</>}
              </Button>
            </div>
          </div>

          {/* Course badge */}
          {course && (
            <div className="px-6 py-2 bg-indigo-50/60 border-b border-gray-100 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${course.color}`} />
              <span className="text-xs text-gray-500 font-semibold">{course.code}: {course.name}</span>
            </div>
          )}

          {/* ── Toolbar ──────────────────────────── */}
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
                  <DropdownMenuItem onSelect={ed.heading1} className="font-black text-xl">Heading 1</DropdownMenuItem>
                  <DropdownMenuItem onSelect={ed.heading2} className="font-black text-lg">Heading 2</DropdownMenuItem>
                  <DropdownMenuItem onSelect={ed.heading3} className="font-black text-base">Heading 3</DropdownMenuItem>
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
              <TB onClick={ed.bold}          title="Bold">        <Bold size={14} /></TB>
              <TB onClick={ed.italic}        title="Italic">      <Italic size={14} /></TB>
              <TB onClick={ed.underline}     title="Underline">   <Underline size={14} /></TB>
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

          {/* ── Editor ───────────────────────────── */}
          <div className="relative px-12 py-10 min-h-[520px]">
            <div className="absolute inset-0 pointer-events-none"
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

          {/* ── Status bar ───────────────────────── */}
          <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span>{ed.wordCount} words</span>
              {ed.lastSaved && <span>Last saved: {ed.lastSaved}</span>}
              {ed.published && (
                <span className="flex items-center gap-1 text-green-600 font-bold">
                  <CheckCircle2 size={10} /> Published
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-300">KCAU Virtual Campus · Lecturer Notes</span>
          </div>
        </div>
      </div>

      {/* Link dialog */}
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