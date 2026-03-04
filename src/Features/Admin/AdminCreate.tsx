import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    ArrowLeft, Plus, X, BookOpen,
    GraduationCap, GitBranch, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { createLecturer, createStudent } from "@/Redux-Toolkit/features/Admin/adminThunk";
import { createBranch, getAllBranches } from "@/Redux-Toolkit/features/Branch/branchThunk";
import { useBanner } from "@/hooks/useBanner";

type Tab = "lecturer" | "student" | "branch";

const TABS: { key: Tab; label: string; icon: React.ElementType; color: string; bg: string }[] = [
    { key: "lecturer", label: "Add Lecturer", icon: BookOpen,      color: "text-purple-600", bg: "bg-purple-100" },
    { key: "student",  label: "Add Student",  icon: GraduationCap, color: "text-blue-600",   bg: "bg-blue-100"   },
    { key: "branch",   label: "Add Branch",   icon: GitBranch,     color: "text-teal-600",   bg: "bg-teal-100"   },
];

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">
            {label}
        </label>
        {children}
    </div>
);

const AdminCreate = () => {
    const bgImage   = useBanner();
    const navigate  = useNavigate();
    const dispatch  = useDispatch<AppDispatch>();

    const { loading: adminLoading } = useSelector((state: RootState) => state.admin);
    const { loading: branchLoading, branches } = useSelector((state: RootState) => state.branch);

    const [tab, setTab] = useState<Tab>("lecturer");

    const [lecturer, setLecturer] = useState({
        fullName: "", email: "", password: "", confirm: "", branchId: ""
    });

    const [student, setStudent] = useState({
        fullName: "", email: "", password: "", confirm: "", branchId: ""
    });

    const [branch, setBranch] = useState({
        name: "", address: "", phone: "", email: "",
        openTime: "", closeTime: "", workingDays: [] as string[]
    });

    // Fetch branches for dropdowns
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) dispatch(getAllBranches(token));
    }, [dispatch]);

    const toggleDay = (day: string) => {
        setBranch(p => ({
            ...p,
            workingDays: p.workingDays.includes(day)
                ? p.workingDays.filter(d => d !== day)
                : [...p.workingDays, day]
        }));
    };

    const handleCreateLecturer = async () => {
        if (!lecturer.fullName || !lecturer.email || !lecturer.password || !lecturer.branchId) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (lecturer.password !== lecturer.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        const token = localStorage.getItem("jwt");
        if (!token) { toast.error("Not authenticated"); return; }

        const result = await dispatch(createLecturer({
            token,
            data: {
                fullName: lecturer.fullName,
                email: lecturer.email,
                password: lecturer.password,
                branchIds: [Number(lecturer.branchId)],
            }
        }));

        if (createLecturer.fulfilled.match(result)) {
            toast.success(`Lecturer ${lecturer.fullName} created successfully!`);
            setLecturer({ fullName: "", email: "", password: "", confirm: "", branchId: "" });
        } else {
            toast.error(result.payload as string || "Failed to create lecturer");
        }
    };

    const handleCreateStudent = async () => {
        if (!student.fullName || !student.email || !student.password || !student.branchId) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (student.password !== student.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        const token = localStorage.getItem("jwt");
        if (!token) { toast.error("Not authenticated"); return; }

        const result = await dispatch(createStudent({
            token,
            data: {
                fullName: student.fullName,
                email: student.email,
                password: student.password,
                branchId: Number(student.branchId),
            }
        }));

        if (createStudent.fulfilled.match(result)) {
            toast.success(`Student ${student.fullName} created successfully!`);
            setStudent({ fullName: "", email: "", password: "", confirm: "", branchId: "" });
        } else {
            toast.error(result.payload as string || "Failed to create student");
        }
    };

    const handleCreateBranch = async () => {
        if (!branch.name || !branch.phone) {
            toast.error("Branch name and phone are required");
            return;
        }
        const token = localStorage.getItem("jwt");
        if (!token) { toast.error("Not authenticated"); return; }

        const result = await dispatch(createBranch({
            token,
            data: {
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
                email: branch.email,
                openTime: branch.openTime,
                closeTime: branch.closeTime,
                workingDays: branch.workingDays,
            }
        }));

        if (createBranch.fulfilled.match(result)) {
            toast.success(`Branch "${branch.name}" created successfully!`);
            setBranch({ name: "", address: "", phone: "", email: "", openTime: "", closeTime: "", workingDays: [] });
            // Refresh branches list for dropdowns
            dispatch(getAllBranches(token));
        } else {
            toast.error(result.payload as string || "Failed to create branch");
        }
    };

    const loading = adminLoading || branchLoading;

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
            <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* ── Header ─────────────────────────────────────────── */}
                    <div className="px-6 py-5 border-b border-gray-100">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
                        >
                            <ArrowLeft size={13} /> Back to Dashboard
                        </button>
                        <h1 className="text-xl font-black text-[#1a2a5e]">Create Users & Branches</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Add lecturers, students and branches to the system
                        </p>
                    </div>

                    {/* ── Tabs ───────────────────────────────────────────── */}
                    <div className="flex border-b border-gray-100">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold transition-colors border-b-2 ${
                                    tab === t.key
                                        ? "border-[#c9a227] text-[#1a2a5e] bg-amber-50/40"
                                        : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                                }`}
                            >
                                <t.icon size={14} />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab content ────────────────────────────────────── */}
                    <div className="px-6 py-6">

                        {/* ── Create Lecturer ─────────────────────────────── */}
                        {tab === "lecturer" && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <BookOpen size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-black text-[#1a2a5e]">New Lecturer Account</h2>
                                        <p className="text-xs text-gray-400">Fill in details to create a lecturer</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name *">
                                        <Input
                                            value={lecturer.fullName}
                                            onChange={e => setLecturer(p => ({ ...p, fullName: e.target.value }))}
                                            placeholder="e.g. Dr. Jane Odhiambo"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Email Address *">
                                        <Input
                                            type="email"
                                            value={lecturer.email}
                                            onChange={e => setLecturer(p => ({ ...p, email: e.target.value }))}
                                            placeholder="jane@skylimit.ac.ke"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Password *">
                                        <Input
                                            type="password"
                                            value={lecturer.password}
                                            onChange={e => setLecturer(p => ({ ...p, password: e.target.value }))}
                                            placeholder="••••••••"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Confirm Password *">
                                        <Input
                                            type="password"
                                            value={lecturer.confirm}
                                            onChange={e => setLecturer(p => ({ ...p, confirm: e.target.value }))}
                                            placeholder="••••••••"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Branch *">
                                        <select
                                            value={lecturer.branchId}
                                            onChange={e => setLecturer(p => ({ ...p, branchId: e.target.value }))}
                                            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227]"
                                        >
                                            <option value="">Select a branch</option>
                                            {branches.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        onClick={handleCreateLecturer}
                                        disabled={loading}
                                        className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                                    >
                                        {loading
                                            ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                                            : <><Plus size={14} /> Create Lecturer Account</>
                                        }
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setLecturer({ fullName: "", email: "", password: "", confirm: "", branchId: "" })}
                                        className="px-5 border-gray-200"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Create Student ──────────────────────────────── */}
                        {tab === "student" && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <GraduationCap size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-black text-[#1a2a5e]">New Student Account</h2>
                                        <p className="text-xs text-gray-400">Fill in details to create a student</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name *">
                                        <Input
                                            value={student.fullName}
                                            onChange={e => setStudent(p => ({ ...p, fullName: e.target.value }))}
                                            placeholder="e.g. Grace Achieng"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Email Address *">
                                        <Input
                                            type="email"
                                            value={student.email}
                                            onChange={e => setStudent(p => ({ ...p, email: e.target.value }))}
                                            placeholder="grace@skylimit.ac.ke"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Password *">
                                        <Input
                                            type="password"
                                            value={student.password}
                                            onChange={e => setStudent(p => ({ ...p, password: e.target.value }))}
                                            placeholder="••••••••"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Confirm Password *">
                                        <Input
                                            type="password"
                                            value={student.confirm}
                                            onChange={e => setStudent(p => ({ ...p, confirm: e.target.value }))}
                                            placeholder="••••••••"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Branch *">
                                        <select
                                            value={student.branchId}
                                            onChange={e => setStudent(p => ({ ...p, branchId: e.target.value }))}
                                            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:border-[#c9a227]"
                                        >
                                            <option value="">Select a branch</option>
                                            {branches.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </Field>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        onClick={handleCreateStudent}
                                        disabled={loading}
                                        className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                                    >
                                        {loading
                                            ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                                            : <><Plus size={14} /> Create Student Account</>
                                        }
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setStudent({ fullName: "", email: "", password: "", confirm: "", branchId: "" })}
                                        className="px-5 border-gray-200"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Create Branch ───────────────────────────────── */}
                        {tab === "branch" && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                        <GitBranch size={18} className="text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-black text-[#1a2a5e]">New Branch</h2>
                                        <p className="text-xs text-gray-400">Add a new campus branch to the system</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Branch Name *">
                                        <Input
                                            value={branch.name}
                                            onChange={e => setBranch(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. Main Campus"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Phone *">
                                        <Input
                                            value={branch.phone}
                                            onChange={e => setBranch(p => ({ ...p, phone: e.target.value }))}
                                            placeholder="e.g. 0700000000"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Email">
                                        <Input
                                            type="email"
                                            value={branch.email}
                                            onChange={e => setBranch(p => ({ ...p, email: e.target.value }))}
                                            placeholder="main@skylimit.ac.ke"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Address">
                                        <Input
                                            value={branch.address}
                                            onChange={e => setBranch(p => ({ ...p, address: e.target.value }))}
                                            placeholder="e.g. Nairobi, Kenya"
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Opening Time">
                                        <Input
                                            type="time"
                                            value={branch.openTime}
                                            onChange={e => setBranch(p => ({ ...p, openTime: e.target.value }))}
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                    <Field label="Closing Time">
                                        <Input
                                            type="time"
                                            value={branch.closeTime}
                                            onChange={e => setBranch(p => ({ ...p, closeTime: e.target.value }))}
                                            className="text-sm border-gray-200"
                                        />
                                    </Field>
                                </div>

                                {/* Working days */}
                                <div className="mt-4">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                                        Working Days
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                                                    branch.workingDays.includes(day)
                                                        ? "bg-[#1a2a5e] text-white border-[#1a2a5e]"
                                                        : "bg-white text-gray-500 border-gray-200 hover:border-[#1a2a5e]"
                                                }`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        onClick={handleCreateBranch}
                                        disabled={loading}
                                        className="flex-1 font-bold text-sm bg-[#1a2a5e] hover:bg-[#132047] text-white"
                                    >
                                        {loading
                                            ? <><Loader2 size={14} className="animate-spin" /> Creating...</>
                                            : <><Plus size={14} /> Create Branch</>
                                        }
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setBranch({ name: "", address: "", phone: "", email: "", openTime: "", closeTime: "", workingDays: [] })}
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
        </div>
    );
};

export default AdminCreate;