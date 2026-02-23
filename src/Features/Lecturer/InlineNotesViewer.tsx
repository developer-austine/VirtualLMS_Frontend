import { notesStore } from "./data/Notesstore";

interface Props {
  materialId: string;
  isLecturer?: boolean;
  onEdit?: () => void;
}

const InlineNotesViewer = ({ materialId, isLecturer = false, onEdit }: Props) => {
  const note = notesStore.load(materialId);

  if (!note || !note.content) {
    if (!isLecturer) return null;
    return (
      <div className="mx-4 mb-3 px-5 py-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-center">
        <p className="text-xs text-indigo-400 font-semibold italic">No content yet. Click "Edit Notes" to start writing.</p>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-3 rounded-xl border border-indigo-100 overflow-hidden shadow-sm">
      {/* Note header bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm">{note.title}</span>
          {note.published && (
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
              Published
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-[10px]">Last saved: {note.savedAt}</span>
          {isLecturer && onEdit && (
            <button
              onClick={onEdit}
              className="text-[11px] font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              ✏️ Edit Notes
            </button>
          )}
        </div>
      </div>

      {/* Rendered note content — styled like the real document */}
      <div
        className="px-10 py-8 bg-white"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
          backgroundPositionY: "40px",
          fontFamily: "'Georgia', serif",
          lineHeight: "2rem",
          minHeight: "120px",
        }}
      >
        {/* Left margin line */}
        <div className="relative">
          <div className="absolute -left-6 top-0 bottom-0 w-px bg-red-200/60" />
          <div
            className="prose max-w-none text-[#1a2a5e] text-base leading-8 note-content"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default InlineNotesViewer;