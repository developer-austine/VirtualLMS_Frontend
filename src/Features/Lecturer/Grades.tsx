import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lecturerCourses, lecturerCourseSections } from "./data/lecturerCourses";
import { studentsByCourse, type Student } from "./data/lecturerStudents";
import schoolOfBusiness from "../../assets/school-of-business.png";

const Grades = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = lecturerCourses.find((c) => c.id === id);
  const sections = lecturerCourseSections[id ?? ""] ?? [];
  const gradableActivities = sections.flatMap((s) =>
    s.materials.filter((m) => m.type === "quiz" || m.type === "assignment")
  );
  const initialStudents = studentsByCourse[id ?? ""] ?? [];

  const [grades, setGrades] = useState<Record<string, Record<string, string>>>(() => {
    const g: Record<string, Record<string, string>> = {};
    initialStudents.forEach((s) => {
      g[s.id] = {};
      gradableActivities.forEach((a) => {
        g[s.id][a.id] = s.grades[a.id] != null ? String(s.grades[a.id]) : "";
      });
    });
    return g;
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (studentId: string, activityId: string, val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setGrades((p) => ({ ...p, [studentId]: { ...p[studentId], [activityId]: num } }));
    setSaved(false);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  if (!course) return null;

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
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
              <h1 className="text-lg font-black text-[#1a2a5e]">Grades</h1>
              <p className="text-xs text-gray-400">{course.code}: {course.name}</p>
            </div>
            <Button
              onClick={handleSave}
              className={`gap-2 text-sm font-bold ${saved ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"} text-white`}
            >
              {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Grades</>}
            </Button>
          </div>

          {gradableActivities.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No quizzes or assignments found in this course.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-wide sticky left-0 bg-gray-50 min-w-[180px]">
                      Student
                    </th>
                    {gradableActivities.map((a) => (
                      <th key={a.id} className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide text-center min-w-[120px]">
                        <p>{a.title}</p>
                        <p className="text-[10px] text-gray-400 font-normal capitalize">{a.type}</p>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {initialStudents.map((student) => {
                    const total = gradableActivities.reduce((sum, a) => {
                      const v = parseInt(grades[student.id]?.[a.id] ?? "0") || 0;
                      return sum + v;
                    }, 0);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 sticky left-0 bg-white">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#1a2a5e] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                              {student.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a2a5e] text-xs">{student.name}</p>
                              <p className="text-[10px] text-gray-400">{student.regNumber}</p>
                            </div>
                          </div>
                        </td>
                        {gradableActivities.map((a) => (
                          <td key={a.id} className="px-4 py-2 text-center">
                            <Input
                              value={grades[student.id]?.[a.id] ?? ""}
                              onChange={(e) => handleChange(student.id, a.id, e.target.value)}
                              placeholder="—"
                              className="w-16 h-8 text-center text-sm mx-auto border-gray-200 focus:border-[#c9a227]"
                              maxLength={3}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-black text-[#1a2a5e]">{total}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;