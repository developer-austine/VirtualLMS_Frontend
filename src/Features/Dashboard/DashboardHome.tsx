import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getMyEnrolledCourses } from "@/Redux-Toolkit/features/Enrollment/enrollmentThunk";
import { getSubUnitsByCourseStudent } from "@/Redux-Toolkit/features/subUnit/subunitThunk";
import { getAssignmentsBySubUnitStudent } from "@/Redux-Toolkit/features/Assignments/assignmentThunk";
import { getStudentAttendanceSessions } from "@/Redux-Toolkit/features/StudentAttendance/studentAttendanceThunk";
import {
    Video, HelpCircle, FileText, UserCheck, BookOpen,
    ChevronLeft, ChevronRight, Search, Calendar, Clock,
    AlertTriangle, CheckCircle2, ChevronDown, Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import schoolOfBusiness from "../../assets/school-of-business.png";

// ── Types ─────────────────────────────────────────────────────────
type ActivityType = "quiz" | "assignment" | "attendance";

interface TimelineActivity {
    id:       string;
    type:     ActivityType;
    title:    string;
    course:   string;
    courseId: string;
    date:     string;      // "YYYY-MM-DD"
    time?:    string;
    status:   "upcoming" | "overdue" | "done";
    // for navigation
    assignmentId?: number;
    sessionId?:    number;
}

// ── Color maps ────────────────────────────────────────────────────
const typeColor: Record<ActivityType, string> = {
    quiz:       "bg-purple-500",
    assignment: "bg-blue-500",
    attendance: "bg-orange-400",
};

const typeBadge: Record<ActivityType, string> = {
    quiz:       "bg-purple-50 text-purple-600 border-purple-200",
    assignment: "bg-blue-50 text-blue-600 border-blue-200",
    attendance: "bg-orange-50 text-orange-600 border-orange-200",
};

const typeIcon = (type: ActivityType, size = 14) => {
    switch (type) {
        case "quiz":       return <HelpCircle size={size} />;
        case "assignment": return <FileText size={size} />;
        case "attendance": return <UserCheck size={size} />;
    }
};

const formatDate = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
};

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];
const DAYS_OPTIONS = ["Next 7 days","Next 30 days","All upcoming","Overdue"];
const SORT_OPTIONS = ["Sort by dates","Sort by courses"];

