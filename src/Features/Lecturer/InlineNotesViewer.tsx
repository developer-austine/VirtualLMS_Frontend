import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, NotebookPen, Pencil } from "lucide-react";
import type { RootState } from "@/Redux-Toolkit/globalState";
import api from "@/utils/api";

interface NotesDto {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  createdByLecturerName: string;
}

interface Props {
  subUnitId: number;
  courseId: number;
  isLecturer?: boolean;
  onEdit?: () => void;
}

const InlineNotesViewer = ({ subUnitId, isLecturer = false, onEdit }: Props) => {
  const { jwt } = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [notes,   setNotes]   = useState<NotesDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !subUnitId) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/lecturer/sub-units/${subUnitId}/notes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.data ?? res.data;
        setNotes(Array.isArray(data) ? data : []);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subUnitId, token]);

  if (loading) {
    return (
      <div className="px-4 py-3 flex items-center gap-2 text-gray-400">
        <Loader2 size={13} className="animate-spin" />
        <span className="text-xs">Loading notes...</span>
      </div>
    );
  }

  if (notes.length === 0) {
    if (!isLecturer) return null;
    return (
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <NotebookPen size={13} />
          <span className="text-xs italic">No notes published yet.</span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:underline"
          >
            <Pencil size={11} /> Add Notes
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notes.map((note) => (
        <div key={note.id} className="px-4 py-4">

          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <NotebookPen size={13} className="text-indigo-400 flex-shrink-0" />
              <span className="text-sm font-bold text-[#1a2a5e]">{note.title}</span>
              <span className="text-[10px] text-gray-400">
                {note.updatedAt
                  ? new Date(note.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            {isLecturer && onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:underline"
              >
                <Pencil size={10} /> Edit
              </button>
            )}
          </div>

          {/* Note content — plain white, lined paper feel */}
          <div
            className="px-6 py-5 rounded-lg border border-gray-100 bg-white"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #f3f4f6 31px, #f3f4f6 32px)",
              backgroundPositionY: "8px",
              fontFamily: "'Georgia', serif",
              lineHeight: "2rem",
            }}
          >
            <div
              className="prose prose-sm max-w-none text-gray-800 leading-8"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>

          {/* By line */}
          <p className="mt-2 text-[10px] text-gray-400">
            By {note.createdByLecturerName ?? "Lecturer"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InlineNotesViewer;