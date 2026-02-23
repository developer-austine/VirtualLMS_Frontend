import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Users, BookOpen, Video, FileText, ChevronRight, Clock } from "lucide-react";
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

const upcomingClasses = [
  { id: "lc1", course: "CPP 3202: Advanced Java Programming", time: "Thu 26 Feb, 3:00 PM", platform: "Zoom" },
  { id: "lc2", course: "CPP 3204: Network Programming",       time: "Tue 24 Feb, 10:00 AM", platform: "Teams" },
  { id: "lc3", course: "CPP 4101: Software Engineering",      time: "Wed 25 Feb, 2:00 PM",  platform: "Google Meet" },
];

const recentActivity = [
  { label: "Quiz 1 submitted",        course: "Advanced Java",      time: "2 hours ago",    icon: FileText },
  { label: "Assignment 1 due soon",   course: "Network Programming", time: "Tomorrow",       icon: FileText },
  { label: "15 students attended",    course: "Software Engineering", time: "Yesterday",     icon: Users },
  { label: "New class scheduled",     course: "Advanced Java",      time: "3 days ago",      icon: Video },
];

const LecturerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalStudents = lecturerCourses.reduce((a, c) => a + c.enrolledStudents, 0);

  const stats = [
    { label: "My Courses",      value: lecturerCourses.length, icon: BookOpen, color: "text-blue-500" },
    { label: "Total Students",  value: totalStudents,          icon: Users,    color: "text-green-500" },
    { label: "Upcoming Classes",value: upcomingClasses.length, icon: Video,    color: "text-purple-500" },
    { label: "Pending Grades",  value: 12,                     icon: FileText, color: "text-yellow-500" },
  ];

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-5">

        {/* Welcome */}
        <div className="mb-2">
          <p className="text-[#c9a227] text-xs font-black tracking-[0.25em] uppercase mb-1 drop-shadow">
            Lecturer Portal
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight drop-shadow-lg">
            {user?.name ?? "Lecturer"} 👋
          </h1>
          <p className="text-white/80 text-sm mt-1 font-medium drop-shadow">
            {user?.department} · {user?.staffId}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <s.icon size={22} className={s.color} />
              <div>
                <p className="text-2xl font-black text-[#1a2a5e]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Upcoming classes */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-[#1a2a5e]">Upcoming Classes</h2>
              <button
                onClick={() => navigate("/lecturer/schedule")}
                className="text-xs text-[#c9a227] font-semibold hover:underline"
              >
                + Schedule class
              </button>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/lecturer/course/${cls.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#c9a227]/40 hover:bg-amber-50/30 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1a2a5e] flex items-center justify-center flex-shrink-0">
                      <Video size={15} className="text-[#c9a227]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1a2a5e] group-hover:text-[#c9a227] transition-colors">{cls.course}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {cls.time} · {cls.platform}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-[#c9a227] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
            <h2 className="text-base font-black text-[#1a2a5e] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <a.icon size={14} className="text-[#1a2a5e]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1a2a5e]">{a.label}</p>
                    <p className="text-[11px] text-gray-400">{a.course}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Courses quick view */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-[#1a2a5e]">My Courses</h2>
            <button
              onClick={() => navigate("/lecturer/courses")}
              className="text-xs text-[#c9a227] font-semibold hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {lecturerCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/lecturer/course/${course.id}`)}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`${course.color} h-28 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="absolute border-2 border-white rotate-45"
                        style={{ width: `${50 + i * 20}px`, height: `${50 + i * 20}px` }} />
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs font-black text-[#1a2a5e] uppercase group-hover:text-[#c9a227] transition-colors leading-snug">
                    {course.code}: {course.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{course.trim}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
                    <Users size={11} /> {course.enrolledStudents} students
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

export default LecturerDashboard;