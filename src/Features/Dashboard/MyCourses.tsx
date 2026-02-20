import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutGrid, List, MoreVertical, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { courses } from "./data/courses";
import schoolOfBusiness from "../../assets/school-of-business.png";

const MyCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"card" | "list">("card");
  const [filter, setFilter] = useState("All");

  const filtered = courses.filter((c) => {
    const matchesSearch = `${c.code} ${c.name} ${c.lecturer}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && c.progress === 100) ||
      (filter === "In progress" && c.progress > 0 && c.progress < 100);
    return matchesSearch && matchesFilter;
  });

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
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">

          <h1 className="text-2xl font-black text-[#1a2a5e] mb-0.5">My courses</h1>
          <p className="text-sm text-gray-500 mb-5">Course overview</p>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 text-sm border-gray-300 px-3 gap-1 font-medium">
                  {filter} ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["All", "In progress", "Completed"].map((f) => (
                  <DropdownMenuItem key={f} onClick={() => setFilter(f)}>{f}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm border-gray-300"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 text-sm border-gray-300 px-3 gap-1 font-medium">
                  Sort by course name ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Course name</DropdownMenuItem>
                <DropdownMenuItem>Last accessed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden ml-auto">
              <button
                onClick={() => setView("card")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  view === "card" ? "bg-[#1a2a5e] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid size={13} /> Card
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  view === "list" ? "bg-[#1a2a5e] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <List size={13} /> List
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className={
            view === "card"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-3"
          }>
            {filtered.map((course) =>
              view === "card" ? (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div
                    className={`${course.color} relative overflow-hidden`}
                    style={{ height: "160px" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute border-2 border-white rotate-45"
                          style={{ width: `${60 + i * 25}px`, height: `${60 + i * 25}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <p className="text-xs font-bold text-[#1a2a5e] leading-snug mb-1 group-hover:text-[#c9a227] transition-colors line-clamp-2">
                      {course.code}:{course.name}:{course.lecturer}
                      {course.stream ? `:${course.stream}` : ""}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">{course.trim}</p>
                    <div className="flex items-center justify-between">
                      {course.progress === 100 ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                          <CheckCircle size={12} /> 100% complete
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                      {/* Stop propagation so 3-dot menu doesn't trigger card click */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-[#1a2a5e] p-1 rounded transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View course</DropdownMenuItem>
                            <DropdownMenuItem>Mark as complete</DropdownMenuItem>
                            <DropdownMenuItem>Remove from view</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={course.id}
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="flex items-center gap-4 border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className={`${course.color} w-14 h-14 rounded-md flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1a2a5e] group-hover:text-[#c9a227] truncate">
                      {course.code}: {course.name}
                    </p>
                    <p className="text-xs text-gray-400">{course.lecturer} · {course.trim}</p>
                  </div>
                  {course.progress === 100 && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold whitespace-nowrap">
                      <CheckCircle size={12} /> 100% complete
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No courses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;