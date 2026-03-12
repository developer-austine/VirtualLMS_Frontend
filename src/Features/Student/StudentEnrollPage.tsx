import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAllCoursesStudent, enrollInCourse, unenrollFromCourse } from "@/Redux-Toolkit/features/Enrollment/enrollmentThunk";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

const StudentEnrollPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { jwt } = useSelector((state: RootState) => state.auth);
  const { allCourses, loading } = useSelector((state: RootState) => state.enrollment);

  const [actionLoading, setActionLoading] = useState(false);
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);

  useEffect(() => {
    if (jwt && allCourses.length === 0) {
      dispatch(getAllCoursesStudent(jwt));
    }
  }, [jwt, dispatch, allCourses.length]);

  const course = allCourses.find((c) => c.id === Number(courseId));

  const handleEnroll = async () => {
    if (!jwt || !course) return;
    setActionLoading(true);
    try {
      await dispatch(enrollInCourse({ courseId: course.id, token: jwt })).unwrap();
      dispatch(getAllCoursesStudent(jwt));
      toast.success(`Successfully enrolled in ${course.courseName}!`, {
        description: "You can now access the course from My Courses.",
        duration: 4000,
      });
      setTimeout(() => navigate("/student/home"), 1500);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to enroll. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!jwt || !course) return;
    setActionLoading(true);
    try {
      await dispatch(unenrollFromCourse({ courseId: course.id, token: jwt })).unwrap();
      dispatch(getAllCoursesStudent(jwt));
      toast.success(`Unenrolled from ${course.courseName}.`, {
        description: "You can re-enroll anytime from the course catalogue.",
        duration: 4000,
      });
      setTimeout(() => navigate("/student/home"), 1500);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to unenroll. Please try again.");
    } finally {
      setActionLoading(false);
      setShowUnenrollConfirm(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#c9a227]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <span
            onClick={() => navigate("/student/home")}
            className="text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 cursor-pointer"
          >
            Courses
          </span>
          <span className="text-gray-400">›</span>
          <span
            onClick={() => navigate("/student/home")}
            className="text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 cursor-pointer"
          >
            Search
          </span>
          <span className="text-gray-400">›</span>
          <span className="bg-[#c9a227] text-white px-3 py-1 rounded font-semibold flex items-center gap-1">
            {course.courseCode || course.courseName} <span className="text-white/80 text-xs">▶</span>
          </span>
        </div>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-[#1a2a5e] mb-6">
          SKYLIMIT Learning Management System
        </h1>

        {/* Course title block */}
        <h2 className="text-2xl font-bold text-[#1a2a5e] mb-2">
          {course.courseCode ? `${course.courseCode}: ` : ""}
          {course.courseName.toUpperCase()}
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          {course.courseCode ? `${course.courseCode}: ` : ""}
          {course.courseName}
        </p>

        {/* Enrolment options label */}
        <h3 className="text-xl font-bold text-[#1a2a5e] mb-4">
          Enrolment options
        </h3>

        {/* Course info row */}
        <div className="border border-gray-200 rounded p-4 mb-6">
          <p className="text-[#c9a227] font-semibold text-base mb-1 leading-snug">
            {course.courseCode ? `${course.courseCode}: ` : ""}
            {course.courseName.toUpperCase()}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            {course.description || "No description available for this course."}
          </p>
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="text-[#c9a227] font-semibold">{course.semester}</span>
          </p>
          {course.isEnrolled && (
            <p className="text-xs text-emerald-600 font-semibold mt-1.5">✓ Enrolled</p>
          )}
        </div>

        {/* Action area */}
        {!course.isEnrolled ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              You are not enrolled in this course. Click below to enroll.
            </p>
            <button
              onClick={handleEnroll}
              disabled={actionLoading}
              className="bg-[#c9a227] hover:bg-[#b8911f] disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded transition-colors flex items-center gap-2 text-sm"
            >
              {actionLoading ? (
                <><Loader2 size={15} className="animate-spin" /> Enrolling...</>
              ) : (
                "Enroll"
              )}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              You are already enrolled in this course.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/course/${course.id}`)}
                className="bg-[#1a2a5e] hover:bg-[#1a2a5e]/90 text-white font-semibold px-8 py-2.5 rounded transition-colors text-sm"
              >
                Continue
              </button>

              {!showUnenrollConfirm ? (
                <button
                  onClick={() => setShowUnenrollConfirm(true)}
                  className="text-sm text-red-500 hover:text-red-700 underline font-medium transition-colors"
                >
                  Unenroll from this course
                </button>
              ) : (
                <div className="w-full border border-red-200 rounded p-4 bg-red-50 mt-2">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">
                      Are you sure you want to unenroll? You will lose access to all course content.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUnenroll}
                      disabled={actionLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded text-sm transition-colors flex items-center gap-1.5"
                    >
                      {actionLoading ? (
                        <><Loader2 size={13} className="animate-spin" /> Unenrolling...</>
                      ) : (
                        "Yes, Unenroll"
                      )}
                    </button>
                    <button
                      onClick={() => setShowUnenrollConfirm(false)}
                      className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2 rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentEnrollPage;