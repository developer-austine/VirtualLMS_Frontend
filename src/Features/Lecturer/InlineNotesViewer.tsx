import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getNotesBySubUnitLecturer } from "@/Redux-Toolkit/features/Notes/noteThunk";

interface Props {
  subUnitId: number;   
  courseId:  number;
  isLecturer?: boolean;
  onEdit?: () => void;
}

const InlineNotesViewer = ({
  subUnitId, courseId, isLecturer = false, onEdit,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { notes, loading } = useSelector((state: RootState) => state.notes);
  const { jwt }            = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  useEffect(() => {
    if (!token || !courseId || !subUnitId) return;
    dispatch(getNotesBySubUnitLecturer({ courseId, subUnitId, token }));
  }, [dispatch, courseId, subUnitId, token]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-4 mb-3 px-5 py-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-center gap-2 text-indigo-400">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-xs font-semibold">Loading notes...</span>
      </div>
    );
  }

  // ── No notes yet ──────────────────────────────────────────────────────────
  if (notes.length === 0) {
    if (!isLecturer) return null;
    return (
      <div className="mx-4 mb-3 px-5 py-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-center">
        <p className="text-xs text-indigo-400 font-semibold italic">
          No notes published yet. Click "Edit Notes" to start writing.
        </p>
      </div>
    );
  }

  // ── Render each note ──────────────────────────────────────────────────────
  return (
    <div className="mx-4 mb-3 space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="rounded-xl border border-indigo-100 overflow-hidden shadow-sm">

          {/* Note header bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-sm">{note.title}</span>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                Published
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-[10px]">
                {note.updatedAt
                  ? new Date(note.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—"
                }
              </span>
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

          {/* Rendered note content */}
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
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-px bg-red-200/60" />
              <div
                className="prose max-w-none text-[#1a2a5e] text-base leading-8 note-content"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
          </div>

          {/* By line */}
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-semibold">
              By {note.createdByLecturerName ?? "Lecturer"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InlineNotesViewer;