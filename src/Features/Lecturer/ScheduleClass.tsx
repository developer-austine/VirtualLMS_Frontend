import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Video, CheckCircle2, Link2,
  Loader2, Calendar, Clock, Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { useBanner } from "@/hooks/useBanner";

const platforms = ["Zoom", "Google Meet", "Microsoft Teams"];

const ScheduleClass = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { myCourses, loading } = useSelector((state: RootState) => state.course);
  const { jwt }                = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const [form, setForm] = useState({
    courseId:  "" as string | number,
    platform:  "Zoom",
    link:      "",
    date:      "",
    time:      "",
    duration:  "60",
    topic:     "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getLecturerCourses(token));
  }, [dispatch, token, navigate]);

  const selectedCourse = myCourses.find(c => c.id === Number(form.courseId));

  const handleSubmit = () => {
    if (!form.courseId || !form.link || !form.date || !form.time || !form.topic) return;
    // No schedule endpoint on backend yet — local success feedback
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); navigate("/lecturer/courses"); }, 2000);
  };

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
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/lecturer/dashboard")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <h1 className="text-lg font-black text-[#1a2a5e] flex items-center gap-2">
              <Video size={18} className="text-[#c9a227]" /> Schedule a Class
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Set up an online class for your students</p>
          </div>

          <div className="px-6 py-6 space-y-5">

            {/* ── Course selector ──────────────────────────────────────── */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">
                Course
              </label>
              {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-3">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs font-semibold">Loading courses...</span>
                </div>
              ) : myCourses.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No courses assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {myCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setForm(p => ({ ...p, courseId: c.id }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                        form.courseId === c.id
                          ? "border-[#c9a227] bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Color dot */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a2a5e] to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Video size={13} className="text-[#c9a227]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1a2a5e] truncate">
                          {c.courseCode && <span className="text-gray-400 mr-1">{c.courseCode}:</span>}
                          {c.courseName}
                        </p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Users size={9} /> {c.totalEnrolledStudents ?? 0} students
                          {c.semester && <><span className="mx-1">·</span>{c.semester}</>}
                        </p>
                      </div>
                      {form.courseId === c.id && (
                        <CheckCircle2 size={16} className="text-[#c9a227] ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Platform ─────────────────────────────────────────────── */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">
                Platform
              </label>
              <div className="flex gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm(prev => ({ ...prev, platform: p }))}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-colors ${
                      form.platform === p
                        ? "border-[#c9a227] bg-amber-50 text-[#1a2a5e]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Meeting link ─────────────────────────────────────────── */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">
                Meeting Link
              </label>
              <div className="relative">
                <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={form.link}
                  onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))}
                  placeholder={`Paste your ${form.platform} link here`}
                  className="pl-9 text-sm border-gray-200"
                />
              </div>
            </div>

            {/* ── Topic ────────────────────────────────────────────────── */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">
                Class Topic
              </label>
              <Input
                value={form.topic}
                onChange={(e) => setForm(p => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. Lecture 4: Inheritance and Polymorphism"
                className="text-sm border-gray-200"
              />
            </div>

            {/* ── Date + Time + Duration ───────────────────────────────── */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block flex items-center gap-1">
                  <Calendar size={10} /> Date
                </label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                  className="text-sm border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block flex items-center gap-1">
                  <Clock size={10} /> Time
                </label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm(p => ({ ...p, time: e.target.value }))}
                  className="text-sm border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">
                  Duration (min)
                </label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm(p => ({ ...p, duration: e.target.value }))}
                  className="text-sm border-gray-200"
                  min={15}
                  step={15}
                />
              </div>
            </div>

            {/* ── Preview card ─────────────────────────────────────────── */}
            {selectedCourse && form.date && form.time && form.topic && (
              <div className="rounded-xl border border-[#c9a227]/30 bg-amber-50/40 px-4 py-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1a2a5e] flex items-center justify-center flex-shrink-0">
                    <Video size={15} className="text-[#c9a227]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1a2a5e]">{form.topic}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {selectedCourse.courseCode ?? selectedCourse.courseName}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {form.date}</span>
                      <span className="flex items-center gap-1"><Clock size={9} /> {form.time}</span>
                      <span>{form.platform}</span>
                      <span>{form.duration} min</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Submit ───────────────────────────────────────────────── */}
            <Button
              onClick={handleSubmit}
              disabled={!form.courseId || !form.link || !form.date || !form.time || !form.topic}
              className={`w-full font-bold text-sm gap-2 ${
                submitted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1a2a5e] hover:bg-[#132047]"
              } text-white disabled:opacity-40`}
            >
              {submitted
                ? <><CheckCircle2 size={15} /> Class Scheduled!</>
                : <><Video size={15} /> Schedule Class</>
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleClass;