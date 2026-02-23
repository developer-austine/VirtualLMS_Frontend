import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Mail, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { lecturerCourses } from "./data/lecturerCourses";
import { studentsByCourse } from "./data/lecturerStudents";
import schoolOfBusiness from "../../assets/school-of-business.png";

const StudentList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const course = lecturerCourses.find((c) => c.id === id);
  const students = (studentsByCourse[id ?? ""] ?? []).filter((s) =>
    `${s.name} ${s.regNumber}`.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
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
                <h1 className="text-lg font-black text-[#1a2a5e]">Student List</h1>
                <p className="text-xs text-gray-400 mt-0.5">{course.code}: {course.name} · {students.length} students</p>
              </div>
              <div className="relative w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Reg Number</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-center px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Attendance</th>
                  <th className="text-center px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const good = student.attendance >= 75;
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                      {/* Avatar + Name */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a2a5e] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {student.avatar}
                          </div>
                          <span className="font-semibold text-[#1a2a5e]">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{student.regNumber}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-[#c9a227] hover:underline">
                          <Mail size={11} /> {student.email}
                        </a>
                      </td>
                      {/* Attendance bar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${good ? "bg-green-500" : "bg-red-400"}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${good ? "text-green-600" : "text-red-500"}`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        {good
                          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                              <XCircle size={10} /> At Risk
                            </span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentList;