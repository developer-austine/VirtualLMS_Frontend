import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Video, FileText, Users, ChevronRight, Clock,
  ChevronLeft, ChevronDown, Calendar, BookOpen,
  Loader2, LogOut, GraduationCap,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getLecturerCourses } from "@/Redux-Toolkit/features/Course/courseThunk";
import { logout } from "@/Redux-Toolkit/features/Auth/authSlice";
import { useBanner } from "@/hooks/useBanner";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type EventType = "class" | "assignment" | "quiz" | "grade";

interface CalendarEvent {
  date:     string;
  title:    string;
  type:     EventType;
  courseId: number;
}

const eventColor: Record<EventType, string> = {
  class:      "bg-red-500",
  assignment: "bg-blue-500",
  quiz:       "bg-purple-500",
  grade:      "bg-green-500",
};

const LecturerDashboard = () => {
  const bgImage  = useBanner();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { myCourses: rawCourses, loading } = useSelector((state: RootState) => state.course);
  const myCourses = Array.isArray(rawCourses) ? rawCourses : [];

  const { user, jwt }          = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  const today       = new Date();
  const [calYear,   setCalYear]     = useState(today.getFullYear());
  const [calMonth,  setCalMonth]    = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState("All courses");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    dispatch(getLecturerCourses(token));
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ── Calendar ──────────────────────────────────────────────────────────────
  const daysInMonth    = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const startOffset    = (firstDayOfWeek + 6) % 7;
  const todayStr       = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // Build calendar events from real courses (use totalEnrolledStudents, course names etc.)
  const calendarEvents = useMemo((): CalendarEvent[] => {
    // No real schedule data from backend yet — return empty typed array
    return [];
  }, [myCourses]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    calendarEvents.forEach((e) => {
      const [y, m] = e.date.split("-").map(Number);
      if (y === calYear && m - 1 === calMonth) {
        const day = parseInt(e.date.split("-")[2]);
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    });
    return map;
  }, [calendarEvents, calYear, calMonth]);

  const selectedActivities = selectedDay ? (eventsByDay[parseInt(selectedDay)] ?? []) : [];

  // ── Stat cards ────────────────────────────────────────────────────────────
  const totalStudents = myCourses.reduce(
    (sum, c) => sum + (c.totalEnrolledStudents ?? 0), 0
  );

  const stats = [
    { label: "My Courses",      value: myCourses.length, icon: BookOpen,      color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100"  },
    { label: "Total Students",  value: totalStudents,    icon: GraduationCap, color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100"    },
  ];

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-black text-[#1a2a5e]">
                Welcome back, {user?.fullName?.split(" ")[0] ?? "Lecturer"} 👋
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {user?.email} · Lecturer Portal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/lecturer/courses")}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white transition-colors"
              >
                My Courses
              </button>
              <button
                onClick={() => navigate("/lecturer/schedule")}
                className="text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 text-[#1a2a5e] hover:bg-[#1a2a5e] hover:text-white transition-colors"
              >
                Schedule Class
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>

          {!loading && (
            <div className="grid grid-cols-2 gap-px bg-gray-100 border-b border-gray-100">
              {stats.map((s) => (
                <div key={s.label} className={`${s.bg} px-6 py-5 flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-full ${s.bg} border ${s.border} flex items-center justify-center`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-[#1a2a5e]">{s.value}</p>
                    <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-gray-100">

            {/* Course list — 2/3 */}
            <div className="lg:col-span-2 px-6 pt-6 pb-5 border-r border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide flex items-center gap-2">
                  <BookOpen size={14} className="text-[#c9a227]" /> My Courses
                </h2>
                <button
                  onClick={() => navigate("/lecturer/courses")}
                  className="text-xs text-[#c9a227] font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-6">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs font-semibold">Loading courses...</span>
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">No courses assigned yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {myCourses.slice(0, 4).map((course) => (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/lecturer/course/${course.id}`)}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#c9a227]/40 hover:bg-amber-50/30 cursor-pointer group transition-all"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#1a2a5e] flex items-center justify-center flex-shrink-0">
                        <Video size={18} className="text-[#c9a227]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1a2a5e] group-hover:text-[#c9a227] transition-colors truncate">
                          {course.courseCode && <span className="text-gray-400 mr-1">{course.courseCode}:</span>}
                          {course.courseName}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Users size={10} /> {course.totalEnrolledStudents ?? 0} students
                          {course.semester && <><span className="mx-1">·</span><Clock size={10} /> {course.semester}</>}
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-gray-300 group-hover:text-[#c9a227] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions — 1/3 */}
            <div className="px-6 py-6">
              <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide mb-5 flex items-center gap-2">
                <FileText size={14} className="text-[#c9a227]" /> Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { label: "My Courses",      path: "/lecturer/courses",       icon: BookOpen,      color: "bg-indigo-50 text-indigo-700 border-indigo-100"  },
                  { label: "Schedule Class",  path: "/lecturer/schedule",      icon: Video,         color: "bg-red-50 text-red-600 border-red-100"           },
                  { label: "Announcements",   path: "/lecturer/announcements", icon: FileText,      color: "bg-amber-50 text-[#c9a227] border-amber-100"     },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:shadow-sm ${a.color}`}
                  >
                    <a.icon size={14} />
                    {a.label}
                    <ChevronRight size={12} className="ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Calendar ──────────────────────────────────────────────── */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide flex items-center gap-2">
                <Calendar size={14} className="text-[#c9a227]" /> Calendar
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
                  {myCourses.map((c) => (
                    <DropdownMenuItem key={c.id} onClick={() => setCourseFilter(c.courseCode ?? c.courseName)}>
                      {c.courseCode ?? c.courseName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={16} className="text-[#1a2a5e]" />
              </button>
              <h3 className="font-black text-[#1a2a5e] text-sm tracking-wide">
                {MONTHS[calMonth]} {calYear}
              </h3>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronRight size={16} className="text-[#1a2a5e]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`e-${i}`} className="bg-white min-h-[60px] p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day    = i + 1;
                const dayStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const isToday    = dayStr === todayStr;
                const isSelected = selectedDay === String(day);
                const dayEvents  = eventsByDay[day] ?? [];

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : String(day))}
                    className={`bg-white min-h-[60px] p-1 cursor-pointer hover:bg-amber-50/40 transition-colors ${
                      isSelected ? "ring-2 ring-[#c9a227] ring-inset" : ""
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                      isToday ? "bg-[#c9a227] text-white" : "text-[#1a2a5e]"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((e, idx: number) => (
                        <div key={idx} className="flex items-center gap-1 text-[9px] font-semibold truncate">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${eventColor[e.type]}`} />
                          <span className="truncate text-gray-600">{e.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected day popout */}
            {selectedDay && (
              <div className="mt-4 border border-[#c9a227]/30 rounded-lg p-4 bg-amber-50/30">
                <p className="text-xs font-black text-[#1a2a5e] mb-2">
                  {MONTHS[calMonth]} {selectedDay}, {calYear}
                </p>
                {selectedActivities.length === 0 ? (
                  <p className="text-xs text-gray-400">No events scheduled on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedActivities.map((e, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                        <span className={`w-2.5 h-2.5 rounded-full ${eventColor[e.type]}`} />
                        <p className="text-xs font-semibold text-[#1a2a5e]">{e.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            {(Object.entries(eventColor) as [EventType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold capitalize">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {type}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;