import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Save, CheckCircle2, Loader2,
  Users, BarChart2, Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourseById, getEnrolledStudents } from "@/Redux-Toolkit/features/Course/courseThunk";
import { getSubUnitsByCourse } from "@/Redux-Toolkit/features/subUnit/subunitThunk";
import { useBanner } from "@/hooks/useBanner";

const Grades = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedCourse, enrolledStudents, loading: courseLoading } = useSelector(
    (state: RootState) => state.course
  );
  const { subUnits, loading: subUnitLoading } = useSelector(
    (state: RootState) => state.subUnit
  );
  const { jwt } = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  // Grades stored locally — no grades endpoint yet on backend
  const [grades, setGrades] = useState<Record<number, Record<number, string>>>({});
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    dispatch(getLecturerCourseById({ token, courseId: Number(id) }));
    dispatch(getEnrolledStudents({ token, courseId: Number(id) }));
    dispatch(getSubUnitsByCourse({ token, courseId: Number(id) }));
  }, [dispatch, id, token]);

  // Derive gradable items from sub-units (assignments / quizzes that have a type field)
  const gradableItems = subUnits.flatMap((s: any) =>
    (s.materials ?? []).filter(
      (m: any) => m.type === "quiz" || m.type === "assignment"
    )
  );

  const handleChange = (studentId: number, itemId: number, val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setGrades(p => ({
      ...p,
      [studentId]: { ...(p[studentId] ?? {}), [itemId]: num },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const loading = courseLoading || subUnitLoading;

  if (loading && !selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-[#1a2a5e]" />
      </div>
    );
  }

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalStudents = enrolledStudents.length;
  const gradedCount   = enrolledStudents.filter(
    (s: any) => Object.values(grades[s.id] ?? {}).some(v => v !== "")
  ).length;

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-4">

        {/* ── Stats strip ──────────────────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Students",       value: totalStudents, icon: Users,    color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100"  },
              { label: "Gradable Items", value: gradableItems.length, icon: BarChart2, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
              { label: "Graded",         value: gradedCount,   icon: Award,    color: "text-green-600",  bg: "bg-green-50",   border: "border-green-100"   },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-3 flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                  <s.icon size={15} className={s.color} />
                </div>
                <div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main card ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <button
                onClick={() => navigate(`/lecturer/course/${id}`)}
                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-2"
              >
                <ArrowLeft size={13} /> Back to Course
              </button>
              <h1 className="text-lg font-black text-[#1a2a5e] flex items-center gap-2">
                <BarChart2 size={18} className="text-[#c9a227]" /> Grades
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedCourse?.courseCode && `${selectedCourse.courseCode}: `}
                {selectedCourse?.courseName}
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className={`gap-2 text-sm font-bold ${
                saved
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1a2a5e] hover:bg-[#132047]"
              } text-white`}
            >
              {saved
                ? <><CheckCircle2 size={14} /> Saved!</>
                : <><Save size={14} /> Save Grades</>
              }
            </Button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-semibold">Loading grades...</span>
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="text-center py-16">
              <Users size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-semibold">No students enrolled yet</p>
            </div>
          ) : gradableItems.length === 0 ? (
            /* No gradable items — still show student list with empty grade columns */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-gray-50 min-w-[200px]">
                      Student
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center" colSpan={2}>
                      No gradable items found — add quizzes or assignments to sections first
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrolledStudents.map((student: any, index: number) => {
                    const initials = student.fullName
                      ?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/40";
                    return (
                      <tr key={student.id} className={`${rowBg} hover:bg-amber-50/20`}>
                        <td className="px-6 py-3 sticky left-0 bg-inherit">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a2a5e] to-[#2a3f8f] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-[#1a2a5e] text-xs">{student.fullName}</p>
                              <p className="text-[10px] text-gray-400">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-400 italic" colSpan={2}>
                          —
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-gray-50/80 min-w-[200px]">
                      Student
                    </th>
                    {gradableItems.map((item: any) => (
                      <th key={item.id} className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center min-w-[120px]">
                        <p>{item.title}</p>
                        <p className={`text-[10px] font-bold capitalize mt-0.5 ${
                          item.type === "quiz" ? "text-purple-400" : "text-green-400"
                        }`}>
                          {item.type}
                        </p>
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((student: any, index: number) => {
                    const total = gradableItems.reduce((sum: number, item: any) => {
                      return sum + (parseInt(grades[student.id]?.[item.id] ?? "0") || 0);
                    }, 0);

                    const initials = student.fullName
                      ?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/40";

                    return (
                      <tr key={student.id} className={`${rowBg} hover:bg-amber-50/20 border-b border-gray-100 last:border-0 transition-colors`}>
                        {/* Student */}
                        <td className="px-6 py-3.5 sticky left-0 bg-inherit">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1a2a5e] to-[#2a3f8f] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-[#1a2a5e] text-xs">{student.fullName}</p>
                              <p className="text-[10px] text-gray-400">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Grade inputs */}
                        {gradableItems.map((item: any) => (
                          <td key={item.id} className="px-4 py-2.5 text-center">
                            <Input
                              value={grades[student.id]?.[item.id] ?? ""}
                              onChange={(e) => handleChange(student.id, item.id, e.target.value)}
                              placeholder="—"
                              className={`w-16 h-8 text-center text-sm mx-auto border-gray-200 focus:border-[#c9a227] ${
                                grades[student.id]?.[item.id]
                                  ? "bg-amber-50/40 border-amber-200 font-bold text-[#1a2a5e]"
                                  : ""
                              }`}
                              maxLength={3}
                            />
                          </td>
                        ))}

                        {/* Total */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-sm font-black ${
                            total > 0 ? "text-[#1a2a5e]" : "text-gray-300"
                          }`}>
                            {total > 0 ? total : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-semibold">
                  {gradableItems.length} gradable item{gradableItems.length !== 1 ? "s" : ""} · {totalStudents} students
                </p>
                <p className="text-xs text-gray-400 font-semibold">
                  {gradedCount} of {totalStudents} students graded
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;