import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video, HelpCircle, FileText, UserCheck, BookOpen,
  ChevronLeft, ChevronRight, Search, Calendar, Clock,
  AlertTriangle, CheckCircle2, ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timelineActivities, type ActivityType } from "./data/timelineData";
import schoolOfBusiness from "../../assets/school-of-business.png";

// ── helpers ─────────────────────────────────────────────────
const TODAY = "2026-02-23";

const typeColor: Record<ActivityType, string> = {
  class:      "bg-red-500",
  quiz:       "bg-purple-500",
  assignment: "bg-blue-500",
  attendance: "bg-orange-400",
  cat:        "bg-green-600",
};

const typeBadge: Record<ActivityType, string> = {
  class:      "bg-red-50 text-red-600 border-red-200",
  quiz:       "bg-purple-50 text-purple-600 border-purple-200",
  assignment: "bg-blue-50 text-blue-600 border-blue-200",
  attendance: "bg-orange-50 text-orange-600 border-orange-200",
  cat:        "bg-green-50 text-green-700 border-green-200",
};

const typeIcon = (type: ActivityType, size = 14) => {
  switch (type) {
    case "class":      return <Video size={size} />;
    case "quiz":       return <HelpCircle size={size} />;
    case "assignment": return <FileText size={size} />;
    case "attendance": return <UserCheck size={size} />;
    case "cat":        return <BookOpen size={size} />;
  }
};

