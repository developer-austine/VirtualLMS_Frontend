import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, CheckCircle2, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

const platforms = ["Zoom", "Google Meet", "Microsoft Teams"];

const ScheduleClass = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    courseId: "",
    platform: "Zoom",
    link: "",
    date: "",
    time: "",
    duration: "60",
    topic: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.courseId || !form.link || !form.date || !form.time || !form.topic) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); navigate("/lecturer/courses"); }, 2000);
  };

  const course = lecturerCourses.find((c) => c.id === form.courseId);

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
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

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
            {/* Course */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Course</label>
              <div className="grid grid-cols-1 gap-2">
                {lecturerCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setForm((p) => ({ ...p, courseId: c.id }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                      form.courseId === c.id
                        ? "border-[#c9a227] bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${c.color} flex-shrink-0`} />
                    <div>
                      <p className="text-xs font-bold text-[#1a2a5e]">{c.code}: {c.name}</p>
                      <p className="text-[11px] text-gray-400">{c.enrolledStudents} students</p>
                    </div>
                    {form.courseId === c.id && <CheckCircle2 size={16} className="text-[#c9a227] ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Platform</label>
              <div className="flex gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm((prev) => ({ ...prev, platform: p }))}
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

            {/* Meeting link */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Meeting Link</label>
              <div className="relative">
                <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={form.link}
                  onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder={`Paste your ${form.platform} link here`}
                  className="pl-9 text-sm border-gray-200"
                />
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Class Topic</label>
              <Input
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. Lecture 4: Inheritance and Polymorphism"
                className="text-sm border-gray-200"
              />
            </div>

            {/* Date + Time + Duration */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="text-sm border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Time</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                  className="text-sm border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Duration (min)</label>
                <Input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  className="text-sm border-gray-200"
                  min={15}
                  step={15}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className={`w-full font-bold text-sm gap-2 ${
                submitted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1a2a5e] hover:bg-[#132047]"
              } text-white`}
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