import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import {
    getStudentAttendanceSessions,
    submitStudentAttendance,
} from "@/Redux-Toolkit/features/StudentAttendance/studentAttendanceThunk";
import type { AttendanceSessionDto } from "@/Redux-Toolkit/features/StudentAttendance/studentAttendanceSlice";
import {
    ArrowLeft, CheckCircle2, XCircle, Loader2,
    UserCheck, Calendar, Users, ChevronRight, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import schoolOfBusiness from "../../assets/school-of-business.png";

const AttendancePage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate     = useNavigate();
    const dispatch     = useDispatch<AppDispatch>();

    const { jwt }                                   = useSelector((s: RootState) => s.auth);
    const { sessionsByCourse, loading, submitting } = useSelector((s: RootState) => s.studentAttendance);

    const sessions: AttendanceSessionDto[] = sessionsByCourse[Number(courseId)] ?? [];

    const [activeSession, setActiveSession] = useState<AttendanceSessionDto | null>(null);
    const [choice, setChoice]               = useState<boolean | null>(null);

    useEffect(() => {
        if (jwt && courseId)
            dispatch(getStudentAttendanceSessions({ courseId: Number(courseId), token: jwt }));
    }, [jwt, courseId, dispatch]);

    useEffect(() => {
        if (activeSession) {
            const updated = sessions.find(s => s.id === activeSession.id);
            if (updated) setActiveSession(updated);
        }
    }, [sessions]);

    const handleSubmit = async () => {
        if (!activeSession || choice === null || !jwt) return;
        const result = await dispatch(submitStudentAttendance({
            sessionId: activeSession.id,
            isPresent: choice,
            token: jwt,
        }));
        if (submitStudentAttendance.fulfilled.match(result)) {
            toast.success(choice ? "Marked as Present ✓" : "Marked as Absent", {
                description: `${activeSession.title} — ${activeSession.date}`,
            });
        } else {
            toast.error("Submission failed", { description: result.payload as string });
        }
    };

    const fmtDate = (d: string) =>
        new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
        });
    const fmtDay = (d: string) => new Date(d + "T00:00:00").getDate();
    const fmtMon = (d: string) =>
        new Date(d + "T00:00:00").toLocaleDateString("en-GB", { month: "short" });

    if (loading) return (
        <div className="min-h-screen w-full flex items-center justify-center"
            style={{ backgroundImage: `url(${schoolOfBusiness})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center gap-3">
                <Loader2 size={20} className="animate-spin text-[#c9a227]" />
                <p className="text-xs text-gray-400">Loading sessions...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full"
            style={{ backgroundImage: `url(${schoolOfBusiness})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
            <div className="relative z-10 max-w-xl mx-auto px-4 py-8">

                {/* ── SESSION LIST ─────────────────────────────────── */}
                {!activeSession && (
                    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <button onClick={() => navigate(`/course/${courseId}`)}
                                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
                                <ArrowLeft size={12} /> Back to Course
                            </button>
                            <div className="flex items-center gap-2">
                                <UserCheck size={15} className="text-orange-500" />
                                <h1 className="text-sm font-black text-[#1a2a5e]">Attendance</h1>
                                <span className="ml-auto text-xs text-gray-400">
                                    {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {sessions.length === 0 ? (
                            <div className="px-5 py-10 text-center">
                                <UserCheck size={24} className="text-gray-200 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">No sessions yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {sessions.map((session) => {
                                    const submitted = !!session.myRecord;
                                    const isPresent = session.myRecord?.isPresent;
                                    return (
                                        <div key={session.id}
                                            onClick={() => { setActiveSession(session); setChoice(null); }}
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer group transition-colors">

                                            {/* Date pill */}
                                            <div className="w-9 h-9 rounded-lg bg-[#1a2a5e]/5 flex flex-col items-center justify-center flex-shrink-0">
                                                <span className="text-[8px] font-black text-[#c9a227] uppercase leading-none">{fmtMon(session.date)}</span>
                                                <span className="text-xs font-black text-[#1a2a5e]">{fmtDay(session.date)}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#1a2a5e] truncate">{session.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-green-600">{session.presentCount} present</span>
                                                    <span className="text-[10px] text-gray-300">·</span>
                                                    <span className="text-[10px] text-red-500">{session.absentCount} absent</span>
                                                </div>
                                            </div>

                                            {/* Status + arrow */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {submitted ? (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                        isPresent
                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                            : "bg-red-50 text-red-500 border-red-200"
                                                    }`}>
                                                        {isPresent ? "Present" : "Absent"}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-600 border-amber-200">
                                                        Pending
                                                    </span>
                                                )}
                                                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#c9a227]" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── SESSION DETAIL ────────────────────────────────── */}
                {activeSession && (
                    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                        <div className="h-0.5 w-full bg-[#c9a227]" />

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100">
                            <button onClick={() => setActiveSession(null)}
                                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
                                <ArrowLeft size={12} /> Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex flex-col items-center justify-center flex-shrink-0">
                                    <span className="text-[8px] font-black text-[#c9a227] uppercase leading-none">{fmtMon(activeSession.date)}</span>
                                    <span className="text-xs font-black text-[#1a2a5e]">{fmtDay(activeSession.date)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#1a2a5e] truncate">{activeSession.title}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={9} /> {fmtDate(activeSession.date)}
                                    </p>
                                </div>
                                {/* Inline stats */}
                                <div className="flex items-center gap-2 text-xs flex-shrink-0">
                                    <span className="text-green-600 font-semibold">{activeSession.presentCount}✓</span>
                                    <span className="text-red-500 font-semibold">{activeSession.absentCount}✗</span>
                                    <span className="text-gray-400 flex items-center gap-0.5">
                                        <Users size={9} />{activeSession.totalStudents}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-5">
                            {activeSession.myRecord ? (
                                /* Already submitted */
                                <div className="flex flex-col items-center gap-3 py-3">
                                    {activeSession.myRecord.isPresent
                                        ? <CheckCircle2 size={24} className="text-green-500" />
                                        : <XCircle size={24} className="text-red-500" />
                                    }
                                    <p className="text-sm font-bold text-[#1a2a5e]">
                                        Marked as{" "}
                                        <span className={activeSession.myRecord.isPresent ? "text-green-600" : "text-red-500"}>
                                            {activeSession.myRecord.isPresent ? "Present" : "Absent"}
                                        </span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Lock size={9} /> Locked — cannot be changed
                                    </p>
                                    <button onClick={() => setActiveSession(null)}
                                        className="text-xs text-[#c9a227] font-semibold hover:underline mt-1">
                                        ← Back to sessions
                                    </button>
                                </div>
                            ) : (
                                /* Mark attendance — compact radio rows */
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold text-gray-500">Select your attendance</p>

                                    <div className="space-y-2">
                                        {([
                                            { value: true,  label: "Present", icon: CheckCircle2, sel: "border-green-500 bg-green-50 text-green-700", dot: "bg-green-500" },
                                            { value: false, label: "Absent",  icon: XCircle,      sel: "border-red-400 bg-red-50 text-red-600",       dot: "bg-red-400"  },
                                        ] as const).map(opt => (
                                            <label key={String(opt.value)}
                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                                                    choice === opt.value ? opt.sel : "border-gray-200 hover:border-gray-300 text-gray-500"
                                                }`}>
                                                <input type="radio" name="attendance" className="sr-only"
                                                    onChange={() => setChoice(opt.value)}
                                                    checked={choice === opt.value} />
                                                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                    choice === opt.value ? "border-current" : "border-gray-300"
                                                }`}>
                                                    {choice === opt.value && (
                                                        <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                                                    )}
                                                </span>
                                                <opt.icon size={13} />
                                                <span className="text-sm font-semibold">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-[10px] text-gray-400">⚠ One submission only</p>
                                        <Button size="sm" onClick={handleSubmit}
                                            disabled={choice === null || submitting}
                                            className={`text-xs font-bold px-5 h-8 ${
                                                choice === true  ? "bg-green-600 hover:bg-green-700 text-white" :
                                                choice === false ? "bg-red-500 hover:bg-red-600 text-white" :
                                                                   "bg-gray-200 text-gray-400"
                                            }`}>
                                            {submitting
                                                ? <><Loader2 size={11} className="animate-spin" /> Submitting...</>
                                                : "Submit"
                                            }
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendancePage;