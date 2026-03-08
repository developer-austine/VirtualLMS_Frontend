import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, ArrowLeft, Plus, Megaphone,
  Link2, Video, FileText, HelpCircle,
  Users, BarChart2, NotebookPen, Loader2, BookOpen, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourseById } from "@/Redux-Toolkit/features/Course/courseThunk";
import { getSubUnitsByCourse, createSubUnit } from "@/Redux-Toolkit/features/subUnit/subunitThunk";
import { createMaterial } from "@/Redux-Toolkit/features/Material/materialThunk";
import InlineNotesViewer from "./InlineNotesViewer";
import { useBanner } from "@/hooks/useBanner";

type UIType = "file" | "video" | "quiz" | "assignment" | "link" | "announcement" | "notes";
type BackendType = "FILE" | "VIDEO" | "QUIZ" | "ASSIGNMENT" | "LINK" | "ANNOUNCEMENT";

const materialTypes: UIType[] = ["file", "video", "quiz", "assignment", "link", "announcement", "notes"];
const toBackendType = (t: UIType): BackendType => t.toUpperCase() as BackendType;

const typeIcon = (type: string, size = 15) => {
  switch (type?.toLowerCase()) {
    case "announcement": return <Megaphone   size={size} className="text-[#c9a227]"  />;
    case "link":         return <Link2       size={size} className="text-blue-500"   />;
    case "video":        return <Video       size={size} className="text-red-500"    />;
    case "file":         return <FileText    size={size} className="text-orange-400" />;
    case "quiz":         return <HelpCircle  size={size} className="text-purple-500" />;
    case "assignment":   return <FileText    size={size} className="text-green-500"  />;
    case "notes":        return <NotebookPen size={size} className="text-indigo-500" />;
    default:             return <FileText    size={size} className="text-gray-400"   />;
  }
};