const formatDate = (d: string) => {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const DAYS_OPTIONS = ["Next 7 days", "Next 30 days", "All upcoming", "Overdue"];
const SORT_OPTIONS = ["Sort by dates", "Sort by courses"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── component ───────────────────────────────────────────────
const DashboardHome = () => {
  const navigate = useNavigate();
  const [daysFilter, setDaysFilter] = useState("Next 7 days");
  const [sortBy, setSortBy]         = useState("Sort by dates");
  const [search, setSearch]         = useState("");
  const [calYear, setCalYear]       = useState(2026);
  const [calMonth, setCalMonth]     = useState(1); // 0-indexed, 1 = February
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // ── Timeline filtering ─────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date(TODAY);
    return timelineActivities
      .filter((a) => {
        const d = new Date(a.date);
        const matchSearch = `${a.title} ${a.course}`.toLowerCase().includes(search.toLowerCase());
        if (!matchSearch) return false;

        if (daysFilter === "Next 7 days") {
          const diff = (d.getTime() - now.getTime()) / 86400000;
          return diff >= 0 && diff <= 7;
        }
        if (daysFilter === "Next 30 days") {
          const diff = (d.getTime() - now.getTime()) / 86400000;
          return diff >= 0 && diff <= 30;
        }
        if (daysFilter === "Overdue") return a.status === "overdue";
        if (daysFilter === "All upcoming") return a.status === "upcoming";
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Sort by dates") return a.date.localeCompare(b.date);
        return a.course.localeCompare(b.course);
      });
  }, [daysFilter, sortBy, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  // ── Calendar helpers ───────────────────────────────────
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  // Shift so Mon=0
  const startOffset = (firstDayOfWeek + 6) % 7;

  const activitiesByDay = useMemo(() => {
    const map: Record<string, typeof timelineActivities> = {};
    timelineActivities.forEach((a) => {
      const [y, m] = a.date.split("-").map(Number);
      if (y === calYear && m - 1 === calMonth) {
        const day = parseInt(a.date.split("-")[2]);
        if (!map[day]) map[day] = [];
        map[day].push(a);
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

  const selectedDateStr = selectedDay
    ? `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;
  const selectedActivities = selectedDateStr ? (activitiesByDay[parseInt(selectedDay!)] ?? []) : [];

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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-5">

        {/* ── SINGLE CARD — Timeline + Calendar ─────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* ── TIMELINE ─────────────────────────────── */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-[#1a2a5e] mb-4">Timeline</h2>
            <div className="flex flex-wrap items-center gap-2">
              {/* Days filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs border-gray-300 gap-1">
                    {daysFilter} <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {DAYS_OPTIONS.map(o => (
                    <DropdownMenuItem key={o} onClick={() => setDaysFilter(o)}>{o}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs border-gray-300 gap-1">
                    {sortBy} <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {SORT_OPTIONS.map(o => (
                    <DropdownMenuItem key={o} onClick={() => setSortBy(o)}>{o}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by activity type or name"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Timeline list */}
          <div className="px-6 py-4 space-y-5 max-h-[460px] overflow-y-auto">
            {grouped.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No activities found.</p>
            )}
            {grouped.map(([date, activities]) => (
              <div key={date}>
                {/* Date heading */}
                <p className="text-xs font-black text-[#1a2a5e] uppercase tracking-wide mb-2">
                  {formatDate(date)}
                </p>
                <div className="space-y-2">
                  {activities.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => navigate(`/course/${a.courseId}`)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#c9a227]/40 hover:bg-amber-50/30 transition-all cursor-pointer group"
                    >
                      {/* Time */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 min-w-[42px] mt-0.5">
                        <Clock size={11} />
                        {a.time ?? "—"}
                      </div>

                      {/* Icon circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${typeColor[a.type]}`}>
                        {typeIcon(a.type, 13)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold group-hover:underline ${
                          a.status === "overdue" ? "text-red-600" : "text-[#c9a227]"
                        }`}>
                          {a.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {a.platform && `${a.platform} meeting requires action · `}{a.course}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div className="flex-shrink-0">
                        {a.status === "overdue" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                            <AlertTriangle size={9} /> Overdue
                          </span>
                        )}
                        {a.status === "done" && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 size={9} /> Done
                          </span>
                        )}
                        {a.status === "upcoming" && (
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${typeBadge[a.type]}`}>
                            {typeIcon(a.type, 9)} {a.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* ── CALENDAR ─────────────────────────────── */}
          <div className="px-6 pt-2 pb-5 border-t border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-3 py-4 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-black text-[#1a2a5e] flex items-center gap-2">
                <Calendar size={18} className="text-[#c9a227]" /> Calendar
              </h2>

              {/* Course filter placeholder */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 text-xs border-gray-300 gap-1 min-w-[130px]">
                    All courses <ChevronDown size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All courses</DropdownMenuItem>
                  <DropdownMenuItem>Mobile Gaming Programming</DropdownMenuItem>
                  <DropdownMenuItem>Advanced Java</DropdownMenuItem>
                  <DropdownMenuItem>Network Programming</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="px-6 py-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
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
              {/* Empty offset cells */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white min-h-[72px] p-1" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dayStr === TODAY;
                const isSelected = selectedDay === String(day);
                const dayActivities = activitiesByDay[day] ?? [];
                const shown = dayActivities.slice(0, 3);
                const extra = dayActivities.length - 3;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : String(day))}
                    className={`bg-white min-h-[72px] p-1 cursor-pointer transition-colors hover:bg-amber-50/40 ${
                      isSelected ? "ring-2 ring-[#c9a227] ring-inset" : ""
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                      isToday
                        ? "bg-[#c9a227] text-white"
                        : "text-[#1a2a5e]"
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {shown.map(a => (
                        <div
                          key={a.id}
                          className="flex items-center gap-1 text-[9px] font-semibold leading-tight truncate"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeColor[a.type]}`} />
                          <span className="truncate text-gray-600">{a.title}</span>
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
                  {formatDate(`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`)}
                </p>
                {selectedActivities.length === 0 ? (
                  <p className="text-xs text-gray-400">No activities on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedActivities.map(a => (
                      <div
                        key={a.id}
                        onClick={() => navigate(`/course/${a.courseId}`)}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100 hover:border-[#c9a227]/40 cursor-pointer group"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0 ${typeColor[a.type]}`}>
                          {typeIcon(a.type, 12)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#c9a227] group-hover:underline truncate">{a.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{a.course}</p>
                        </div>
                        {a.time && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                            <Clock size={9} />{a.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
              {(Object.entries(typeColor) as [ActivityType, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold capitalize">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {type}
                </div>
              ))}
            </div>
          {/* Footer links */}
          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
            <a href="#" className="text-xs text-[#c9a227] font-semibold hover:underline">Full calendar</a>
            <a href="#" className="text-xs text-[#c9a227] font-semibold hover:underline">Import or export calendars</a>
          </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;