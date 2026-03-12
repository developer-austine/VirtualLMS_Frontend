import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAllCoursesStudent } from "@/Redux-Toolkit/features/Enrollment/enrollmentThunk";
import { Search } from "lucide-react";

const StudentHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { jwt } = useSelector((state: RootState) => state.auth);
  const { allCourses, loading } = useSelector((state: RootState) => state.enrollment);

  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");

  useEffect(() => {
    if (jwt) dispatch(getAllCoursesStudent(jwt));
  }, [jwt, dispatch]);

  const filtered = allCourses.filter((c) => {
    if (!submitted) return true;
    return (
      c.courseName.toLowerCase().includes(submitted.toLowerCase()) ||
      (c.courseCode ?? "").toLowerCase().includes(submitted.toLowerCase())
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(search);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <span
            onClick={() => { setSearch(""); setSubmitted(""); }}
            className="text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 cursor-pointer"
          >
            Courses
          </span>
          <span className="text-gray-400">›</span>
          <span
            onClick={() => { setSearch(""); setSubmitted(""); }}
            className="text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 cursor-pointer"
          >
            Search
          </span>
          {submitted && (
            <>
              <span className="text-gray-400">›</span>
              <span className="bg-[#c9a227] text-white px-3 py-1 rounded font-semibold flex items-center gap-1">
                {submitted} <span className="text-white/80 text-xs">▶</span>
              </span>
            </>
          )}
        </div>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-[#1a2a5e] mb-6">
          SKYLIMIT Learning Management System
        </h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/40 focus:border-[#c9a227]"
          />
          <button
            type="submit"
            className="bg-[#c9a227] hover:bg-[#b8911f] text-white px-4 py-2 rounded-r transition-colors flex items-center"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Results count */}
        {!loading && (
          <h2 className="text-xl font-bold text-[#1a2a5e] mb-4">
            Search results: {filtered.length}
          </h2>
        )}

        {/* Course list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-gray-200 rounded p-8 text-center text-gray-400 text-sm">
            No courses found.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/student/enroll/${course.id}`)}
                className="border border-gray-200 rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {/* Title row — gold, uppercase, bold */}
                <p className="text-[#c9a227] font-semibold text-base hover:underline mb-1 leading-snug">
                  {course.courseCode ? `${course.courseCode}: ` : ""}
                  {course.courseName.toUpperCase()}
                </p>

                {/* Sub-description row */}
                <p className="text-gray-600 text-sm mb-1">
                  {course.courseCode ? `${course.courseCode}: ` : ""}
                  {course.courseName}
                </p>

                {/* Category / semester */}
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="text-[#c9a227] font-semibold">
                    {course.semester}
                  </span>
                </p>

                {/* Enrolled indicator */}
                {course.isEnrolled && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1.5">
                    ✓ Enrolled
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentHome;