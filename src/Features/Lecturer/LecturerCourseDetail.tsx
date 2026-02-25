import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown, ChevronUp, ArrowLeft, Plus, Megaphone,
  Link2, Video, FileText, HelpCircle, Trash2,
  Users, BarChart2, NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { lecturerCourses, lecturerCourseSections, type CourseMaterial } from "./data/lecturerCourses";
import InlineNotesViewer from "./InlineNotesViewer";
import schoolOfBusiness from "../../assets/school-of-business.png";

// ── Icon per material type ──────────────────────
const typeIcon = (type: CourseMaterial["type"], size = 15) => {
  switch (type) {
    case "announcement": return <Megaphone     size={size} className="text-[#c9a227]"  />;
    case "link":         return <Link2         size={size} className="text-blue-500"   />;
    case "video":        return <Video         size={size} className="text-red-500"    />;
    case "file":         return <FileText      size={size} className="text-orange-400" />;
    case "quiz":         return <HelpCircle    size={size} className="text-purple-500" />;
    case "assignment":   return <FileText      size={size} className="text-green-500"  />;
    case "notes":        return <NotebookPen   size={size} className="text-indigo-500" />;
  }
};

const materialTypes: CourseMaterial["type"][] = [
  "file", "video", "quiz", "assignment", "link", "announcement", "notes",
];

// Label for notes type in dialog
const typeLabel = (t: CourseMaterial["type"]) =>
  t === "notes" ? "📝 Notes" : t;

const LecturerCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const course  = lecturerCourses.find((c) => c.id === id);
  const [sections,    setSections]    = useState(lecturerCourseSections[id ?? ""] ?? []);
  const [collapsed,   setCollapsed]   = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [addDialog,   setAddDialog]   = useState(false);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [newTitle,    setNewTitle]    = useState("");
  const [newType,     setNewType]     = useState<CourseMaterial["type"]>("file");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [sectionDialog,   setSectionDialog]   = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Course not found.</p>
    </div>
  );

  const toggleSection = (sid: string) =>
    setCollapsed((p) => {
      const n = new Set(p);
      n.has(sid) ? n.delete(sid) : n.add(sid);
      return n;
    });

  const addMaterial = () => {
    if (!newTitle.trim() || !targetSection) return;
    const matId = `m${Date.now()}`;

    setSections((prev) =>
      prev.map((s) =>
        s.id === targetSection
          ? {
              ...s,
              materials: [...s.materials, {
                id:         matId,
                type:       newType,
                title:      newTitle.trim(),
                subtitle:   newSubtitle.trim() || undefined,
                uploadedAt: new Date().toISOString().split("T")[0],
              }],
            }
          : s
      )
    );

    // If notes — navigate directly to the editor
    if (newType === "notes") {
      setAddDialog(false);
      setNewTitle(""); setNewSubtitle("");
      navigate(`/lecturer/course/${id}/notes/${matId}`, {
        state: { title: newTitle.trim() },
      });
      return;
    }

    setNewTitle(""); setNewSubtitle(""); setAddDialog(false);
  };

  const deleteMaterial = (sectionId: string, materialId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, materials: s.materials.filter((m) => m.id !== materialId) }
          : s
      )
    );

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections((prev) => [...prev, {
      id: `s${Date.now()}`, title: newSectionTitle.trim(), materials: [],
    }]);
    setNewSectionTitle(""); setSectionDialog(false);
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const toggleNotes = (matId: string) =>
    setExpandedNotes((p) => {
      const n = new Set(p);
      n.has(matId) ? n.delete(matId) : n.add(matId);
      return n;
    });

  const openMaterial = (mat: CourseMaterial) => {
    if (mat.type === "notes") {
      toggleNotes(mat.id);
    }
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Header ─────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/lecturer/courses")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to My Courses
            </button>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-lg font-black text-[#1a2a5e]">{course.code}: {course.name}</h1>
                <p className="text-xs text-gray-400 mt-0.5">{course.stream} · {course.trim}</p>
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

          {/* ── Sections ───────────────────────── */}
          <div className="p-6 space-y-3">
            {sections.map((section) => {
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
                      <span className="text-xs text-gray-400">({section.materials.length})</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setTargetSection(section.id); setAddDialog(true); }}
                        className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline"
                      >
                        <Plus size={12} /> Add material
                      </button>
                      <div className="w-px h-4 bg-gray-200" />
                      <button
                        onClick={() => removeSection(section.id)}
                        className="flex items-center gap-1 text-xs text-red-400 font-semibold hover:text-red-600 hover:underline"
                      >
                        <Trash2 size={12} /> Remove section
                      </button>
                    </div>
                  </div>

                  {/* Materials list */}
                  {!isCollapsed && (
                    <div className="divide-y divide-gray-100">
                      {section.materials.length === 0 && (
                        <p className="text-xs text-gray-400 px-4 py-3 italic">
                          No materials yet. Click "Add material" to get started.
                        </p>
                      )}
                      {section.materials.map((mat) => (
                        <div key={mat.id}>
                          <div
                            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 group transition-colors ${
                              mat.type === "notes" ? "cursor-pointer" : ""
                            }`}
                            onClick={() => openMaterial(mat)}
                          >
                            <div className="flex items-start gap-3">
                              {mat.type === "notes" ? (
                                <div className="mt-0.5 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full">
                                  <NotebookPen size={12} className="text-indigo-500" />
                                  <span className="text-[10px] font-bold text-indigo-600">Notes</span>
                                </div>
                              ) : (
                                <div className="mt-0.5">{typeIcon(mat.type)}</div>
                              )}
                              <div>
                                <p className={`text-sm font-medium ${
                                  mat.type === "notes"
                                    ? "text-indigo-600 group-hover:underline"
                                    : "text-[#c9a227]"
                                }`}>
                                  {mat.title}
                                  {mat.type === "notes" && (
                                    <span className="ml-2 text-[10px] text-indigo-400">
                                      {expandedNotes.has(mat.id) ? "▲ collapse" : "▼ expand"}
                                    </span>
                                  )}
                                </p>
                                {mat.subtitle && <p className="text-xs text-gray-400">{mat.subtitle}</p>}
                                <p className="text-[10px] text-gray-300 mt-0.5">Added {mat.uploadedAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {mat.type === "notes" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/lecturer/course/${id}/notes/${mat.id}`, {
                                      state: { title: mat.title },
                                    });
                                  }}
                                  className="text-[11px] font-bold text-indigo-500 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  ✏️ Edit
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteMaterial(section.id, mat.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-50 text-red-400"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* ── Inline notes viewer ── */}
                          {mat.type === "notes" && expandedNotes.has(mat.id) && (
                            <InlineNotesViewer
                              materialId={mat.id}
                              isLecturer={true}
                              onEdit={() => navigate(`/lecturer/course/${id}/notes/${mat.id}`, {
                                state: { title: mat.title },
                              })}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Add Material Dialog ─────────────────── */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a2a5e] font-black">Add Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">

            {/* Type grid */}
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
                    <span className="text-[10px]">{t === "notes" ? "Notes" : t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes special CTA */}
            {newType === "notes" && (
              <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <NotebookPen size={20} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-indigo-700">Rich Notes Editor</p>
                  <p className="text-[11px] text-indigo-500 mt-0.5">
                    You'll be taken to a full word-processor with bold, italic, headings, lists, colors and more.
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
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

            {/* Subtitle — hide for notes */}
            {newType !== "notes" && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Subtitle (optional)</label>
                <Input
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. PDF, Due: 20 Feb 2026"
                  className="text-sm"
                />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button
                className={`flex-1 text-white font-bold ${
                  newType === "notes"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-[#1a2a5e] hover:bg-[#132047]"
                }`}
                onClick={addMaterial}
              >
                {newType === "notes" ? "Open Notes Editor →" : "Add Material"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Section Dialog ──────────────────── */}
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
              <Button className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white" onClick={addSection}>
                Add Section
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerCourseDetail;