import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Search, Mail, CheckCircle2,
  XCircle, Loader2, Users, TrendingUp,
  AlertTriangle, Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getEnrolledStudents } from "@/Redux-Toolkit/features/Course/courseThunk";
import { useBanner } from "@/hooks/useBanner";

const StudentList = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { enrolledStudents, loading } = useSelector((state: RootState) => state.course);
  const { jwt }                       = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token || !id) return;
    dispatch(getEnrolledStudents({ courseId: Number(id), token }));
  }, [dispatch, id, token]);

  const filtered = enrolledStudents.filter((s) =>
    `${s.fullName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total    = enrolledStudents.length;
  const active   = enrolledStudents.filter((s: any) => (s.attendancePercentage ?? 100) >= 75).length;
  const atRisk   = total - active;
  const avgAttendance = total > 0
    ? Math.round(enrolledStudents.reduce((sum: number, s: any) => sum + (s.attendancePercentage ?? 100), 0) / total)
    : 0;

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
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-4">

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Enrolled",      value: total,          icon: Users,         color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-100" },
            { label: "Active",        value: active,         icon: CheckCircle2,  color: "text-green-600",   bg: "bg-green-50",   border: "border-green-100"  },
            { label: "At Risk",       value: atRisk,         icon: AlertTriangle, color: "text-red-500",     bg: "bg-red-50",     border: "border-red-100"    },
            { label: "Avg Attendance",value: `${avgAttendance}%`, icon: TrendingUp, color: "text-[#c9a227]", bg: "bg-amber-50",   border: "border-amber-100"  },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-3 flex items-center gap-3`}>
              <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={15} className={s.color} />
              </div>
              <div>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main card ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate(`/lecturer/course/${id}`)}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Course
            </button>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-lg font-black text-[#1a2a5e] flex items-center gap-2">
                  <Users size={18} className="text-[#c9a227]" /> Enrolled Students
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {total} student{total !== 1 ? "s" : ""} enrolled in this course
                </p>
              </div>
              <div className="relative w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-semibold">Loading students...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">
                {search ? "No students match your search" : "No students enrolled yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                    <th className="text-left px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                    <th className="text-left px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="text-center px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</th>
                    <th className="text-center px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="text-center px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student: any, index: number) => {
                    const attendance = student.attendancePercentage ?? 100;
                    const isGood     = attendance >= 75;
                    const initials   = student.fullName
                      ?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

                    // Colour gradient for attendance bar
                    const barColor = attendance >= 85
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : attendance >= 75
                      ? "bg-gradient-to-r from-yellow-400 to-amber-400"
                      : "bg-gradient-to-r from-red-400 to-rose-500";

                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/40";

                    return (
                      <tr
                        key={student.id}
                        className={`${rowBg} hover:bg-amber-50/30 transition-colors group border-b border-gray-100 last:border-0`}
                      >
                        {/* Row number */}
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-gray-300">{index + 1}</span>
                        </td>

                        {/* Avatar + Name */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a2a5e] to-[#2a3f8f] flex items-center justify-center text-white text-xs font-black shadow-sm">
                                {initials}
                              </div>
                              {/* Status dot */}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                isGood ? "bg-green-400" : "bg-red-400"
                              }`} />
                            </div>
                            <div>
                              <p className="font-bold text-[#1a2a5e] text-sm">{student.fullName}</p>
                              {student.regNumber && (
                                <p className="text-[10px] text-gray-400 font-semibold">{student.regNumber}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4">
                          <a
                            href={`mailto:${student.email}`}
                            className="flex items-center gap-1.5 text-xs text-[#c9a227] hover:underline group-hover:text-[#b8911f]"
                          >
                            <Mail size={11} /> {student.email}
                          </a>
                        </td>

                        {/* Attendance bar */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor} transition-all duration-500`}
                                style={{ width: `${attendance}%` }}
                              />
                            </div>
                            <span className={`text-xs font-black ${
                              attendance >= 85 ? "text-green-600"
                              : attendance >= 75 ? "text-amber-500"
                              : "text-red-500"
                            }`}>
                              {attendance}%
                            </span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-4 text-center">
                          {isGood ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                              <XCircle size={10} /> At Risk
                            </span>
                          )}
                        </td>

                        {/* Enrolled at */}
                        <td className="px-4 py-4 text-center">
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {student.enrolledAt
                              ? new Date(student.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : "—"
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer summary */}
              <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-semibold">
                  Showing {filtered.length} of {total} students
                </p>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-green-600">
                    <Award size={10} /> {active} active
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <AlertTriangle size={10} /> {atRisk} at risk
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;