import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video, FileText, Users, ChevronRight, Clock,
  ChevronLeft, ChevronDown, Calendar,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { lecturerCourses } from "./data/lecturerCourses";
import schoolOfBusiness from "../../assets/school-of-business.png";

// ── Types ────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TODAY = "2026-02-23";

type EventType = "class" | "assignment" | "quiz" | "grade";
const eventColor: Record<EventType, string> = {
  class:      "bg-red-500",
  assignment: "bg-blue-500",
  quiz:       "bg-purple-500",
  grade:      "bg-green-500",
};

// ── Mock data ────────────────────────────────────
const calendarEvents: { date: string; title: string; type: EventType; courseId: string }[] = [
  { date: "2026-02-24", title: "Advanced Java — Online Class",  type: "class",      courseId: "lc1" },
  { date: "2026-02-25", title: "Network Programming — Class",   type: "class",      courseId: "lc2" },
  { date: "2026-02-26", title: "Software Engineering — Class",  type: "class",      courseId: "lc3" },
  { date: "2026-02-20", title: "Assignment 1 deadline",         type: "assignment", courseId: "lc1" },
  { date: "2026-02-12", title: "Quiz 1 opened",                 type: "quiz",       courseId: "lc1" },
  { date: "2026-02-10", title: "Quiz 1 opened",                 type: "quiz",       courseId: "lc2" },
  { date: "2026-02-23", title: "Grade submissions due",         type: "grade",      courseId: "lc1" },
  { date: "2026-02-27", title: "Assignment 2 deadline",         type: "assignment", courseId: "lc2" },
  { date: "2026-02-28", title: "Advanced Java — Online Class",  type: "class",      courseId: "lc1" },
];

const upcomingClasses = [
  { id: "lc1", course: "CPP 3202: Advanced Java Programming", time: "Thu 26 Feb, 3:00 PM",  platform: "Zoom" },
  { id: "lc2", course: "CPP 3204: Network Programming",       time: "Tue 24 Feb, 10:00 AM", platform: "Teams" },
  { id: "lc3", course: "CPP 4101: Software Engineering",      time: "Wed 25 Feb, 2:00 PM",  platform: "Google Meet" },
];

const recentActivity = [
  { label: "Quiz 1 submitted by 32 students", course: "Advanced Java",       time: "2 hours ago", icon: FileText },
  { label: "Assignment 1 due soon",           course: "Network Programming",  time: "Tomorrow",    icon: FileText },
  { label: "15 students attended",            course: "Software Engineering", time: "Yesterday",   icon: Users },
  { label: "New class scheduled",             course: "Advanced Java",        time: "3 days ago",  icon: Video },
];

// ── Component ────────────────────────────────────
const LecturerDashboard = () => {
  const navigate = useNavigate();
  const [calYear, setCalYear]       = useState(2026);
  const [calMonth, setCalMonth]     = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState("All courses");

  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const startOffset  = (firstDayOfWeek + 6) % 7;

  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof calendarEvents> = {};
    calendarEvents.forEach((e) => {
      const [y, m] = e.date.split("-").map(Number);
      if (y === calYear && m - 1 === calMonth) {
        const day = parseInt(e.date.split("-")[2]);
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    });
    return map;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const selectedActivities = selectedDay ? (eventsByDay[parseInt(selectedDay)] ?? []) : [];

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* ── ONE WIDE CARD ─────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Upcoming Classes + Recent Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-gray-100">

            {/* Upcoming Classes — vertical, 2/3 width */}
            <div className="lg:col-span-2 px-6 pt-6 pb-5 border-r border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-[#1a2a5e]">Upcoming Classes</h2>
                <button
                  onClick={() => navigate("/lecturer/schedule")}
                  className="text-sm text-[#c9a227] font-semibold hover:underline"
                >
                  + Schedule class
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => navigate(`/lecturer/course/${cls.id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#c9a227]/40 hover:bg-amber-50/30 cursor-pointer group transition-all"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1a2a5e] flex items-center justify-center flex-shrink-0">
                      <Video size={18} className="text-[#c9a227]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1a2a5e] group-hover:text-[#c9a227] transition-colors">
                        {cls.course}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={11} /> {cls.time} · {cls.platform}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#c9a227] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity — 1/3 width */}
            <div className="px-6 py-6">
              <h2 className="text-lg font-black text-[#1a2a5e] mb-5">Recent Activity</h2>
              <div className="space-y-5">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <a.icon size={15} className="text-[#1a2a5e]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a2a5e]">{a.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.course}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Calendar ──────────────────────────── */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <h2 className="text-lg font-black text-[#1a2a5e] flex items-center gap-2">
                <Calendar size={18} className="text-[#c9a227]" /> Calendar
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs border-gray-300 gap-1 min-w-[130px]">
                    {courseFilter} <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCourseFilter("All courses")}>
                    All courses
                  </DropdownMenuItem>
                  {lecturerCourses.map((c) => (
                    <DropdownMenuItem key={c.id} onClick={() => setCourseFilter(c.code)}>
                      {c.code}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft size={16} className="text-[#1a2a5e]" />
              </button>
              <h3 className="font-black text-[#1a2a5e] text-sm tracking-wide">
                {MONTHS[calMonth]} {calYear}
              </h3>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight size={16} className="text-[#1a2a5e]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white min-h-[70px] p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday    = dayStr === TODAY;
                const isSelected = selectedDay === String(day);
                const dayEvents  = eventsByDay[day] ?? [];
                const shown      = dayEvents.slice(0, 2);
                const extra      = dayEvents.length - 2;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : String(day))}
                    className={`bg-white min-h-[70px] p-1 cursor-pointer hover:bg-amber-50/40 transition-colors ${
                      isSelected ? "ring-2 ring-[#c9a227] ring-inset" : ""
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                      isToday ? "bg-[#c9a227] text-white" : "text-[#1a2a5e]"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {shown.map((e, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-[9px] font-semibold truncate">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${eventColor[e.type]}`} />
                          <span className="truncate text-gray-600">{e.title}</span>
                        </div>
                      ))}
                      {extra > 0 && (
                        <p className="text-[9px] font-bold text-[#c9a227]">{extra} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected day popout */}
            {selectedDay && (
              <div className="mt-4 border border-[#c9a227]/30 rounded-lg p-4 bg-amber-50/30">
                <p className="text-xs font-black text-[#1a2a5e] mb-3">
                  {MONTHS[calMonth]} {selectedDay}, {calYear}
                </p>
                {selectedActivities.length === 0 ? (
                  <p className="text-xs text-gray-400">No events on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedActivities.map((e, i) => (
                      <div
                        key={i}
                        onClick={() => navigate(`/lecturer/course/${e.courseId}`)}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-[#c9a227]/40 cursor-pointer"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${eventColor[e.type]}`} />
                        <p className="text-xs font-semibold text-[#1a2a5e] flex-1">{e.title}</p>
                        <span className="text-[10px] text-gray-400 capitalize">{e.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Legend + footer links */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              {(Object.entries(eventColor) as [EventType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold capitalize">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {type}
                </div>
              ))}
              <div className="ml-auto flex gap-4">
                <a href="#" className="text-xs text-[#c9a227] font-semibold hover:underline">Full calendar</a>
                <a href="#" className="text-xs text-[#c9a227] font-semibold hover:underline">Export</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;