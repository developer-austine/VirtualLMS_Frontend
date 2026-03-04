import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, TrendingUp, Users, BookOpen,
  GitBranch, GraduationCap, Loader2,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAllStudentsAdmin, getAllLecturersAdmin } from "@/Redux-Toolkit/features/Admin/adminThunk";
import { getAllCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { getAllBranches } from "@/Redux-Toolkit/features/Branch/branchThunk";
import { useBanner } from "@/hooks/useBanner";

const AdminReports = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { students, lecturers, loading: adminLoading } = useSelector((state: RootState) => state.admin);
  const { courses,  loading: courseLoading }           = useSelector((state: RootState) => state.course);
  const { branches, loading: branchLoading }           = useSelector((state: RootState) => state.branch);
  const { jwt }                                        = useSelector((state: RootState) => state.auth);

  const loading = adminLoading || courseLoading || branchLoading;
  const token   = jwt || localStorage.getItem("jwt") || "";

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getAllStudentsAdmin(token));
    dispatch(getAllLecturersAdmin(token));
    dispatch(getAllCourses(token));
    dispatch(getAllBranches(token));
  }, [dispatch, token, navigate]);

  const statCards = [
    {
      label:  "Total Students",
      value:  students.length,
      icon:   GraduationCap,
      color:  "text-blue-600",
      bg:     "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label:  "Total Lecturers",
      value:  lecturers.length,
      icon:   Users,
      color:  "text-purple-600",
      bg:     "bg-purple-50",
      border: "border-purple-100",
    },
    {
      label:  "Total Courses",
      value:  courses.length,
      icon:   BookOpen,
      color:  "text-indigo-600",
      bg:     "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label:  "Campus Branches",
      value:  branches.length,
      icon:   GitBranch,
      color:  "text-teal-600",
      bg:     "bg-teal-50",
      border: "border-teal-100",
    },
  ];

  const roleColor = (role: string) =>
    role === "ROLE_LECTURER" ? "bg-purple-100 text-purple-700"
    : role === "ROLE_ADMIN"  ? "bg-amber-100 text-[#c9a227]"
    : "bg-blue-100 text-blue-700";

  const roleLabel = (role: string) =>
    role === "ROLE_LECTURER" ? "Lecturer"
    : role === "ROLE_STUDENT" ? "Student"
    : "Admin";

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-5">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#c9a227]" /> System Reports
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Live statistics from your platform
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-semibold">Loading report data...</span>
            </div>
          ) : (
            <>

              <div className="p-6 border-b border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-4">
                  Platform Overview
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {statCards.map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-xl border ${s.border} ${s.bg} p-5 flex flex-col gap-2`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                        <s.icon size={16} className={s.color} />
                      </div>
                      <p className="text-3xl font-black text-[#1a2a5e]">{s.value}</p>
                      <p className="text-xs text-gray-500 font-semibold leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-4">
                  Distribution Breakdown
                </p>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {[
                    {
                      label: "Students",
                      value: students.length,
                      max:   Math.max(students.length, 1),
                      color: "bg-blue-400",
                      pct:   100,
                    },
                    {
                      label: "Lecturers",
                      value: lecturers.length,
                      max:   Math.max(students.length, 1),
                      color: "bg-purple-400",
                      pct:   students.length > 0
                        ? Math.round((lecturers.length / students.length) * 100)
                        : 100,
                    },
                    {
                      label: "Courses",
                      value: courses.length,
                      max:   Math.max(students.length, 1),
                      color: "bg-indigo-400",
                      pct:   students.length > 0
                        ? Math.min(Math.round((courses.length / students.length) * 100), 100)
                        : 100,
                    },
                    {
                      label: "Branches",
                      value: branches.length,
                      max:   Math.max(students.length, 1),
                      color: "bg-teal-400",
                      pct:   students.length > 0
                        ? Math.min(Math.round((branches.length / students.length) * 100), 100)
                        : 100,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="px-5 py-3.5 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-600 font-semibold">{row.label}</span>
                        <span className="text-sm font-black text-[#1a2a5e]">{row.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color} transition-all duration-700`}
                          style={{ width: `${Math.max(row.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-4">
                  All Lecturers ({lecturers.length})
                </p>
                {lecturers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No lecturers registered yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Name", "Email", "Role", "Branches", "Joined"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {lecturers.map((l) => (
                          <tr key={l.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                                  {l.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-semibold text-[#1a2a5e]">{l.fullName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{l.email}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor("ROLE_LECTURER")}`}>
                                {roleLabel("ROLE_LECTURER")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {l.branches?.map((b: any) => b.name).join(", ") || "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">
                              {l.createdAt
                                ? new Date(l.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                                : "—"
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wide mb-4">
                  All Students ({students.length})
                </p>
                {students.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No students registered yet.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Name", "Email", "Role", "Branch", "Joined"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black flex-shrink-0">
                                  {s.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-semibold text-[#1a2a5e]">{s.fullName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{s.email}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor("ROLE_STUDENT")}`}>
                                {roleLabel("ROLE_STUDENT")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">
                              {(s as any).branch?.name ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">
                              {s.createdAt
                                ? new Date(s.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                                : "—"
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;