import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users, BookOpen, Shield, Plus,
  LogOut, GitBranch, Loader2, TrendingUp,
  GraduationCap, ChevronRight, UserPlus,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAllStudentsAdmin, getAllLecturersAdmin } from "@/Redux-Toolkit/features/Admin/adminThunk";
import { getAllCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { getAllBranches } from "@/Redux-Toolkit/features/Branch/branchThunk";
import { logout } from "@/Redux-Toolkit/features/Auth/authSlice";
import { useBanner } from "@/hooks/useBanner";

const AdminDashboard = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, jwt }     = useSelector((state: RootState) => state.auth);
  const { students, lecturers, loading: adminLoading } = useSelector((state: RootState) => state.admin);
  const { courses, loading: courseLoading }            = useSelector((state: RootState) => state.course);
  const { branches, loading: branchLoading }           = useSelector((state: RootState) => state.branch);

  const loading = adminLoading || courseLoading || branchLoading;

  // ── Fetch all data on mount 
  useEffect(() => {
    const token = jwt || localStorage.getItem("jwt");
    if (!token) { navigate("/login"); return; }
    dispatch(getAllStudentsAdmin(token));
    dispatch(getAllLecturersAdmin(token));
    dispatch(getAllCourses(token));
    dispatch(getAllBranches(token));
  }, [dispatch, jwt, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ── Stats 
  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      path: "/admin/users",
    },
    {
      label: "Total Lecturers",
      value: lecturers.length,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      path: "/admin/users",
    },
    {
      label: "Total Courses",
      value: courses.length,
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      path: "/admin/courses",
    },
    {
      label: "Branches",
      value: branches.length,
      icon: GitBranch,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
      path: "/admin/create",
    },
  ];

  // ── Quick actions
  const quickActions = [
    { label: "Add Lecturer",  path: "/admin/create", icon: Users,         color: "bg-purple-600 hover:bg-purple-700" },
    { label: "Add Student",   path: "/admin/create", icon: GraduationCap, color: "bg-blue-600 hover:bg-blue-700"    },
    { label: "Add Branch",    path: "/admin/create", icon: GitBranch,     color: "bg-teal-600 hover:bg-teal-700"    },
    { label: "Manage Courses",path: "/admin/courses",icon: BookOpen,      color: "bg-indigo-600 hover:bg-indigo-700"},
    { label: "Assign Lecturer",path: "/admin/assign-lecturer",icon: UserPlus, color: "bg-green-600 hover:bg-green-700"},
  ];

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-5">

        {/* ── Main card  */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a2a5e] flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-[#c9a227]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e]">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">
                  Welcome back,{" "}
                  <span className="font-semibold text-[#1a2a5e]">
                    {user?.fullName ?? "Admin"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/reports")}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white transition-colors"
              >
                Reports
              </button>
              <button
                onClick={() => navigate("/admin/settings")}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white transition-colors"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>

          {/* ── Stats grid  */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-semibold">Loading dashboard data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
              {stats.map((s) => (
                <button
                  key={s.label}
                  onClick={() => navigate(s.path)}
                  className={`flex flex-col items-center justify-center py-8 px-4 ${s.bg} gap-2 group transition-opacity hover:opacity-90`}
                >
                  <div className={`w-10 h-10 rounded-full ${s.bg} border ${s.border} flex items-center justify-center`}>
                    <s.icon size={20} className={s.color} />
                  </div>
                  <p className="text-3xl font-black text-[#1a2a5e]">{s.value}</p>
                  <p className="text-xs text-gray-500 font-semibold text-center leading-tight">{s.label}</p>
                  <span className={`text-[10px] font-bold ${s.color} flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    View <ChevronRight size={10} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* ── Two column section*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Recent Lecturers */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide flex items-center gap-2">
                  <Users size={14} className="text-purple-500" /> Recent Lecturers
                </h2>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="text-xs text-[#c9a227] font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>

              {adminLoading ? (
                <div className="flex items-center gap-2 text-gray-400 py-4">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Loading lecturers...</span>
                </div>
              ) : lecturers.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">No lecturers yet</p>
                  <button
                    onClick={() => navigate("/admin/create")}
                    className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={11} /> Add first lecturer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {lecturers.slice(0, 5).map((l) => (
                    <div key={l.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-black flex-shrink-0">
                        {l.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a2a5e] truncate">{l.fullName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{l.email}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex-shrink-0">
                        Lecturer
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Students */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide flex items-center gap-2">
                  <GraduationCap size={14} className="text-blue-500" /> Recent Students
                </h2>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="text-xs text-[#c9a227] font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>

              {adminLoading ? (
                <div className="flex items-center gap-2 text-gray-400 py-4">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Loading students...</span>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">No students yet</p>
                  <button
                    onClick={() => navigate("/admin/create")}
                    className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={11} /> Add first student
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-black flex-shrink-0">
                        {s.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a2a5e] truncate">{s.fullName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                        Student
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Branches strip */}
          {!branchLoading && branches.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-[#1a2a5e] uppercase tracking-wide flex items-center gap-2">
                  <GitBranch size={13} className="text-teal-500" /> Campus Branches
                </h2>
                <button
                  onClick={() => navigate("/admin/create")}
                  className="text-xs text-[#c9a227] font-semibold hover:underline"
                >
                  Manage →
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700"
                  >
                    <GitBranch size={11} /> {b.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Quick actions footer*/}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap gap-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wide w-full mb-1 flex items-center gap-2">
              <TrendingUp size={12} /> Quick Actions
            </p>
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-white transition-colors ${a.color}`}
              >
                <a.icon size={13} /> {a.label} <ChevronRight size={11} />
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;