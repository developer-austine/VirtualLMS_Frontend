import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, XCircle, LogIn,
  TrendingUp, Users, BookOpen, FileText,
} from "lucide-react";
import { loginLogs, systemReport, systemUsers } from "./data/adminData";
import { useBanner } from "@/hooks/useBanner";

type Tab = "overview" | "logins" | "users";

const AdminReports = () => {
  const bgImage = useBanner();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  const TABS = [
    { key: "overview" as Tab, label: "Overview"      },
    { key: "logins"   as Tab, label: "Login History" },
    { key: "users"    as Tab, label: "User Activity"  },
  ];

  const roleColor = (role: string) =>
    role === "lecturer" ? "bg-purple-100 text-purple-700"
    : role === "admin"  ? "bg-amber-100 text-[#c9a227]"
    : "bg-blue-100 text-blue-700";

  const statCards = [
    { label: "Total Students",       value: systemReport.totalStudents,       icon: Users,    color: "text-blue-500",   bg: "bg-blue-50",   border: "border-blue-100"   },
    { label: "Total Lecturers",      value: systemReport.totalLecturers,      icon: Users,    color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Total Courses",        value: systemReport.totalCourses,        icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Active Users Now",     value: systemReport.activeUsers,         icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
    { label: "Logins Today",         value: systemReport.loginsToday,         icon: LogIn,    color: "text-[#c9a227]",  bg: "bg-amber-50",  border: "border-amber-100"  },
    { label: "Submissions This Week",value: systemReport.submissionsThisWeek, icon: FileText, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Quizzes Completed",    value: systemReport.quizzesCompleted,    icon: CheckCircle2, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-100" },
    { label: "Notes Published",      value: systemReport.notesPublished,      icon: FileText, color: "text-teal-500",   bg: "bg-teal-50",   border: "border-teal-100"   },
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundImage:`url(${bgImage})`, backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#c9a227]" /> System Reports
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Full statistics on what is happening across the platform</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-6 py-3 text-xs font-bold transition-colors border-b-2 ${
                  tab === t.key ? "border-[#c9a227] text-[#1a2a5e] bg-amber-50/40" : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Overview ─────────────────────── */}
          {tab === "overview" && (
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                  <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col gap-2`}>
                    <s.icon size={18} className={s.color} />
                    <p className="text-2xl font-black text-[#1a2a5e]">{s.value}</p>
                    <p className="text-xs text-gray-500 font-semibold leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Activity breakdown */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-black text-[#1a2a5e] uppercase tracking-wide">Platform Activity Breakdown</p>
                </div>
                {[
                  { label: "Students enrolled this term", value: 135, max: 200, color: "bg-blue-400"   },
                  { label: "Assignments submitted",       value: 23,  max: 50,  color: "bg-orange-400" },
                  { label: "Quizzes attempted",           value: 61,  max: 100, color: "bg-pink-400"   },
                  { label: "Notes published by lecturers",value: 14,  max: 30,  color: "bg-teal-400"   },
                  { label: "Active users today",          value: 47,  max: 135, color: "bg-green-400"  },
                ].map((row) => (
                  <div key={row.label} className="px-5 py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-600 font-medium">{row.label}</span>
                      <span className="text-sm font-black text-[#1a2a5e]">{row.value}<span className="text-gray-300 font-normal">/{row.max}</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.value / row.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Login history ─────────────────── */}
          {tab === "logins" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["User","Role","Login Time","Device","Status"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${roleColor(log.role)}`}>
                            {log.userName.split(" ").map(w=>w[0]).join("").slice(0,2)}
                          </div>
                          <span className="font-semibold text-[#1a2a5e]">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColor(log.role)}`}>{log.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{log.loginAt}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{log.device}</td>
                      <td className="px-5 py-3.5">
                        {log.status === "success"
                          ? <span className="flex items-center gap-1 text-xs text-green-600 font-bold"><CheckCircle2 size={13}/> Success</span>
                          : <span className="flex items-center gap-1 text-xs text-red-500 font-bold"><XCircle size={13}/> Failed</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── User activity ─────────────────── */}
          {tab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Name","Role","ID","Status","Last Login","Joined"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {systemUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1a2a5e] text-white text-xs font-black flex items-center justify-center">{u.avatar}</div>
                          <div>
                            <p className="font-semibold text-[#1a2a5e] text-sm">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${roleColor(u.role)}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{u.regNumber ?? u.staffId ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${u.status==="active"?"bg-green-400":"bg-gray-300"}`}/>
                          <span className="text-xs text-gray-500 capitalize">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{u.lastLogin}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{u.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminReports;