import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users, Search, ChevronRight, BookOpen,
  Hash, Clock, Layers, Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { useBanner } from "@/hooks/useBanner";

// Cycle of accent colors for course banner gradients
const CARD_GRADIENTS = [
  "from-purple-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-violet-500 to-purple-700",
  "from-indigo-500 to-blue-700",
  "from-teal-500 to-emerald-600",
  "from-rose-500 to-pink-600",
];

const LecturerCourses = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { myCourses, loading } = useSelector((state: RootState) => state.course);
  const { jwt }                = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getLecturerCourses(token));
  }, [dispatch, token, navigate]);

  const filtered = myCourses.filter((c) =>
    `${c.courseCode ?? ""} ${c.courseName} ${c.semester ?? ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
                  <BookOpen size={20} className="text-[#c9a227]" /> My Courses
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">Courses you are currently teaching</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                {myCourses.length} course{myCourses.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="relative mt-4 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, code or semester..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm border-gray-200"
              />
            </div>
          </div>

          {/* ── Loading ───────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-semibold">Loading your courses...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">
                {search ? "No courses match your search" : "No courses assigned to you yet"}
              </p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((course, index) => {
                const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
                const initials = course.courseName
                  .split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();

                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/lecturer/course/${course.id}`)}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  >
                    {/* Banner */}
                    <div className={`bg-gradient-to-br ${gradient} h-32 relative overflow-hidden`}>
                      {/* Decorative rings */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        {[...Array(5)].map((_, i) => (
                          <div key={i}
                            className="absolute border-2 border-white rounded-full"
                            style={{ width: `${60 + i * 28}px`, height: `${60 + i * 28}px` }}
                          />
                        ))}
                      </div>
                      {/* Course initials */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-white/30 tracking-tighter">
                          {initials}
                        </span>
                      </div>
                      {/* Student count pill */}
                      <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-bold text-[#1a2a5e]">
                        <Users size={10} /> {course.totalEnrolledStudents ?? 0}
                      </div>
                      {/* Status badge */}
                      {course.status && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-[10px] font-bold bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">
                            {course.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-white">
                      <p className="text-xs font-black text-[#1a2a5e] leading-snug group-hover:text-[#c9a227] transition-colors line-clamp-2">
                        {course.courseCode && (
                          <span className="text-gray-400 mr-1">{course.courseCode}:</span>
                        )}
                        {course.courseName}
                      </p>

                      <div className="flex items-center flex-wrap gap-3 mt-2">
                        {course.semester && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                            <Clock size={9} /> {course.semester}
                          </span>
                        )}
                        {course.creditHours && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                            <Layers size={9} /> {course.creditHours} credits
                          </span>
                        )}
                        {course.courseCode && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                            <Hash size={9} /> {course.courseCode}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {[
                          { label: "Manage",   path: `/lecturer/course/${course.id}` },
                          { label: "Students", path: `/lecturer/course/${course.id}/students` },
                          { label: "Grades",   path: `/lecturer/course/${course.id}/grades` },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={(e) => { e.stopPropagation(); navigate(btn.path); }}
                            className="text-[10px] font-bold py-1.5 rounded border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white hover:border-[#1a2a5e] transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {course.totalEnrolledStudents ?? 0} enrolled
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#c9a227] opacity-0 group-hover:opacity-100 transition-opacity">
                          Open <ChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerCourses;