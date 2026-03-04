import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft, BookOpen, Plus, X, Loader2,
  ChevronRight, Hash, Clock, FileText, Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { createCourse, getAllCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { useBanner } from "@/hooks/useBanner";

type Tab = "all" | "create";

const SEMESTERS = [
  "Semester 1", "Semester 2", "Semester 3",
  "Year 1 Sem 1", "Year 1 Sem 2",
  "Year 2 Sem 1", "Year 2 Sem 2",
  "Year 3 Sem 1", "Year 3 Sem 2",
  "Year 4 Sem 1", "Year 4 Sem 2",
];

const STATUS_COLOR: Record<string, string> = {
  DRAFT:     "bg-gray-100 text-gray-600 border-gray-200",
  ACTIVE:    "bg-green-100 text-green-700 border-green-200",
  ARCHIVED:  "bg-amber-100 text-amber-700 border-amber-200",
  INACTIVE:  "bg-red-100 text-red-600 border-red-200",
};

const Field = ({
  label, children,
}: {
  label: string; children: React.ReactNode;
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
      {label}
    </label>
    {children}
  </div>
);

const empty = {
  courseName: "", semester: "", description: "",
  courseCode: "", creditHours: "",
};

const AdminCourses = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { courses, loading } = useSelector((state: RootState) => state.course);
  const { jwt }              = useSelector((state: RootState) => state.auth);
  const token                = jwt || localStorage.getItem("jwt") || "";

  const [tab,    setTab]    = useState<Tab>("all");
  const [form,   setForm]   = useState(empty);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getAllCourses(token));
  }, [dispatch, token, navigate]);

  const filtered = courses.filter((c) =>
    `${c.courseName} ${c.courseCode} ${c.semester}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.courseName || !form.semester) {
      toast.error("Course name and semester are required");
      return;
    }
    const result = await dispatch(createCourse({
      token,
      data: {
        courseName:  form.courseName,
        semester:    form.semester,
        description: form.description,
        courseCode:  form.courseCode,
        creditHours: form.creditHours ? Number(form.creditHours) : undefined,
      },
    }));

    if (createCourse.fulfilled.match(result)) {
      toast.success(`Course "${form.courseName}" created successfully!`);
      setForm(empty);
      setTab("all");
      dispatch(getAllCourses(token));
    } else {
      toast.error(result.payload as string || "Failed to create course");
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#c9a227]" /> Course Management
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create and manage all courses on the platform
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                  {courses.length} Courses
                </span>
                <button
                  onClick={() => navigate("/admin/assign-lecturer")}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#c9a227] text-white hover:bg-[#b8911f] transition-colors"
                >
                  Assign Lecturers <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            {([
              { key: "all",    label: "All Courses"     },
              { key: "create", label: "➕ Create Course" },
            ] as { key: Tab; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-3 text-xs font-bold transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-[#c9a227] text-[#1a2a5e] bg-amber-50/40"
                    : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "all" && (
            <div>
              {/* Search */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <FileText size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, code or semester..."
                    className="pl-9 h-9 text-sm border-gray-200"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  {filtered.length} courses
                </span>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-semibold">Loading courses...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-semibold">
                    {search ? "No courses match your search" : "No courses created yet"}
                  </p>
                  <button
                    onClick={() => setTab("create")}
                    className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={11} /> Create first course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filtered.map((course) => (
                    <div
                      key={course.id}
                      className="group rounded-xl border border-gray-100 hover:border-[#c9a227]/40 hover:shadow-md transition-all p-5 flex flex-col gap-3 cursor-pointer"
                      onClick={() => navigate(`/admin/assign-lecturer?courseId=${course.id}`)}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={16} className="text-indigo-600" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[course.status] ?? STATUS_COLOR.DRAFT}`}>
                          {course.status ?? "DRAFT"}
                        </span>
                      </div>

                      {/* Name & code */}
                      <div>
                        <p className="font-black text-[#1a2a5e] text-sm leading-tight">
                          {course.courseName}
                        </p>
                        {course.courseCode && (
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Hash size={9} /> {course.courseCode}
                          </p>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                        {course.semester && (
                          <span className="flex items-center gap-1">
                            <Clock size={9} /> {course.semester}
                          </span>
                        )}
                        {course.creditHours && (
                          <span className="flex items-center gap-1">
                            <Layers size={9} /> {course.creditHours} credits
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {course.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}

                      {/* Lecturers count */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-semibold">
                                {course.totalEnrolledStudents ?? 0} student{(course.totalEnrolledStudents ?? 0) !== 1 ? "s" : ""} enrolled
                            </span>
                            <span className="text-[10px] font-bold text-[#c9a227] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                Assign <ChevronRight size={10} />
                            </span>
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Create Course tab ─────────────────────────────────────────── */}
          {tab === "create" && (
            <div className="px-6 py-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <BookOpen size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1a2a5e]">New Course</h2>
                  <p className="text-xs text-gray-400">
                    Fill in the details to create a new course
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Course Name *">
                  <Input
                    value={form.courseName}
                    onChange={(e) => setForm(p => ({ ...p, courseName: e.target.value }))}
                    placeholder="e.g. Introduction to Programming"
                    className="text-sm border-gray-200"
                  />
                </Field>

                <Field label="Course Code">
                  <Input
                    value={form.courseCode}
                    onChange={(e) => setForm(p => ({ ...p, courseCode: e.target.value }))}
                    placeholder="e.g. CS101"
                    className="text-sm border-gray-200"
                  />
                </Field>

                <Field label="Semester *">
                  <select
                    value={form.semester}
                    onChange={(e) => setForm(p => ({ ...p, semester: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227]"
                  >
                    <option value="">Select semester</option>
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Credit Hours">
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={form.creditHours}
                    onChange={(e) => setForm(p => ({ ...p, creditHours: e.target.value }))}
                    placeholder="e.g. 3"
                    className="text-sm border-gray-200"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Brief description of what this course covers..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227] resize-none"
                    />
                  </Field>
                </div>
              </div>

              {/* Preview card */}
              {form.courseName && (
                <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wide mb-2">
                    Preview
                  </p>
                  <p className="font-black text-[#1a2a5e] text-sm">{form.courseName}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 font-semibold">
                    {form.courseCode && <span className="flex items-center gap-1"><Hash size={9}/> {form.courseCode}</span>}
                    {form.semester   && <span className="flex items-center gap-1"><Clock size={9}/> {form.semester}</span>}
                    {form.creditHours && <span className="flex items-center gap-1"><Layers size={9}/> {form.creditHours} credits</span>}
                  </div>
                  {form.description && (
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{form.description}</p>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                >
                  {loading
                    ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                    : <><Plus size={14} /> Create Course</>
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setForm(empty)}
                  className="px-5 border-gray-200"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminCourses;