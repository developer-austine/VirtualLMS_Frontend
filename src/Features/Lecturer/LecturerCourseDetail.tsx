import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, ArrowLeft, Plus, Megaphone,
  Link2, Video, FileText, HelpCircle, Trash2,
  Users, BarChart2, NotebookPen, Loader2, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourseById } from "@/Redux-Toolkit/features/Course/courseThunk";
import {
  getSubUnitsByCourse,
  createSubUnit,
} from "@/Redux-Toolkit/features/subUnit/subunitThunk";
import InlineNotesViewer from "./InlineNotesViewer";
import { useBanner } from "@/hooks/useBanner";

type MaterialType = "file" | "video" | "quiz" | "assignment" | "link" | "announcement" | "notes";

const materialTypes: MaterialType[] = [
  "file", "video", "quiz", "assignment", "link", "announcement", "notes",
];

const typeIcon = (type: MaterialType, size = 15) => {
  switch (type) {
    case "announcement": return <Megaphone   size={size} className="text-[#c9a227]"  />;
    case "link":         return <Link2       size={size} className="text-blue-500"   />;
    case "video":        return <Video       size={size} className="text-red-500"    />;
    case "file":         return <FileText    size={size} className="text-orange-400" />;
    case "quiz":         return <HelpCircle  size={size} className="text-purple-500" />;
    case "assignment":   return <FileText    size={size} className="text-green-500"  />;
    case "notes":        return <NotebookPen size={size} className="text-indigo-500" />;
  }
};

const LecturerCourseDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedCourse, loading: courseLoading } = useSelector((state: RootState) => state.course);
  const { subUnits, loading: subUnitLoading }       = useSelector((state: RootState) => state.subUnit);
  const { jwt } = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [collapsed,       setCollapsed]       = useState<Set<number>>(new Set());
  const [expandedNotes,   setExpandedNotes]   = useState<Set<number>>(new Set());
  const [addDialog,       setAddDialog]       = useState(false);
  const [targetSubUnit,   setTargetSubUnit]   = useState<number | null>(null);
  const [newTitle,        setNewTitle]        = useState("");
  const [newType,         setNewType]         = useState<MaterialType>("file");
  const [sectionDialog,   setSectionDialog]   = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [creating,        setCreating]        = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    dispatch(getLecturerCourseById({ token, courseId: Number(id) }));
    dispatch(getSubUnitsByCourse({ token, courseId: Number(id) }));
  }, [dispatch, id, token]);

  const loading = courseLoading || subUnitLoading;

  const toggleSection = (sid: number) =>
    setCollapsed(p => { const n = new Set(p); n.has(sid) ? n.delete(sid) : n.add(sid); return n; });

  const toggleNotes = (sid: number) =>
    setExpandedNotes(p => { const n = new Set(p); n.has(sid) ? n.delete(sid) : n.add(sid); return n; });

  // ── Create sub-unit (section) ─────────────────────────────────────────────
  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !id) return;
    setCreating(true);
    const result = await dispatch(createSubUnit({
      token,
      courseId: Number(id),
      data: { title: newSectionTitle.trim() },
    }));
    setCreating(false);
    if (createSubUnit.fulfilled.match(result)) {
      toast.success("Section created!");
      setNewSectionTitle("");
      setSectionDialog(false);
      dispatch(getSubUnitsByCourse({ token, courseId: Number(id) }));
    } else {
      toast.error(result.payload as string || "Failed to create section");
    }
  };

  // ── Notes material — navigate to editor ──────────────────────────────────
  const openNotesEditor = (subUnitId: number, title?: string) => {
    navigate(`/lecturer/course/${id}/notes/new`, {
      state: { subUnitId, title: title ?? "Untitled Note" },
    });
  };

  if (loading && !selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#1a2a5e]" />
      </div>
    );
  }

  if (!selectedCourse && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Course not found.</p>
      </div>
    );
  }

  const course = selectedCourse;

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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/lecturer/courses")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to My Courses
            </button>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-lg font-black text-[#1a2a5e]">
                  {course?.courseCode && <span className="text-gray-400 mr-1">{course.courseCode}:</span>}
                  {course?.courseName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {course?.semester}
                  {course?.creditHours && ` · ${course.creditHours} credits`}
                  {course?.totalEnrolledStudents != null && ` · ${course.totalEnrolledStudents} students`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs gap-1 border-gray-200"
                  onClick={() => navigate(`/lecturer/course/${id}/students`)}>
                  <Users size={13} /> Students
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1 border-gray-200"
                  onClick={() => navigate(`/lecturer/course/${id}/grades`)}>
                  <BarChart2 size={13} /> Grades
                </Button>
                <Button size="sm" className="text-xs gap-1 bg-[#1a2a5e] hover:bg-[#132047] text-white"
                  onClick={() => setSectionDialog(true)}>
                  <Plus size={13} /> Add Section
                </Button>
              </div>
            </div>
          </div>

          {/* ── Sub-units (sections) ───────────────────────────────────── */}
          <div className="p-6 space-y-3">
            {subUnitLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-6">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-semibold">Loading sections...</span>
              </div>
            ) : subUnits.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-semibold">No sections yet</p>
                <button
                  onClick={() => setSectionDialog(true)}
                  className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto"
                >
                  <Plus size={11} /> Add first section
                </button>
              </div>
            ) : (
              subUnits.map((section: any) => {
                const isCollapsed = collapsed.has(section.id);
                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <button
                        className="flex items-center gap-2 flex-1 text-left"
                        onClick={() => toggleSection(section.id)}
                      >
                        {isCollapsed
                          ? <ChevronDown size={15} className="text-[#c9a227]" />
                          : <ChevronUp   size={15} className="text-[#c9a227]" />
                        }
                        <span className="font-bold text-sm text-[#1a2a5e]">{section.title}</span>
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openNotesEditor(section.id)}
                          className="flex items-center gap-1 text-xs text-indigo-500 font-semibold hover:underline"
                        >
                          <NotebookPen size={12} /> Add Notes
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <button
                          onClick={() => {
                            setTargetSubUnit(section.id);
                            setAddDialog(true);
                          }}
                          className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline"
                        >
                          <Plus size={12} /> Add material
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    {!isCollapsed && (
                      <div className="divide-y divide-gray-100">
                        {/* Notes viewer */}
                        <div className="py-2">
                          <button
                            onClick={() => toggleNotes(section.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:underline px-4 py-1"
                          >
                            <NotebookPen size={12} />
                            {expandedNotes.has(section.id) ? "▲ Hide notes" : "▼ View notes"}
                          </button>
                          {expandedNotes.has(section.id) && (
                            <InlineNotesViewer
                              subUnitId={section.id}
                              courseId={Number(id)}
                              isLecturer={true}
                              onEdit={() => openNotesEditor(section.id)}
                            />
                          )}
                        </div>

                        {/* Materials placeholder — extend when sub-unit materials endpoint is added */}
                        {(section.materials ?? []).length === 0 && (
                          <p className="text-xs text-gray-400 px-4 py-3 italic">
                            No other materials yet. Click "Add material" to get started.
                          </p>
                        )}
                        {(section.materials ?? []).map((mat: any) => (
                          <div key={mat.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 group">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{typeIcon(mat.type)}</div>
                              <div>
                                <p className="text-sm font-medium text-[#c9a227]">{mat.title}</p>
                                {mat.subtitle && <p className="text-xs text-gray-400">{mat.subtitle}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Add Material Dialog ─────────────────────────────────────────────── */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a2a5e] font-black">Add Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {materialTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      newType === t
                        ? t === "notes"
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-[#c9a227] bg-amber-50 text-[#1a2a5e]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {typeIcon(t, 18)}
                    <span className="text-[10px]">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {newType === "notes" && (
              <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <NotebookPen size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-indigo-700">Rich Notes Editor</p>
                  <p className="text-[11px] text-indigo-500 mt-0.5">
                    You'll be taken to a full editor with formatting, colors, and more.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                {newType === "notes" ? "Note Title" : "Title"}
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={newType === "notes" ? "e.g. Week 3 — Design Patterns" : "e.g. Lecture Notes Week 3"}
                className="text-sm"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button
                className={`flex-1 text-white font-bold ${
                  newType === "notes" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#1a2a5e] hover:bg-[#132047]"
                }`}
                onClick={() => {
                  if (newType === "notes" && targetSubUnit) {
                    setAddDialog(false);
                    openNotesEditor(targetSubUnit, newTitle);
                    setNewTitle("");
                  }
                }}
              >
                {newType === "notes" ? "Open Notes Editor →" : "Add Material"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Section Dialog ──────────────────────────────────────────────── */}
      <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#1a2a5e] font-black">Add Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Lecture 4: Inheritance"
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSectionDialog(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white"
                onClick={handleAddSection}
                disabled={creating}
              >
                {creating
                  ? <><Loader2 size={13} className="animate-spin" /> Creating...</>
                  : "Add Section"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerCourseDetail;