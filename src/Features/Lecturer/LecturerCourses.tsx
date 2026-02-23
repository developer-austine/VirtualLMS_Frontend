import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, ChevronRight, Video, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

const LecturerCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = lecturerCourses.filter((c) =>
    `${c.code} ${c.name}`.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-xl font-black text-[#1a2a5e]">My Courses</h1>
            <p className="text-sm text-gray-400 mt-0.5">Courses you are currently teaching</p>
            <div className="relative mt-4 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm border-gray-200"
              />
            </div>
          </div>

          {/* Course cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/lecturer/course/${course.id}`)}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Banner */}
                <div className={`${course.color} h-36 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="absolute border-2 border-white rotate-45"
                        style={{ width: `${50 + i * 22}px`, height: `${50 + i * 22}px` }} />
                    ))}
                  </div>
                  {/* Student count pill */}
                  <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-bold text-[#1a2a5e]">
                    <Users size={10} /> {course.enrolledStudents}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-white">
                  <p className="text-xs font-black text-[#1a2a5e] uppercase leading-snug group-hover:text-[#c9a227] transition-colors">
                    {course.code}: {course.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{course.stream} · {course.trim}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Video size={11} className="text-[#c9a227]" />
                      {course.platform}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Clock size={11} className="text-[#c9a227]" />
                      {course.schedule}
                    </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerCourses;