import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft, Search, Trash2, Users,
  GraduationCap, BookOpen, Plus, X,
  Loader2, GitBranch,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import {
  getAllStudentsAdmin,
  getAllLecturersAdmin,
  deleteStudent,
  deleteLecturer,
  createLecturer,
  createStudent,
} from "@/Redux-Toolkit/features/Admin/adminThunk";
import { getAllBranches } from "@/Redux-Toolkit/features/Branch/branchThunk";
import { useBanner } from "@/hooks/useBanner";

type Tab = "all" | "students" | "lecturers" | "add-lecturer" | "add-student";

const TABS: { key: Tab; label: string }[] = [
  { key: "all",          label: "All Users"      },
  { key: "students",     label: "Students"       },
  { key: "lecturers",    label: "Lecturers"      },
  { key: "add-lecturer", label: "➕ Add Lecturer" },
  { key: "add-student",  label: "➕ Add Student"  },
];

const roleColor = (role: string) => {
  switch (role) {
    case "ROLE_STUDENT":  return "bg-blue-100 text-blue-700 border-blue-200";
    case "ROLE_LECTURER": return "bg-purple-100 text-purple-700 border-purple-200";
    default:              return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const Field = ({
  label, value, onChange, type = "text", placeholder = "",
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
      {label}
    </label>
    <Input
      type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="text-sm border-gray-200"
    />
  </div>
);

const emptyLecturer = { fullName: "", email: "", password: "", confirm: "", branchId: "" };
const emptyStudent  = { fullName: "", email: "", password: "", confirm: "", branchId: "" };

const AdminUsers = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { students, lecturers, loading: adminLoading } = useSelector((state: RootState) => state.admin);
  const { branches }                                   = useSelector((state: RootState) => state.branch);
  const { jwt }                                        = useSelector((state: RootState) => state.auth);

  const [tab, setTab]               = useState<Tab>("all");
  const [search, setSearch]         = useState("");
  const [lecturerForm, setLecturer] = useState(emptyLecturer);
  const [studentForm,  setStudent]  = useState(emptyStudent);

  const token = jwt || localStorage.getItem("jwt") || "";

  // ── Fetch on mount
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getAllStudentsAdmin(token));
    dispatch(getAllLecturersAdmin(token));
    dispatch(getAllBranches(token));
  }, [dispatch, token, navigate]);

  // ── Combined list for "all" tab 
  const allUsers = [
    ...lecturers.map((l) => ({ ...l, role: "ROLE_LECTURER" as const })),
    ...students.map((s)  => ({ ...s, role: "ROLE_STUDENT"  as const })),
  ];

  const getList = () => {
    const base =
      tab === "students"  ? students.map((s) => ({ ...s, role: "ROLE_STUDENT"  as const })) :
      tab === "lecturers" ? lecturers.map((l) => ({ ...l, role: "ROLE_LECTURER" as const })) :
      allUsers;

    return base.filter((u) =>
      `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filtered = getList();

  // ── Delete handlers 
  const handleDeleteStudent = async (id: number, name: string) => {
    if (!window.confirm(`Delete student ${name}?`)) return;
    const result = await dispatch(deleteStudent({ studentId: id, token }));
    if (deleteStudent.fulfilled.match(result)) {
      toast.success(`${name} deleted successfully`);
    } else {
      toast.error(result.payload as string || "Failed to delete student");
    }
  };

  const handleDeleteLecturer = async (id: number, name: string) => {
    if (!window.confirm(`Delete lecturer ${name}?`)) return;
    const result = await dispatch(deleteLecturer({ lecturerId: id, token }));
    if (deleteLecturer.fulfilled.match(result)) {
      toast.success(`${name} deleted successfully`);
    } else {
      toast.error(result.payload as string || "Failed to delete lecturer");
    }
  };

  // ── Create handlers
  const handleCreateLecturer = async () => {
    if (!lecturerForm.fullName || !lecturerForm.email || !lecturerForm.password || !lecturerForm.branchId) {
      toast.error("Please fill in all required fields"); return;
    }
    if (lecturerForm.password !== lecturerForm.confirm) {
      toast.error("Passwords do not match"); return;
    }
    const result = await dispatch(createLecturer({
      token,
      data: {
        fullName: lecturerForm.fullName,
        email: lecturerForm.email,
        password: lecturerForm.password,
        branchIds: [Number(lecturerForm.branchId)],
      },
    }));
    if (createLecturer.fulfilled.match(result)) {
      toast.success(`Lecturer ${lecturerForm.fullName} created!`);
      setLecturer(emptyLecturer);
      setTab("lecturers");
    } else {
      toast.error(result.payload as string || "Failed to create lecturer");
    }
  };

  const handleCreateStudent = async () => {
    if (!studentForm.fullName || !studentForm.email || !studentForm.password || !studentForm.branchId) {
      toast.error("Please fill in all required fields"); return;
    }
    if (studentForm.password !== studentForm.confirm) {
      toast.error("Passwords do not match"); return;
    }
    const result = await dispatch(createStudent({
      token,
      data: {
        fullName: studentForm.fullName,
        email: studentForm.email,
        password: studentForm.password,
        branchId: Number(studentForm.branchId),
      },
    }));
    if (createStudent.fulfilled.match(result)) {
      toast.success(`Student ${studentForm.fullName} created!`);
      setStudent(emptyStudent);
      setTab("students");
    } else {
      toast.error(result.payload as string || "Failed to create student");
    }
  };

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Header  */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
                  <Users size={20} className="text-[#c9a227]" /> User Management
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create, view and manage all system users
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                <span className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-bold">
                  {lecturers.length} Lecturers
                </span>
                <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold">
                  {students.length} Students
                </span>
              </div>
            </div>
          </div>

          {/* ── Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-[#c9a227] text-[#1a2a5e] bg-amber-50/40"
                    : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Users table */}
          {(tab === "all" || tab === "students" || tab === "lecturers") && (
            <div>
              {/* Search bar */}
              <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
                <div className="relative flex-1 max-w-sm">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-9 h-9 text-sm border-gray-200"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  {filtered.length} {tab === "all" ? "users" : tab}
                </span>
              </div>

              {/* Loading */}
              {adminLoading ? (
                <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-semibold">Loading users...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Users size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-semibold">No users found</p>
                  <button
                    onClick={() => setTab(tab === "lecturers" ? "add-lecturer" : "add-student")}
                    className="mt-3 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={11} /> Add one now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["User", "Email", "Role", "Branch", "Joined", ""].map((h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((u) => (
                        <tr key={`${u.role}-${u.id}`} className="hover:bg-gray-50 group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                                u.role === "ROLE_LECTURER"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {u.fullName?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#1a2a5e] text-sm">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor(u.role)}`}>
                              {u.role === "ROLE_LECTURER" ? "Lecturer" : "Student"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <GitBranch size={11} className="text-teal-500" />
                              {u.role === "ROLE_STUDENT"
                                ? (u as any).branch?.name ?? "—"
                                : (u as any).branches?.map((b: any) => b.name).join(", ") || "—"
                              }
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                              : "—"
                            }
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                u.role === "ROLE_STUDENT"
                                  ? handleDeleteStudent(u.id, u.fullName)
                                  : handleDeleteLecturer(u.id, u.fullName)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-50 text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Add Lecturer for */}
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
                <Field
                  label="Full Name *"
                  value={lecturerForm.fullName}
                  onChange={(v) => setLecturer(p => ({ ...p, fullName: v }))}
                  placeholder="e.g. Dr. Jane Odhiambo"
                />
                <Field
                  label="Email Address *"
                  value={lecturerForm.email}
                  onChange={(v) => setLecturer(p => ({ ...p, email: v }))}
                  type="email"
                  placeholder="jane@skylimit.ac.ke"
                />
                <Field
                  label="Password *"
                  value={lecturerForm.password}
                  onChange={(v) => setLecturer(p => ({ ...p, password: v }))}
                  type="password"
                  placeholder="••••••••"
                />
                <Field
                  label="Confirm Password *"
                  value={lecturerForm.confirm}
                  onChange={(v) => setLecturer(p => ({ ...p, confirm: v }))}
                  type="password"
                  placeholder="••••••••"
                />
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                    Branch *
                  </label>
                  <select
                    value={lecturerForm.branchId}
                    onChange={(e) => setLecturer(p => ({ ...p, branchId: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227]"
                  >
                    <option value="">Select a branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCreateLecturer}
                  disabled={adminLoading}
                  className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                >
                  {adminLoading
                    ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                    : <><Plus size={14} /> Create Lecturer Account</>
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLecturer(emptyLecturer)}
                  className="px-5 border-gray-200"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* ── Add Student form */}
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
                <Field
                  label="Full Name *"
                  value={studentForm.fullName}
                  onChange={(v) => setStudent(p => ({ ...p, fullName: v }))}
                  placeholder="e.g. Grace Achieng"
                />
                <Field
                  label="Email Address *"
                  value={studentForm.email}
                  onChange={(v) => setStudent(p => ({ ...p, email: v }))}
                  type="email"
                  placeholder="grace@skylimit.ac.ke"
                />
                <Field
                  label="Password *"
                  value={studentForm.password}
                  onChange={(v) => setStudent(p => ({ ...p, password: v }))}
                  type="password"
                  placeholder="••••••••"
                />
                <Field
                  label="Confirm Password *"
                  value={studentForm.confirm}
                  onChange={(v) => setStudent(p => ({ ...p, confirm: v }))}
                  type="password"
                  placeholder="••••••••"
                />
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
                    Branch *
                  </label>
                  <select
                    value={studentForm.branchId}
                    onChange={(e) => setStudent(p => ({ ...p, branchId: e.target.value }))}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227]"
                  >
                    <option value="">Select a branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCreateStudent}
                  disabled={adminLoading}
                  className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                >
                  {adminLoading
                    ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                    : <><Plus size={14} /> Create Student Account</>
                  }
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStudent(emptyStudent)}
                  className="px-5 border-gray-200"
                >
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