// ── Per-subunit materials — local state, same pattern as InlineNotesViewer ────
const useSubUnitMaterials = (subUnitId: number, courseId: number, token: string, refreshKey = 0) => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading]     = useState(false);

  const fetchMaterials = async () => {
    if (!subUnitId || !token) return;
    setLoading(true);
    try {
      const { default: api } = await import("@/utils/api");
      const res = await api.get(
        `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/materials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data?.data ?? res.data;
      setMaterials(Array.isArray(data) ? data : []);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch whenever subUnitId, token, or refreshKey changes
  // refreshKey bumps on every navigation back to this page — catches newly added quizzes
  useEffect(() => { fetchMaterials(); }, [subUnitId, token, refreshKey]);
  return { materials, loading, refetch: fetchMaterials };
};

// ── Section row — owns its own materials list ─────────────────────────────────
const SectionRow = ({
  section, courseId, token, isCollapsed, onToggle,
  onAddNotes, onAddMaterial, navigate, courseParamId, refreshKey,
}: {
  section: any; courseId: number; token: string; isCollapsed: boolean;
  onToggle: () => void; onAddNotes: () => void;
  onAddMaterial: (refetch: () => void) => void;
  navigate: ReturnType<typeof useNavigate>; courseParamId: string | undefined;
  refreshKey?: number;
}) => {
  const { materials, loading: matLoading, refetch } = useSubUnitMaterials(section.id, courseId, token, refreshKey ?? 0);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <button className="flex items-center gap-2 flex-1 text-left" onClick={onToggle}>
          {isCollapsed
            ? <ChevronDown size={15} className="text-[#c9a227]" />
            : <ChevronUp   size={15} className="text-[#c9a227]" />}
          <span className="font-bold text-sm text-[#1a2a5e]">{section.title}</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddNotes}
            className="flex items-center gap-1 text-xs text-indigo-500 font-semibold hover:underline"
          >
            <NotebookPen size={12} /> Add Notes
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => onAddMaterial(refetch)}
            className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline"
          >
            <Plus size={12} /> Add material
          </button>
        </div>
      </div>

      {/* Section body */}
      {!isCollapsed && (
        <div>
          <InlineNotesViewer
            subUnitId={section.id}
            courseId={courseId}
            isLecturer={true}
            onEdit={onAddNotes}
          />

          {matLoading ? (
            <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 text-gray-400">
              <Loader2 size={12} className="animate-spin" />
              <span className="text-xs">Loading materials...</span>
            </div>
          ) : materials.length === 0 ? (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 italic">No materials yet. Click "Add material" to get started.</p>
            </div>
          ) : (
            materials.map((mat: any) => {
              const t = mat.type?.toLowerCase();

              const handleClick = () => {
                if (t === "quiz" || t === "assignment") {
                  navigate(`/lecturer/course/${courseParamId}/quiz/${mat.id}`);
                } else if (t === "link" || t === "video") {
                  // Open URL in new tab
                  const url = mat.url?.startsWith("http") ? mat.url : `https://${mat.url}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                } else if (t === "file") {
                  // Trigger file download
                  const fileUrl = `http://localhost:8080/${mat.filePath?.replace(/\\/g, "/")}`;
                  const a = document.createElement("a");
                  a.href = fileUrl;
                  a.download = mat.fileName ?? mat.title;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } else {
                  navigate(`/lecturer/course/${courseParamId}/material/${mat.id}`);
                }
              };

              return (
                <div
                  key={mat.id}
                  className="border-t border-gray-100 flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={handleClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{typeIcon(mat.type)}</div>
                    <div>
                      <p className="text-sm font-medium text-[#1a2a5e]">{mat.title}</p>
                      {mat.description && (
                        <p className="text-xs text-gray-400 line-clamp-1">{mat.description}</p>
                      )}
                      {(t === "link" || t === "video") && mat.url && (
                        <p className="text-[10px] text-blue-400 truncate max-w-[300px]">{mat.url}</p>
                      )}
                      {t === "file" && mat.fileName && (
                        <p className="text-[10px] text-gray-400">{mat.fileName}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 capitalize">{t}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const LecturerCourseDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedCourse, loading: courseLoading } = useSelector((state: RootState) => state.course);
  const { subUnits: rawSubUnits, loading: subUnitLoading } = useSelector((state: RootState) => state.subUnit);
  const subUnits = Array.isArray(rawSubUnits) ? rawSubUnits : [];
  const { jwt } = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const location = useLocation();
  const [refreshKey,      setRefreshKey]      = useState(0);
  const [collapsed,       setCollapsed]       = useState<Set<number>>(new Set());
  const [sectionDialog,   setSectionDialog]   = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [creating,        setCreating]        = useState(false);

  // Add material dialog
  const [addDialog,     setAddDialog]     = useState(false);
  const [targetSubUnit, setTargetSubUnit] = useState<number | null>(null);
  const [refetchFn,     setRefetchFn]     = useState<(() => void) | null>(null);
  const [newType,       setNewType]       = useState<UIType>("file");
  const [newTitle,      setNewTitle]      = useState("");
  const [newDesc,       setNewDesc]       = useState("");
  const [newUrl,        setNewUrl]        = useState("");
  const [pickedFile,    setPickedFile]    = useState<File | null>(null);
  const [submitting,    setSubmitting]    = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token || !id) return;
    dispatch(getLecturerCourseById({ token, courseId: Number(id) }));
    dispatch(getSubUnitsByCourse({ token, courseId: Number(id) }));
  }, [dispatch, id, token]);

  // Bump refreshKey every time we navigate back to this page (e.g. after quiz creation)
  // SectionRow passes refreshKey to useSubUnitMaterials so it refetches automatically
  useEffect(() => {
    setRefreshKey(k => k + 1);
  }, [location.key]);

  const toggleSection = (sid: number) =>
    setCollapsed(p => { const n = new Set(p); n.has(sid) ? n.delete(sid) : n.add(sid); return n; });

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !id) return;
    setCreating(true);
    const result = await dispatch(createSubUnit({ token, courseId: Number(id), data: { title: newSectionTitle.trim() } }));
    setCreating(false);
    if (createSubUnit.fulfilled.match(result)) {
      toast.success("Section created!");
      setNewSectionTitle(""); setSectionDialog(false);
      dispatch(getSubUnitsByCourse({ token, courseId: Number(id) }));
    } else {
      toast.error((result.payload as string) || "Failed to create section");
    }
  };

  const openNotesEditor = (subUnitId: number, title?: string) =>
    navigate(`/lecturer/course/${id}/notes/new`, { state: { subUnitId, title: title ?? "Untitled Note" } });

  const openAddMaterial = (subUnitId: number, refetch: () => void) => {
    setTargetSubUnit(subUnitId);
    setRefetchFn(() => refetch);
    setNewType("file"); setNewTitle(""); setNewDesc(""); setNewUrl(""); setPickedFile(null);
    setAddDialog(true);
  };

  const handleAddMaterial = async () => {
    if (!newTitle.trim() || !targetSubUnit || !id) return;

    if (newType === "notes") { setAddDialog(false); openNotesEditor(targetSubUnit, newTitle); return; }

    if (newType === "quiz" || newType === "assignment") {
      setAddDialog(false);
      navigate(`/lecturer/course/${id}/quiz/new`, {
        state: { subUnitId: targetSubUnit, courseId: Number(id), title: newTitle },
      });
      return;
    }

    if ((newType === "link" || newType === "video") && !newUrl.trim()) {
      toast.error("Please enter a URL"); return;
    }

    setSubmitting(true);
    try {
      if (newType === "file" && pickedFile) {
        const { default: api } = await import("@/utils/api");
        // Convert file to base64 and send as JSON — avoids multipart/415 issues with Spring Boot 4
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(pickedFile);
        });
        await api.post(
          `/api/lecturer/courses/${id}/sub-units/${targetSubUnit}/materials/upload`,
          {
            title: newTitle.trim(),
            description: newDesc.trim() || undefined,
            type: "FILE",
            orderIndex: 0,
            fileBase64: base64,
            fileName: pickedFile.name,
            fileSize: pickedFile.size,
            fileContentType: pickedFile.type,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("File uploaded!");
      } else {
        const result = await dispatch(createMaterial({
          courseId: Number(id), subUnitId: targetSubUnit, token,
          data: {
            title: newTitle.trim(),
            description: newDesc.trim() || undefined,
            type: toBackendType(newType),
            url: newUrl.trim() || undefined,
            orderIndex: 0,
          },
        }));
        if (createMaterial.rejected.match(result)) {
          toast.error((result.payload as string) || "Failed to add material");
          setSubmitting(false); return;
        }
        toast.success("Material added!");
      }
      setAddDialog(false);
      refetchFn?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const loading = courseLoading || subUnitLoading;
  const isSpecial = newType === "quiz" || newType === "assignment" || newType === "notes";
  const needsUrl  = newType === "link" || newType === "video";
  const needsFile = newType === "file";

  if (loading && !selectedCourse) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#1a2a5e]" /></div>;
  }
  if (!selectedCourse && !loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400 text-sm">Course not found.</p></div>;
  }

  const course = selectedCourse;

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundImage: `url(${useBanner()})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button onClick={() => navigate("/lecturer/courses")} className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
              <ArrowLeft size={13} /> Back to My Courses
            </button>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-lg font-black text-[#1a2a5e]">
                  {course?.courseCode && <span className="text-gray-400 mr-1">{course.courseCode}:</span>}
                  {course?.courseName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {course?.semester}{course?.creditHours && ` · ${course.creditHours} credits`}
                  {course?.totalEnrolledStudents != null && ` · ${course.totalEnrolledStudents} students`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs gap-1 border-gray-200" onClick={() => navigate(`/lecturer/course/${id}/students`)}><Users size={13} /> Students</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1 border-gray-200" onClick={() => navigate(`/lecturer/course/${id}/grades`)}><BarChart2 size={13} /> Grades</Button>
                <Button size="sm" className="text-xs gap-1 bg-[#1a2a5e] hover:bg-[#132047] text-white" onClick={() => setSectionDialog(true)}><Plus size={13} /> Add Section</Button>
              </div>
            </div>
          </div>

          {/* Sub-units */}
          <div className="p-6 space-y-3">
            {subUnitLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-6">
                <Loader2 size={16} className="animate-spin" /><span className="text-xs font-semibold">Loading sections...</span>
              </div>
            ) : subUnits.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-semibold">No sections yet</p>
                <button onClick={() => setSectionDialog(true)} className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto">
                  <Plus size={11} /> Add first section
                </button>
              </div>
            ) : (
              subUnits.map((section: any) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  courseId={Number(id)}
                  token={token}
                  isCollapsed={collapsed.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  onAddNotes={() => openNotesEditor(section.id)}
                  onAddMaterial={(refetch) => openAddMaterial(section.id, refetch)}
                  navigate={navigate}
                  courseParamId={id}
                  refreshKey={refreshKey}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md" aria-describedby="add-material-desc">
          <DialogHeader><DialogTitle className="text-[#1a2a5e] font-black">Add Material</DialogTitle></DialogHeader>
          <p id="add-material-desc" className="sr-only">Choose a material type and fill in details</p>
          <div className="space-y-4 mt-2">

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {materialTypes.map((t) => (
                  <button key={t} onClick={() => setNewType(t)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                      newType === t
                        ? t === "notes" ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : t === "quiz" || t === "assignment" ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-[#c9a227] bg-amber-50 text-[#1a2a5e]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {typeIcon(t, 18)}<span className="text-[10px]">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {newType === "notes" && (
              <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <NotebookPen size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <div><p className="text-xs font-black text-indigo-700">Rich Notes Editor</p><p className="text-[11px] text-indigo-500 mt-0.5">You'll be taken to a full editor.</p></div>
              </div>
            )}
            {(newType === "quiz" || newType === "assignment") && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <HelpCircle size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
                <div><p className="text-xs font-black text-purple-700">Quiz Builder</p><p className="text-[11px] text-purple-500 mt-0.5">You'll be taken to the quiz builder to add questions and set a due date.</p></div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                placeholder={newType === "quiz" || newType === "assignment" ? "e.g. Midterm Quiz" : "e.g. Lecture Slides Week 3"}
                className="text-sm" />
            </div>

            {!isSpecial && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description..." className="text-sm resize-none" rows={2} />
              </div>
            )}

            {needsUrl && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{newType === "video" ? "Video URL" : "Link URL"}</label>
                <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="text-sm" />
              </div>
            )}

            {needsFile && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">File</label>
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setPickedFile(e.target.files?.[0] ?? null)} />
                {pickedFile ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700 font-semibold flex-1 truncate">{pickedFile.name}</span>
                    <button onClick={() => setPickedFile(null)}><X size={13} className="text-green-500 hover:text-red-500" /></button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-lg py-4 flex flex-col items-center gap-1 hover:border-[#c9a227] transition-colors">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-semibold">Click to pick a file</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button
                disabled={submitting || !newTitle.trim()}
                className={`flex-1 text-white font-bold ${
                  isSpecial
                    ? newType === "notes" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-purple-600 hover:bg-purple-700"
                    : "bg-[#1a2a5e] hover:bg-[#132047]"
                }`}
                onClick={handleAddMaterial}
              >
                {submitting ? <><Loader2 size={13} className="animate-spin" /> Saving...</>
                  : newType === "notes" ? "Open Notes Editor →"
                  : newType === "quiz" || newType === "assignment" ? "Open Quiz Builder →"
                  : "Add Material"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={sectionDialog} onOpenChange={setSectionDialog}>
        <DialogContent className="max-w-sm" aria-describedby="add-section-desc">
          <DialogHeader><DialogTitle className="text-[#1a2a5e] font-black">Add Section</DialogTitle></DialogHeader>
          <p id="add-section-desc" className="sr-only">Enter a title for the new section</p>
          <div className="space-y-3 mt-2">
            <Input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="e.g. Lecture 4: Inheritance" className="text-sm" />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSectionDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white" onClick={handleAddSection} disabled={creating}>
                {creating ? <><Loader2 size={13} className="animate-spin" /> Creating...</> : "Add Section"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerCourseDetail;