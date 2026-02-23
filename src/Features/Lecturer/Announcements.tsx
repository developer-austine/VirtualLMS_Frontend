import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone, Send, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

interface Announcement {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  body: string;
  postedAt: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "ann1", courseId: "lc1",
    courseName: "CPP 3202: Advanced Java Programming",
    title: "Quiz 1 is now open",
    body: "Dear students, Quiz 1 covering Lecture 3 is now open on the portal. You have until Friday 14th Feb to complete it. Good luck!",
    postedAt: "2026-02-12 04:50 PM",
  },
  {
    id: "ann2", courseId: "lc2",
    courseName: "CPP 3204: Network Programming",
    title: "Assignment 1 reminder",
    body: "This is a reminder that Assignment 1 is due this Friday. Please ensure your submission is uploaded before 11:59 PM.",
    postedAt: "2026-02-08 09:00 AM",
  },
];

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [form, setForm] = useState({ courseId: "", title: "", body: "" });
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!form.courseId || !form.title.trim() || !form.body.trim()) return;
    const course = lecturerCourses.find((c) => c.id === form.courseId);
    const newAnn: Announcement = {
      id: `ann${Date.now()}`,
      courseId: form.courseId,
      courseName: course ? `${course.code}: ${course.name}` : "",
      title: form.title,
      body: form.body,
      postedAt: new Date().toLocaleString("en-GB"),
    };
    setAnnouncements((p) => [newAnn, ...p]);
    setForm({ courseId: "", title: "", body: "" });
    setPosted(true);
    setTimeout(() => setPosted(false), 2000);
  };

  const deleteAnn = (id: string) =>
    setAnnouncements((p) => p.filter((a) => a.id !== id));

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${schoolOfBusiness})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">

        {/* ── ONE CARD ─────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate("/lecturer/dashboard")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </button>
            <h1 className="text-xl font-black text-[#1a2a5e] flex items-center gap-2">
              <Megaphone size={20} className="text-[#c9a227]" /> Announcements
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Post and manage announcements for your students
            </p>
          </div>

          {/* ── Compose section ──────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/40">
            <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide mb-4">
              New Announcement
            </h2>

            {/* Course pills */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Select Course
              </label>
              <div className="flex flex-wrap gap-2">
                {lecturerCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setForm((p) => ({ ...p, courseId: c.id }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                      form.courseId === c.id
                        ? "bg-[#1a2a5e] text-white border-[#1a2a5e]"
                        : "border-gray-200 text-gray-600 hover:border-[#c9a227] hover:text-[#c9a227]"
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Quiz 2 is now open"
                className="text-sm border-gray-200"
              />
            </div>

            {/* Body */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Message
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder="Write your announcement here..."
                rows={4}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handlePost}
                disabled={!form.courseId || !form.title.trim() || !form.body.trim()}
                className={`gap-2 font-bold text-sm px-6 ${
                  posted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#1a2a5e] hover:bg-[#132047]"
                } text-white disabled:opacity-40`}
              >
                {posted ? "✓ Posted!" : <><Send size={14} /> Post Announcement</>}
              </Button>
            </div>
          </div>

          {/* ── Posted announcements ─────────────────── */}
          <div>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide">
                Posted Announcements
              </h2>
              <span className="text-xs text-gray-400 font-semibold">
                {announcements.length} total
              </span>
            </div>

            {announcements.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Megaphone size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No announcements yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="px-6 py-5 hover:bg-gray-50/60 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-[#c9a227]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Megaphone size={16} className="text-[#c9a227]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Course badge */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[#c9a227] uppercase tracking-wide bg-amber-50 border border-[#c9a227]/20 px-2 py-0.5 rounded-full">
                              {ann.courseName}
                            </span>
                          </div>
                          {/* Title */}
                          <p className="text-base font-black text-[#1a2a5e]">{ann.title}</p>
                          {/* Body */}
                          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{ann.body}</p>
                          {/* Timestamp */}
                          <p className="text-[10px] text-gray-300 mt-2 flex items-center gap-1">
                            <Clock size={9} /> {ann.postedAt}
                          </p>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => deleteAnn(ann.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 text-red-400 flex-shrink-0 mt-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Announcements;