// ── Component ─────────────────────────────────────────────────────
const DashboardHome = () => {
    const navigate  = useNavigate();
    const dispatch  = useDispatch<AppDispatch>();

    const { jwt }                  = useSelector((s: RootState) => s.auth);
    const { enrolledCourses }      = useSelector((s: RootState) => s.enrollment);
    const { attempt }              = useSelector((s: RootState) => s.attempt);
    const { sessionsByCourse }     = useSelector((s: RootState) => s.studentAttendance);

    const [daysFilter,   setDaysFilter]   = useState("Next 7 days");
    const [sortBy,       setSortBy]       = useState("Sort by dates");
    const [search,       setSearch]       = useState("");
    const [calYear,      setCalYear]      = useState(() => new Date().getFullYear());
    const [calMonth,     setCalMonth]     = useState(() => new Date().getMonth());
    const [selectedDay,  setSelectedDay]  = useState<string | null>(null);
    const [fetching,     setFetching]     = useState(false);

    // Raw collected activities from real data
    const [activities, setActivities] = useState<TimelineActivity[]>([]);

    const TODAY = new Date().toISOString().split("T")[0];

    // ── Fetch all data on mount ─────────────────────────────────
    const loadAll = useCallback(async () => {
        if (!jwt) return;
        setFetching(true);
        try {
            // 1. Enrolled courses
            const coursesResult = await dispatch(getMyEnrolledCourses(jwt));
            const courses: any[] =
                getMyEnrolledCourses.fulfilled.match(coursesResult)
                    ? (coursesResult.payload as any[])
                    : enrolledCourses;

            if (!courses?.length) { setFetching(false); return; }

            const collected: TimelineActivity[] = [];
            const now = new Date();

            await Promise.all(courses.map(async (course) => {
                const courseId = String(course.id);
                const courseName = `${course.courseCode ?? ""}:${course.courseName ?? course.name ?? ""}`.trim();

                try {
                    // 2. Sub-units for this course
                    const subResult = await dispatch(
                        getSubUnitsByCourseStudent({ courseId: course.id, token: jwt })
                    );
                    const subUnits: any[] =
                        getSubUnitsByCourseStudent.fulfilled.match(subResult)
                            ? (subResult.payload as any[])
                            : [];

                    // 3. Assignments for each sub-unit
                    await Promise.all(subUnits.map(async (sub) => {
                        try {
                            const assignResult = await dispatch(
                                getAssignmentsBySubUnitStudent({ subUnitId: sub.id, token: jwt })
                            );
                            const assignments: any[] =
                                getAssignmentsBySubUnitStudent.fulfilled.match(assignResult)
                                    ? (assignResult.payload as any[])
                                    : [];

                            assignments.forEach((a) => {
                                if (!a.dueDate) return;
                                const dueDate  = new Date(a.dueDate);
                                const dateStr  = dueDate.toISOString().split("T")[0];
                                const timeStr  = dueDate.toTimeString().slice(0, 5);
                                const isQuiz   = (a.questions?.length ?? 0) > 0;
                                const isDone   = attempt?.assignmentId === a.id;
                                const isOverdue = dueDate < now && !isDone;

                                collected.push({
                                    id:           `${isQuiz ? "q" : "a"}-${a.id}`,
                                    type:         isQuiz ? "quiz" : "assignment",
                                    title:        a.title,
                                    course:       courseName,
                                    courseId,
                                    date:         dateStr,
                                    time:         timeStr,
                                    status:       isDone ? "done" : isOverdue ? "overdue" : "upcoming",
                                    assignmentId: a.id,
                                });
                            });
                        } catch (_) {}
                    }));
                } catch (_) {}

                // 4. Attendance sessions for this course
                try {
                    const attResult = await dispatch(
                        getStudentAttendanceSessions({ courseId: course.id, token: jwt })
                    );
                    const sessions: any[] =
                        getStudentAttendanceSessions.fulfilled.match(attResult)
                            ? ((attResult.payload as any).sessions ?? [])
                            : (sessionsByCourse[course.id] ?? []);

                    sessions.forEach((s) => {
                        const sessionDate = new Date(s.date + "T00:00:00");
                        const isDone      = !!s.myRecord;
                        const isOverdue   = sessionDate < now && !isDone;
                        collected.push({
                            id:        `att-${s.id}`,
                            type:      "attendance",
                            title:     s.title,
                            course:    courseName,
                            courseId,
                            date:      s.date,
                            status:    isDone ? "done" : isOverdue ? "overdue" : "upcoming",
                            sessionId: s.id,
                        });
                    });
                } catch (_) {}
            }));

            setActivities(collected);
        } finally {
            setFetching(false);
        }
    }, [jwt, dispatch]);

    useEffect(() => { loadAll(); }, [loadAll]);

    // ── Timeline filtering ──────────────────────────────────────
    const filtered = useMemo(() => {
        const now = new Date(TODAY);
        return activities
            .filter((a) => {
                const d = new Date(a.date);
                const matchSearch = `${a.title} ${a.course}`
                    .toLowerCase().includes(search.toLowerCase());
                if (!matchSearch) return false;
                if (daysFilter === "Next 7 days") {
                    const diff = (d.getTime() - now.getTime()) / 86400000;
                    return diff >= 0 && diff <= 7;
                }
                if (daysFilter === "Next 30 days") {
                    const diff = (d.getTime() - now.getTime()) / 86400000;
                    return diff >= 0 && diff <= 30;
                }
                if (daysFilter === "Overdue")     return a.status === "overdue";
                if (daysFilter === "All upcoming") return a.status === "upcoming";
                return true;
            })
            .sort((a, b) =>
                sortBy === "Sort by dates"
                    ? a.date.localeCompare(b.date)
                    : a.course.localeCompare(b.course)
            );
    }, [activities, daysFilter, sortBy, search, TODAY]);

    const grouped = useMemo(() => {
        const map: Record<string, typeof filtered> = {};
        filtered.forEach((a) => {
            if (!map[a.date]) map[a.date] = [];
            map[a.date].push(a);
        });
        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    }, [filtered]);

    // ── Calendar helpers ────────────────────────────────────────
    const daysInMonth   = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const startOffset   = (firstDayOfWeek + 6) % 7;

    const activitiesByDay = useMemo(() => {
        const map: Record<number, typeof activities> = {};
        activities.forEach((a) => {
            const [y, m] = a.date.split("-").map(Number);
            if (y === calYear && m - 1 === calMonth) {
                const day = parseInt(a.date.split("-")[2]);
                if (!map[day]) map[day] = [];
                map[day].push(a);
            }
        });
        return map;
    }, [activities, calYear, calMonth]);

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
        else setCalMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
        else setCalMonth(m => m + 1);
    };

    const selectedActivities = selectedDay
        ? (activitiesByDay[parseInt(selectedDay)] ?? [])
        : [];

    // ── Navigate on activity click ──────────────────────────────
    const handleActivityClick = (a: TimelineActivity) => {
        if (a.type === "attendance") {
            navigate(`/course/${a.courseId}/attendance`);
        } else {
            navigate(`/assignment/${a.assignmentId}`);
        }
    };

    // ── Course filter options ───────────────────────────────────
    const [courseFilter, setCourseFilter] = useState("All courses");
    const courseOptions = useMemo(() => {
        const names = [...new Set(activities.map(a => a.course))];
        return ["All courses", ...names];
    }, [activities]);

    const calActivitiesFiltered = useMemo(() =>
        courseFilter === "All courses"
            ? activities
            : activities.filter(a => a.course === courseFilter),
    [activities, courseFilter]);

    const calByDayFiltered = useMemo(() => {
        const map: Record<number, typeof calActivitiesFiltered> = {};
        calActivitiesFiltered.forEach((a) => {
            const [y, m] = a.date.split("-").map(Number);
            if (y === calYear && m - 1 === calMonth) {
                const day = parseInt(a.date.split("-")[2]);
                if (!map[day]) map[day] = [];
                map[day].push(a);
            }
        });
        return map;
    }, [calActivitiesFiltered, calYear, calMonth]);

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
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* ── TIMELINE ─────────────────────────────── */}
                    <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-[#1a2a5e]">Timeline</h2>
                            {fetching && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Loader2 size={12} className="animate-spin" /> Loading...
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
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

                            <div className="relative flex-1 min-w-[180px]">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search by activity or course"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-8 h-8 text-xs border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Timeline list */}
                    <div className="px-6 py-4 space-y-5 max-h-[460px] overflow-y-auto">
                        {fetching && activities.length === 0 && (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 size={24} className="animate-spin text-[#c9a227]" />
                                    <p className="text-sm text-gray-400">Loading your activities...</p>
                                </div>
                            </div>
                        )}
                        {!fetching && grouped.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">
                                No activities found.
                            </p>
                        )}
                        {grouped.map(([date, acts]) => (
                            <div key={date}>
                                <p className="text-xs font-black text-[#1a2a5e] uppercase tracking-wide mb-2">
                                    {formatDate(date)}
                                </p>
                                <div className="space-y-2">
                                    {acts.map((a) => (
                                        <div
                                            key={a.id}
                                            onClick={() => handleActivityClick(a)}
                                            className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#c9a227]/40 hover:bg-amber-50/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-1 text-xs text-gray-400 min-w-[42px] mt-0.5">
                                                <Clock size={11} />
                                                {a.time ?? "—"}
                                            </div>

                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${typeColor[a.type]}`}>
                                                {typeIcon(a.type, 13)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold group-hover:underline ${
                                                    a.status === "overdue" ? "text-red-600" : "text-[#c9a227]"
                                                }`}>
                                                    {a.title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                                    {a.course}
                                                </p>
                                            </div>

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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-8 text-xs border-gray-300 gap-1 min-w-[130px]">
                                        {courseFilter.length > 20
                                            ? courseFilter.slice(0, 20) + "…"
                                            : courseFilter
                                        } <ChevronDown size={12} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-w-xs">
                                    {courseOptions.map(o => (
                                        <DropdownMenuItem key={o} onClick={() => setCourseFilter(o)}>
                                            {o}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-4">
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

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`e-${i}`} className="bg-white min-h-[72px] p-1" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day    = i + 1;
                                const dayStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                                const isToday    = dayStr === TODAY;
                                const isSelected = selectedDay === String(day);
                                const dayActs    = calByDayFiltered[day] ?? [];
                                const shown      = dayActs.slice(0, 3);
                                const extra      = dayActs.length - 3;

                                return (
                                    <div
                                        key={day}
                                        onClick={() => setSelectedDay(isSelected ? null : String(day))}
                                        className={`bg-white min-h-[72px] p-1 cursor-pointer transition-colors hover:bg-amber-50/40 ${
                                            isSelected ? "ring-2 ring-[#c9a227] ring-inset" : ""
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                                            isToday ? "bg-[#c9a227] text-white" : "text-[#1a2a5e]"
                                        }`}>
                                            {day}
                                        </div>
                                        <div className="space-y-0.5">
                                            {shown.map(a => (
                                                <div key={a.id} className="flex items-center gap-1 text-[9px] font-semibold leading-tight truncate">
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
                                                onClick={() => handleActivityClick(a)}
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