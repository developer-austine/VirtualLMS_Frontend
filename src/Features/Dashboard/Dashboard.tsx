import { BookOpen, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { courses } from "./data/courses";
import schoolOfBusiness from "../../assets/school-of-business.png";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Courses", icon: BookOpen, color: "text-blue-500", value: courses.length },
    { label: "Completed", icon: CheckCircle, color: "text-green-500", value: courses.filter(c => c.progress === 100).length },
    { label: "In Progress", icon: TrendingUp, color: "text-yellow-500", value: courses.filter(c => c.progress > 0 && c.progress < 100).length },
    { label: "Hours Spent", icon: Clock, color: "text-purple-500", value: "48h" },
  ];

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${schoolOfBusiness})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* Welcome text */}
        <div className="mb-6">
          <p className="text-[#c9a227] text-xs font-black tracking-[0.25em] uppercase mb-1 drop-shadow">
            Welcome Back
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight drop-shadow-lg">
            {user?.name ?? "Student"} 👋
          </h1>
          <p className="text-white/80 text-sm mt-1 font-medium drop-shadow">
            {user?.regNumber ?? ""}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4"
            >
              <stat.icon size={22} className={stat.color} />
              <div>
                <p className="text-2xl font-black text-[#1a2a5e]">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[#1a2a5e]">Recent Courses</h2>
            <Link to="/my-courses" className="text-sm text-[#c9a227] font-semibold hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)} // ✅ navigate on click
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`${course.color} relative overflow-hidden`} style={{ height: "160px" }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute border-2 border-white rotate-45"
                        style={{ width: `${60 + i * 25}px`, height: `${60 + i * 25}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-bold text-[#1a2a5e] uppercase leading-snug mb-1 group-hover:text-[#c9a227] transition-colors">
                    {course.code}: {course.name}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">{course.trim}</p>
                  {course.progress === 100 && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                      <CheckCircle size={12} /> 100% complete
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;