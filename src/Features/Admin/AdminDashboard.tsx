import { useNavigate } from "react-router-dom";
import {
  Users, BookOpen, Activity, LogIn,
  FileText, HelpCircle, NotebookPen, TrendingUp,
  ChevronRight, CheckCircle2, XCircle, Shield,
} from "lucide-react";
import { systemReport, loginLogs, systemUsers } from "./data/adminData";
import { useBanner } from "@/hooks/useBanner";

const roleColor = (role: string) => {
  switch (role) {
    case "student":  return "bg-blue-100 text-blue-700";
    case "lecturer": return "bg-purple-100 text-purple-700";
    case "admin":    return "bg-[#c9a227]/20 text-[#c9a227]";
    default:         return "bg-gray-100 text-gray-600";
  }
};

const AdminDashboard = () => {
  const bgImage = useBanner();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Students",        value: systemReport.totalStudents,        icon: Users,       color: "text-blue-500",   bg: "bg-blue-50"   },
    { label: "Total Lecturers",        value: systemReport.totalLecturers,       icon: Users,       color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Total Courses",          value: systemReport.totalCourses,         icon: BookOpen,    color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Active Users",           value: systemReport.activeUsers,          icon: Activity,    color: "text-green-500",  bg: "bg-green-50"  },
    { label: "Logins Today",           value: systemReport.loginsToday,          icon: LogIn,       color: "text-[#c9a227]",  bg: "bg-amber-50"  },
    { label: "Submissions This Week",  value: systemReport.submissionsThisWeek,  icon: FileText,    color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Quizzes Completed",      value: systemReport.quizzesCompleted,     icon: HelpCircle,  color: "text-pink-500",   bg: "bg-pink-50"   },
    { label: "Notes Published",        value: systemReport.notesPublished,       icon: NotebookPen, color: "text-teal-500",   bg: "bg-teal-50"   },
  ];

  const recentLogins = loginLogs.slice(0, 5);
  const recentUsers  = systemUsers.slice(0, 5);

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

        {/* ── ONE MAIN CARD ─────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a2a5e] flex items-center justify-center">
                <Shield size={18} className="text-[#c9a227]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e]">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">System overview — KCAU Virtual Campus</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { label: "Manage Users",  path: "/admin/users"    },
                { label: "Reports",       path: "/admin/reports"  },
                { label: "Settings",      path: "/admin/settings" },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => navigate(btn.path)}
                  className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats grid ─────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-gray-100">
            {stats.map((s) => (
              <div key={s.label} className={`flex flex-col items-center justify-center py-5 px-3 ${s.bg} gap-1`}>
                <s.icon size={20} className={s.color} />
                <p className="text-2xl font-black text-[#1a2a5e]">{s.value}</p>
                <p className="text-[10px] text-gray-500 text-center font-semibold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Recent logins + Recent users ─────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Recent logins */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide">Recent Logins</h2>
                <button onClick={() => navigate("/admin/reports")} className="text-xs text-[#c9a227] font-semibold hover:underline">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentLogins.map((log) => (
                  <div key={log.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${
                      log.role === "lecturer" ? "bg-purple-100 text-purple-700"
                      : log.role === "admin"  ? "bg-amber-100 text-[#c9a227]"
                      : "bg-blue-100 text-blue-700"
                    }`}>
                      {log.userName.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a2a5e] truncate">{log.userName}</p>
                      <p className="text-[10px] text-gray-400">{log.loginAt} · {log.device}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${roleColor(log.role)}`}>
                        {log.role}
                      </span>
                      {log.status === "success"
                        ? <CheckCircle2 size={14} className="text-green-500" />
                        : <XCircle size={14} className="text-red-400" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide">System Users</h2>
                <button onClick={() => navigate("/admin/users")} className="text-xs text-[#c9a227] font-semibold hover:underline">
                  Manage →
                </button>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a2a5e] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a2a5e] truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-gray-300"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick links footer ──────────────── */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex flex-wrap gap-3">
            {[
              { label: "➕ Add Lecturer",    path: "/admin/users?tab=add-lecturer" },
              { label: "➕ Add Student",     path: "/admin/users?tab=add-student"  },
              { label: "📊 View Reports",    path: "/admin/reports"                },
              { label: "⚙️ System Settings", path: "/admin/settings"               },
            ].map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.path)}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#1a2a5e] hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
              >
                {l.label} <ChevronRight size={11} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;