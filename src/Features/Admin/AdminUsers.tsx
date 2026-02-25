import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Search, Plus, Trash2, Users,
  GraduationCap, BookOpen, CheckCircle2, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { systemUsers, type SystemUser } from "./data/adminData";
import { useBanner } from "@/hooks/useBanner";

type Tab = "all" | "students" | "lecturers" | "add-lecturer" | "add-student";

const roleColor = (role: string) => {
  switch (role) {
    case "student":  return "bg-blue-100 text-blue-700 border-blue-200";
    case "lecturer": return "bg-purple-100 text-purple-700 border-purple-200";
    case "admin":    return "bg-amber-100 text-[#c9a227] border-amber-200";
    default:         return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const TABS: { key: Tab; label: string }[] = [
  { key: "all",          label: "All Users"     },
  { key: "students",     label: "Students"      },
  { key: "lecturers",    label: "Lecturers"     },
  { key: "add-lecturer", label: "➕ Add Lecturer" },
  { key: "add-student",  label: "➕ Add Student"  },
];

const emptyLecturer = { name:"", email:"", staffId:"", department:"", password:"", confirm:"" };
const emptyStudent  = { name:"", email:"", regNumber:"", course:"", password:"", confirm:"" };

const AdminUsers = () => {
  const bgImage = useBanner();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [lecturerForm, setLecturerForm] = useState(emptyLecturer);
  const [studentForm,  setStudentForm]  = useState(emptyStudent);
  const [saved, setSaved] = useState(false);

  const filtered = users.filter((u) => {
    const matchSearch = `${u.name} ${u.email} ${u.regNumber ?? ""} ${u.staffId ?? ""}`.toLowerCase().includes(search.toLowerCase());
    if (tab === "students")  return matchSearch && u.role === "student";
    if (tab === "lecturers") return matchSearch && u.role === "lecturer";
    return matchSearch;
  });

  const deleteUser = (id: string) => setUsers((p) => p.filter((u) => u.id !== id));

  const handleSave = (role: "lecturer" | "student") => {
    const form = role === "lecturer" ? lecturerForm : studentForm;
    if (!form.name || !form.email || !form.password) return;
    const newUser: SystemUser = {
      id: `${role[0]}${Date.now()}`,
      name: form.name,
      email: form.email,
      role,
      avatar: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      status: "active",
      lastLogin: "Never",
      joinedAt: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      ...(role === "lecturer"
        ? { staffId: (lecturerForm as typeof emptyLecturer).staffId, department: (lecturerForm as typeof emptyLecturer).department }
        : { regNumber: (studentForm  as typeof emptyStudent).regNumber }),
    };
    setUsers((p) => [newUser, ...p]);
    role === "lecturer" ? setLecturerForm(emptyLecturer) : setStudentForm(emptyStudent);
    setSaved(true);
    setTimeout(() => { setSaved(false); setTab("all"); }, 1500);
  };

  const FormField = ({ label, value, onChange, type = "text", placeholder = "" }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">{label}</label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="text-sm border-gray-200" />
    </div>
  );

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
              <Users size={20} className="text-[#c9a227]" /> User Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Create, view and manage all system users</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-[#c9a227] text-[#1a2a5e] bg-amber-50/40"
                    : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Users table ───────────────────── */}
          {(tab === "all" || tab === "students" || tab === "lecturers") && (
            <div>
              <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
                <div className="relative flex-1 max-w-sm">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 h-9 text-sm border-gray-200" />
                </div>
                <span className="text-xs text-gray-400 font-semibold">{filtered.length} users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["User","Email","ID","Role","Status","Last Login",""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1a2a5e] text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                              {user.avatar}
                            </div>
                            <span className="font-semibold text-[#1a2a5e] text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{user.email}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{user.regNumber ?? user.staffId ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${roleColor(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-gray-300"}`} />
                            <span className="text-xs text-gray-500 capitalize">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">{user.lastLogin}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteUser(user.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-50 text-red-400">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Add Lecturer form ─────────────── */}
          {tab === "add-lecturer" && (
            <div className="px-6 py-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen size={18} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1a2a5e]">Add New Lecturer</h2>
                  <p className="text-xs text-gray-400">Fill in details to create a lecturer account</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" value={lecturerForm.name} onChange={(v) => setLecturerForm(p => ({...p, name:v}))} placeholder="e.g. Dr. Jane Odhiambo" />
                <FormField label="Email Address" value={lecturerForm.email} onChange={(v) => setLecturerForm(p => ({...p, email:v}))} type="email" placeholder="jane@kcau.ac.ke" />
                <FormField label="Staff ID" value={lecturerForm.staffId} onChange={(v) => setLecturerForm(p => ({...p, staffId:v}))} placeholder="STAFF/2024/001" />
                <FormField label="Department" value={lecturerForm.department} onChange={(v) => setLecturerForm(p => ({...p, department:v}))} placeholder="School of Technology" />
                <FormField label="Password" value={lecturerForm.password} onChange={(v) => setLecturerForm(p => ({...p, password:v}))} type="password" placeholder="••••••••" />
                <FormField label="Confirm Password" value={lecturerForm.confirm} onChange={(v) => setLecturerForm(p => ({...p, confirm:v}))} type="password" placeholder="••••••••" />
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => handleSave("lecturer")}
                  className={`flex-1 font-bold text-sm ${saved ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"} text-white`}>
                  {saved ? <><CheckCircle2 size={14} /> Created!</> : <><Plus size={14} /> Create Lecturer Account</>}
                </Button>
                <Button variant="outline" onClick={() => setLecturerForm(emptyLecturer)} className="px-5 border-gray-200">
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* ── Add Student form ──────────────── */}
          {tab === "add-student" && (
            <div className="px-6 py-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1a2a5e]">Add New Student</h2>
                  <p className="text-xs text-gray-400">Fill in details to create a student account</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" value={studentForm.name} onChange={(v) => setStudentForm(p => ({...p, name:v}))} placeholder="e.g. Grace Achieng" />
                <FormField label="Email Address" value={studentForm.email} onChange={(v) => setStudentForm(p => ({...p, email:v}))} type="email" placeholder="grace@kcau.ac.ke" />
                <FormField label="Registration Number" value={studentForm.regNumber} onChange={(v) => setStudentForm(p => ({...p, regNumber:v}))} placeholder="SKL/2024/001" />
                <FormField label="Course / Programme" value={studentForm.course} onChange={(v) => setStudentForm(p => ({...p, course:v}))} placeholder="BSc. Computer Science" />
                <FormField label="Password" value={studentForm.password} onChange={(v) => setStudentForm(p => ({...p, password:v}))} type="password" placeholder="••••••••" />
                <FormField label="Confirm Password" value={studentForm.confirm} onChange={(v) => setStudentForm(p => ({...p, confirm:v}))} type="password" placeholder="••••••••" />
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => handleSave("student")}
                  className={`flex-1 font-bold text-sm ${saved ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"} text-white`}>
                  {saved ? <><CheckCircle2 size={14} /> Created!</> : <><Plus size={14} /> Create Student Account</>}
                </Button>
                <Button variant="outline" onClick={() => setStudentForm(emptyStudent)} className="px-5 border-gray-200">
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminUsers;