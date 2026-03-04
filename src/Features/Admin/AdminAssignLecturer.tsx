import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft, BookOpen, Users, UserPlus,
  UserMinus, Loader2, ChevronRight, Hash,
  Clock, Check, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import {
  getAllCourses,
  getCourseById,
  assignLecturerToCourse,
  removeLecturerFromCourse,
  getLecturersByCourse,
} from "@/Redux-Toolkit/features/Course/courseThunk";
import { getAllLecturersAdmin } from "@/Redux-Toolkit/features/Admin/adminThunk";
import { useBanner } from "@/hooks/useBanner";

const AdminAssignLecturer = () => {
  const bgImage        = useBanner();
  const navigate       = useNavigate();
  const dispatch       = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const { courses, selectedCourse, courseLecturers, loading: courseLoading } =
    useSelector((state: RootState) => state.course);
  const { lecturers, loading: adminLoading } =
    useSelector((state: RootState) => state.admin);
  const { jwt } = useSelector((state: RootState) => state.auth);

  const token = jwt || localStorage.getItem("jwt") || "";

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
    searchParams.get("courseId") ? Number(searchParams.get("courseId")) : null
  );
  const [courseSearch,   setCourseSearch]   = useState("");
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [assigning,      setAssigning]      = useState<number | null>(null);
  const [removing,       setRemoving]       = useState<number | null>(null);

  const loading = courseLoading || adminLoading;

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getAllCourses(token));
    dispatch(getAllLecturersAdmin(token));
  }, [dispatch, token, navigate]);

  // ── When a course is selected fetch its details + lecturers
  useEffect(() => {
    if (!selectedCourseId || !token) return;
    dispatch(getCourseById({ token, courseId: selectedCourseId }));
    dispatch(getLecturersByCourse({ token, courseId: selectedCourseId }));
  }, [selectedCourseId, dispatch, token]);

  const filteredCourses = courses.filter((c) =>
    `${c.courseName} ${c.courseCode} ${c.semester}`
      .toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredLecturers = lecturers.filter((l) =>
    `${l.fullName} ${l.email}`.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  // IDs of lecturers already assigned to selected course
    const assignedIds = new Set(courseLecturers.map((l) => l.id));

  // ── Assign
  const handleAssign = async (lecturerId: number, lecturerName: string) => {
    if (!selectedCourseId) { toast.error("Select a course first"); return; }
    setAssigning(lecturerId);
    const result = await dispatch(assignLecturerToCourse({
      token, courseId: selectedCourseId, lecturerId,
    }));
    setAssigning(null);
    if (assignLecturerToCourse.fulfilled.match(result)) {
      toast.success(`${lecturerName} assigned successfully!`);
      dispatch(getLecturersByCourse({ token, courseId: selectedCourseId }));
    } else {
      toast.error(result.payload as string || "Failed to assign lecturer");
    }
  };

  const handleRemove = async (lecturerId: number, lecturerName: string) => {
    if (!selectedCourseId) return;
    if (!window.confirm(`Remove ${lecturerName} from this course?`)) return;
    setRemoving(lecturerId);
    const result = await dispatch(removeLecturerFromCourse({
      token, courseId: selectedCourseId, lecturerId,
    }));
    setRemoving(null);
    if (removeLecturerFromCourse.fulfilled.match(result)) {
      toast.success(`${lecturerName} removed from course`);
      dispatch(getLecturersByCourse({ token, courseId: selectedCourseId }));
    } else {
      toast.error(result.payload as string || "Failed to remove lecturer");
    }
  };

  const activeCourse = courses.find((c) => c.id === selectedCourseId);

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-5">
          <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <button
                onClick={() => navigate("/admin/courses")}
                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-2"
              >
                <ArrowLeft size={13} /> Back to Courses
              </button>
              <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
                <UserPlus size={20} className="text-[#c9a227]" /> Assign Lecturers to Courses
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Select a course then assign or remove lecturers
              </p>
            </div>
            {activeCourse && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <BookOpen size={14} className="text-indigo-600" />
                <div>
                  <p className="text-xs font-black text-[#1a2a5e]">{activeCourse.courseName}</p>
                  <p className="text-[10px] text-gray-400">
                    {(courseLecturers ?? []).length} lecturer{(courseLecturers ?? []).length !== 1 ? "s" : ""} assigned
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-[#1a2a5e] flex items-center gap-2">
                <BookOpen size={15} className="text-indigo-500" /> Select Course
              </h2>
              <span className="text-[10px] font-bold text-gray-400">
                {courses.length} courses
              </span>
            </div>

            {/* Course search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-8 h-8 text-xs border-gray-200"
                />
              </div>
            </div>

            {courseLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Loading courses...</span>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-semibold">No courses found</p>
                <button
                  onClick={() => navigate("/admin/courses")}
                  className="mt-2 text-xs font-bold text-[#c9a227] hover:underline"
                >
                  Create a course first
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {filteredCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between gap-3 group ${
                      selectedCourseId === course.id
                        ? "bg-indigo-50 border-l-2 border-indigo-500"
                        : "hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${
                        selectedCourseId === course.id ? "text-indigo-700" : "text-[#1a2a5e]"
                      }`}>
                        {course.courseName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-semibold">
                        {course.courseCode && (
                          <span className="flex items-center gap-0.5">
                            <Hash size={8} /> {course.courseCode}
                          </span>
                        )}
                        {course.semester && (
                          <span className="flex items-center gap-0.5">
                            <Clock size={8} /> {course.semester}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">
                        {course.lecturers?.length ?? 0} assigned
                      </span>
                      <ChevronRight
                        size={13}
                        className={`transition-colors ${
                          selectedCourseId === course.id
                            ? "text-indigo-500"
                            : "text-gray-300 group-hover:text-gray-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-[#1a2a5e] flex items-center gap-2">
                <Users size={15} className="text-purple-500" /> Lecturers
              </h2>
              {selectedCourseId && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-700">
                  {assignedIds.size} assigned
                </span>
              )}
            </div>

            {!selectedCourseId ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <BookOpen size={22} className="text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-400">Select a course first</p>
                <p className="text-xs text-gray-300">
                  Choose a course on the left to manage its lecturers
                </p>
              </div>
            ) : (
              <>
                {/* Lecturer search */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={lecturerSearch}
                      onChange={(e) => setLecturerSearch(e.target.value)}
                      placeholder="Search lecturers..."
                      className="pl-8 h-8 text-xs border-gray-200"
                    />
                  </div>
                </div>

                {/* Currently assigned section */}
                {(courseLecturers ?? []).length > 0 && (
                  <div className="border-b border-gray-100">
                    <div className="px-5 py-2 bg-green-50/60">
                      <p className="text-[10px] font-black text-green-700 uppercase tracking-wide">
                        Currently Assigned
                      </p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {(courseLecturers ?? []).map((l: any) => (
                        <div
                          key={l.id}
                          className="flex items-center gap-3 px-5 py-3.5 bg-green-50/30"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {l.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1a2a5e] truncate">{l.fullName}</p>
                            <p className="text-[10px] text-gray-400 truncate">{l.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                              <Check size={10} /> Assigned
                            </span>
                            <button
                              onClick={() => handleRemove(l.id, l.fullName)}
                              disabled={removing === l.id}
                              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {removing === l.id
                                ? <Loader2 size={10} className="animate-spin" />
                                : <UserMinus size={10} />
                              }
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All lecturers list */}
                {adminLoading ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs">Loading lecturers...</span>
                  </div>
                ) : filteredLecturers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-semibold">No lecturers found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
                    {filteredLecturers.map((l) => {
                      const isAssigned = assignedIds.has(l.id);
                      return (
                        <div
                          key={l.id}
                          className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                            isAssigned ? "opacity-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                            {l.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1a2a5e] truncate">{l.fullName}</p>
                            <p className="text-[10px] text-gray-400 truncate">{l.email}</p>
                          </div>
                          {isAssigned ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 flex-shrink-0">
                              <Check size={10} /> Assigned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssign(l.id, l.fullName)}
                              disabled={assigning === l.id}
                              className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#1a2a5e] text-white hover:bg-[#132047] transition-colors disabled:opacity-50 flex-shrink-0"
                            >
                              {assigning === l.id
                                ? <Loader2 size={10} className="animate-spin" />
                                : <UserPlus size={10} />
                              }
                              Assign
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignLecturer;