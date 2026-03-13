import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Trash2, Calendar,
  CheckCircle2, XCircle, Loader2, ClipboardList, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { takeAttendance, getAttendanceSessions, deleteAttendanceSession } from "@/Redux-Toolkit/features/Attendance/attendanceThunk";
import { getLecturerCourseById } from "@/Redux-Toolkit/features/Course/courseThunk";
import { useBanner } from "@/hooks/useBanner";

const LecturerAttendance = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { sessions, loading }  = useSelector((s: RootState) => s.attendance);
  const { selectedCourse }     = useSelector((s: RootState) => s.course);
  const { jwt }                = useSelector((s: RootState) => s.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [addDialog,    setAddDialog]    = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
  const [newTitle,     setNewTitle]     = useState("");
  const [newDate,      setNewDate]      = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    dispatch(getLecturerCourseById({ token, courseId: Number(id) }));
    dispatch(getAttendanceSessions({ token, courseId: Number(id) }));
  }, [dispatch, id, token]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newDate) { toast.error("Please fill in all fields"); return; }
    setSubmitting(true);
    const result = await dispatch(takeAttendance({ courseId: Number(id), token, data: { title: newTitle.trim(), date: newDate } }));
    setSubmitting(false);
    if (takeAttendance.fulfilled.match(result)) {
      toast.success("Session created!");
      setNewTitle(""); setNewDate(""); setAddDialog(false);
      dispatch(getAttendanceSessions({ token, courseId: Number(id) }));
    } else {
      toast.error((result.payload as string) || "Failed to create session");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    setDeleting(true);
    const result = await dispatch(deleteAttendanceSession({ token, sessionId: deleteDialog }));
    setDeleting(false);
    if (deleteAttendanceSession.fulfilled.match(result)) {
      toast.success("Session deleted"); setDeleteDialog(null);
      dispatch(getAttendanceSessions({ token, courseId: Number(id) }));
    } else {
      toast.error("Failed to delete session");
    }
  };

  const sorted = [...(Array.isArray(sessions) ? sessions : [])].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPresent = sorted.reduce((s: number, x: any) => s + (x.presentCount ?? 0), 0);
  const totalAbsent  = sorted.reduce((s: number, x: any) => s + (x.absentCount ?? 0), 0);

  return (
    <div className="min-h-screen w-full"
      style={{ backgroundImage: `url(${useBanner()})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">

        {/* ── Single card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <button onClick={() => navigate(`/lecturer/course/${id}`)}
                className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-1.5">
                <ArrowLeft size={12} /> Back to Course
              </button>
              <div className="flex items-center gap-2">
                <ClipboardList size={15} className="text-[#c9a227]" />
                <h1 className="text-sm font-black text-[#1a2a5e]">Attendance</h1>
                {selectedCourse?.courseCode && (
                  <span className="text-xs text-gray-400">· {selectedCourse.courseCode}</span>
                )}
              </div>
            </div>

            {/* Inline stats + button */}
            <div className="flex items-center gap-4">
              {sorted.length > 0 && (
                <div className="hidden sm:flex items-center gap-3 text-xs">
                  <span className="text-gray-400 font-semibold">{sorted.length} sessions</span>
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> {totalPresent}
                  </span>
                  <span className="text-red-500 font-semibold flex items-center gap-1">
                    <XCircle size={11} /> {totalAbsent}
                  </span>
                </div>
              )}
              <Button size="sm" onClick={() => setAddDialog(true)}
                className="gap-1.5 text-xs font-bold bg-[#1a2a5e] hover:bg-[#132047] text-white h-8">
                <Plus size={13} /> New Session
              </Button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex items-center justify-center py-14 gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Loading sessions...</span>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-14">
              <ClipboardList size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-semibold">No sessions yet</p>
              <button onClick={() => setAddDialog(true)}
                className="mt-2 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto">
                <Plus size={11} /> Create first session
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sorted.map((session: any) => {
                const d     = new Date(session.date + "T00:00:00");
                const day   = d.getDate();
                const mon   = d.toLocaleString("default", { month: "short" });
                const total = (session.presentCount ?? 0) + (session.absentCount ?? 0);
                const pct   = total > 0 ? Math.round((session.presentCount / total) * 100) : null;

                return (
                  <div key={session.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
                    {/* Date pill */}
                    <div className="w-10 h-10 rounded-lg bg-[#1a2a5e] flex flex-col items-center justify-center text-white flex-shrink-0">
                      <span className="text-sm font-black leading-none">{day}</span>
                      <span className="text-[8px] font-bold uppercase opacity-70">{mon}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a2a5e] truncate">{session.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-green-600">{session.presentCount ?? 0} present</span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-red-500">{session.absentCount ?? 0} absent</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Users size={9} /> {total} responded
                        </span>
                        {pct !== null && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                            pct >= 75 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                          }`}>{pct}%</span>
                        )}
                      </div>
                      {total > 0 && (
                        <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden w-32">
                          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <button onClick={() => setDeleteDialog(session.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {sorted.length > 0 && (
            <div className="px-5 py-2.5 bg-gray-50/60 border-t border-gray-100">
              <p className="text-[10px] text-gray-400">
                {sorted.length} session{sorted.length !== 1 ? "s" : ""} · students self-mark their attendance
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-sm" aria-describedby="add-session-desc">
          <DialogHeader>
            <DialogTitle className="text-[#1a2a5e] font-black">New Session</DialogTitle>
          </DialogHeader>
          <p id="add-session-desc" className="sr-only">Create a new attendance session</p>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Week 5 Lecture" className="text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="text-sm" />
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <Calendar size={13} className="text-[#c9a227] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700">Students will self-mark after you create this session.</p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 h-8 text-xs" onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button disabled={submitting || !newTitle.trim() || !newDate}
                className="flex-1 h-8 text-xs bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold"
                onClick={handleCreate}>
                {submitting ? <><Loader2 size={12} className="animate-spin" /> Creating...</> : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm" aria-describedby="delete-session-desc">
          <DialogHeader>
            <DialogTitle className="text-red-600 font-black">Delete Session?</DialogTitle>
          </DialogHeader>
          <p id="delete-session-desc" className="text-sm text-gray-500">
            This will permanently delete the session and all student records.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 h-8 text-xs" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button disabled={deleting} className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-bold" onClick={handleDelete}>
              {deleting ? <><Loader2 size={12} className="animate-spin" /> Deleting...</> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LecturerAttendance;