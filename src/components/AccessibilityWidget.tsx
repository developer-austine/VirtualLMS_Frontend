import { useState } from "react";
import {
  Circle, Link2, Type, Space, PauseCircle, EyeOff,
  BookOpen, MousePointer2, MessageSquare, AlignLeft,
  AlignCenter, AlignRight, X, Accessibility,
} from "lucide-react";

interface Setting {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "toggle" | "cycle";
  values?: string[];
}

const settings: Setting[] = [
  { id: "contrast",    label: "Contrast +",         icon: <Circle size={22} />,         type: "toggle" },
  { id: "links",       label: "Highlight Links",     icon: <Link2 size={22} />,          type: "toggle" },
  { id: "bigText",     label: "Bigger Text",         icon: <Type size={22} />,           type: "toggle" },
  { id: "spacing",     label: "Text Spacing",        icon: <Space size={22} />,          type: "toggle" },
  { id: "animations",  label: "Pause Animations",    icon: <PauseCircle size={22} />,    type: "toggle" },
  { id: "images",      label: "Hide Images",         icon: <EyeOff size={22} />,         type: "toggle" },
  { id: "dyslexia",    label: "Dyslexia Friendly",   icon: <BookOpen size={22} />,       type: "toggle" },
  { id: "cursor",      label: "Cursor",              icon: <MousePointer2 size={22} />,  type: "toggle" },
  { id: "tooltips",    label: "Tooltips",            icon: <MessageSquare size={22} />,  type: "toggle" },
  { id: "lineHeight",  label: "Line Height",         icon: <AlignLeft size={22} />,      type: "toggle" },
  { id: "textAlign",   label: "Text Align",          icon: <AlignCenter size={22} />,    type: "cycle", values: ["left", "center", "right"] },
];

const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<string, boolean | string>>({});

  const toggle = (id: string, type: "toggle" | "cycle", values?: string[]) => {
    setActive((prev) => {
      if (type === "cycle" && values) {
        const current = (prev[id] as string) ?? values[0];
        const idx = values.indexOf(current);
        return { ...prev, [id]: values[(idx + 1) % values.length] };
      }
      return { ...prev, [id]: !prev[id] };
    });

    // Apply effects to document
    const body = document.body;
    if (id === "contrast")   body.classList.toggle("accessibility-contrast");
    if (id === "bigText")    body.classList.toggle("accessibility-big-text");
    if (id === "spacing")    body.classList.toggle("accessibility-spacing");
    if (id === "links")      body.classList.toggle("accessibility-links");
    if (id === "animations") body.classList.toggle("accessibility-no-animations");
    if (id === "images")     body.classList.toggle("accessibility-hide-images");
    if (id === "dyslexia")   body.classList.toggle("accessibility-dyslexia");
    if (id === "cursor")     body.classList.toggle("accessibility-cursor");
    if (id === "lineHeight") body.classList.toggle("accessibility-line-height");
  };

  const resetAll = () => {
    setActive({});
    const body = document.body;
    ["accessibility-contrast","accessibility-big-text","accessibility-spacing",
     "accessibility-links","accessibility-no-animations","accessibility-hide-images",
     "accessibility-dyslexia","accessibility-cursor","accessibility-line-height",
    ].forEach(c => body.classList.remove(c));
  };

  const isOn = (id: string) => !!active[id];

  return (
    <>
      {/* ── Global accessibility styles ─────────────── */}
      <style>{`
        .accessibility-contrast { filter: contrast(150%) !important; }
        .accessibility-big-text * { font-size: 120% !important; }
        .accessibility-spacing * { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        .accessibility-links a { text-decoration: underline !important; outline: 2px solid #c9a227 !important; outline-offset: 2px; }
        .accessibility-no-animations *, .accessibility-no-animations *::before, .accessibility-no-animations *::after {
          animation: none !important; transition: none !important;
        }
        .accessibility-hide-images img { visibility: hidden !important; }
        .accessibility-dyslexia * { font-family: 'Comic Sans MS', 'Arial', sans-serif !important; }
        .accessibility-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Cpath fill='%231a2a5e' d='M4 0l16 12-7 1-4 8z'/%3E%3C/svg%3E") 0 0, auto !important; }
        .accessibility-line-height * { line-height: 2 !important; }
      `}</style>

      {/* ── Floating trigger button — centered, orange, bigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open accessibility menu"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] w-14 h-14 rounded-full bg-orange-500 text-white shadow-xl flex items-center justify-center hover:bg-orange-600 transition-colors duration-200"
      >
        <Accessibility size={28} />
      </button>

      {/* ── Panel — full height, slides in from right ── */}
      {open && (
        <div className="fixed right-0 top-0 z-[9999] w-80 h-screen bg-white shadow-2xl border-l border-gray-200 overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a2a5e] text-white">
            <div className="flex items-center gap-2">
              <Accessibility size={16} />
              <span className="font-black text-sm tracking-wide">Accessibility Menu</span>
              <kbd className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">CTRL+U</kbd>
            </div>
            <button onClick={() => setOpen(false)} className="hover:text-[#c9a227] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* How it works link */}
          <div className="px-4 py-2 bg-[#c9a227] flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#c9a227] font-black text-xs">▶</span>
            </div>
            <span className="text-[#1a2a5e] font-black text-xs">How AccessAbility Works</span>
          </div>

          {/* Oversized Widget toggle */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-600">Oversized Widget</span>
            <button
              onClick={() => toggle("oversized", "toggle")}
              className={`w-8 h-4 rounded-full transition-colors relative ${isOn("oversized") ? "bg-[#c9a227]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${isOn("oversized") ? "left-4" : "left-0.5"}`} />
            </button>
          </div>

          {/* Settings grid — scrollable middle */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-px bg-gray-100 p-px">
              {settings.map((s) => {
                const on = isOn(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id, s.type, s.values)}
                    className={`flex flex-col items-center justify-center gap-2 py-6 px-2 bg-white transition-colors hover:bg-orange-50 ${
                      on ? "ring-2 ring-inset ring-orange-500 bg-orange-50" : ""
                    }`}
                  >
                    <span className={`transition-colors ${on ? "text-orange-500" : "text-[#1a2a5e]"}`}>
                      {s.icon}
                    </span>
                    <span className={`text-[11px] font-semibold text-center leading-tight ${on ? "text-orange-500" : "text-gray-600"}`}>
                      {s.label}
                      {s.type === "cycle" && active[s.id] && (
                        <span className="block text-[9px] text-orange-500 uppercase font-black">{active[s.id] as string}</span>
                      )}
                    </span>
                    {on && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer — pinned to bottom */}
          <div className="px-4 py-4 flex items-center justify-between border-t border-gray-100 bg-white flex-shrink-0">
            <button
              onClick={resetAll}
              className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors"
            >
              Reset all
            </button>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span>Powered by</span>
              <span className="font-black text-[#1a2a5e]">AccessAbility</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityWidget;