import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getSubUnitsByCourseStudent } from "@/Redux-Toolkit/features/subUnit/subunitThunk";
import { getNotesBySubUnitStudent } from "@/Redux-Toolkit/features/Notes/noteThunk";
import { getAssignmentsBySubUnitStudent } from "@/Redux-Toolkit/features/Assignments/assignmentThunk";
import { clearSubUnitState } from "@/Redux-Toolkit/features/subUnit/subunitSlice";
import {
  ChevronDown, ChevronUp, Megaphone, Link2, Video,
  FileText, HelpCircle, ArrowLeft, CheckCircle2,
  NotebookPen, ClipboardList, AlertTriangle, Upload, Loader2,
} from "lucide-react";

import schoolOfBusiness from "../../assets/school-of-business.png";

const tabs = ["Course", "Participants", "Grades", "Activities", "Competencies"];

const activityIcon = (type: string) => {
  switch (type) {
    case "announcement": return <Megaphone  size={16} className="text-[#c9a227]"  />;
    case "link":         return <Link2      size={16} className="text-blue-500"   />;
    case "video":        return <Video      size={16} className="text-red-500"    />;
    case "file":         return <FileText   size={16} className="text-orange-400" />;
    case "quiz":         return <HelpCircle size={16} className="text-purple-500" />;
    case "assignment":   return <Upload     size={16} className="text-pink-500"   />;
    case "notes":        return <NotebookPen size={16} className="text-indigo-500"/>;
    default:             return <FileText   size={16} className="text-gray-400"   />;
  }
};

// ── Types ──────────────────────────────────────────────────────────
interface NoteDto {
  id: number;
  title: string;
  content: string;
  subUnitId: number;
}

interface AssignmentDto {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subUnitId: number;
}

// Per-subunit fetched content stored in local state
interface SubUnitContent {
  notes: NoteDto[];
  assignments: AssignmentDto[];
  loading: boolean;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { jwt } = useSelector((state: RootState) => state.auth);
  const { subUnits, loading: subUnitsLoading } = useSelector((state: RootState) => state.subUnit);
  const { enrolledCourses } = useSelector((state: RootState) => state.enrollment);

  const [activeTab, setActiveTab] = useState("Course");
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  // Local cache: subUnitId → { notes, assignments, loading }
  const [subUnitContent, setSubUnitContent] = useState<Record<number, SubUnitContent>>({});

  const courseId = Number(id);
  const course = enrolledCourses.find((c) => c.id === courseId);

  // Fetch sub-units on mount
  useEffect(() => {
    if (jwt && courseId) {
      dispatch(clearSubUnitState());
      dispatch(getSubUnitsByCourseStudent({ courseId, token: jwt }));
    }
  }, [jwt, courseId, dispatch]);

  // Fetch notes + assignments for a subunit when it is expanded
  const fetchSubUnitContent = async (subUnitId: number) => {
    if (!jwt || subUnitContent[subUnitId]) return; // already fetched

    setSubUnitContent((prev) => ({
      ...prev,
      [subUnitId]: { notes: [], assignments: [], loading: true },
    }));

    try {
      const [notesResult, assignmentsResult] = await Promise.all([
        dispatch(getNotesBySubUnitStudent({ subUnitId, token: jwt })).unwrap(),
        dispatch(getAssignmentsBySubUnitStudent({ subUnitId, token: jwt })).unwrap(),
      ]);

      setSubUnitContent((prev) => ({
        ...prev,
        [subUnitId]: {
          notes: notesResult ?? [],
          assignments: assignmentsResult ?? [],
          loading: false,
        },
      }));
    } catch {
      setSubUnitContent((prev) => ({
        ...prev,
        [subUnitId]: { notes: [], assignments: [], loading: false },
      }));
    }
  };

  const toggleSection = (subUnitId: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(subUnitId)) {
        next.delete(subUnitId);
        // Lazy-fetch content when expanding
        fetchSubUnitContent(subUnitId);
      } else {
        next.add(subUnitId);
      }
      return next;
    });
  };

  const toggleNote = (noteId: number) =>
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      next.has(noteId) ? next.delete(noteId) : next.add(noteId);
      return next;
    });

  const collapseAll = () =>
    setCollapsedSections(new Set(subUnits.map((s) => s.id)));

  const expandAll = () => {
    setCollapsedSections(new Set());
    // Fetch content for all subunits that haven't been fetched yet
    subUnits.forEach((s) => fetchSubUnitContent(s.id));
  };

  const allCollapsed = collapsedSections.size === subUnits.length;

  const handleActivityClick = (type: string, activityId: number) => {
    switch (type) {
      case "quiz":
        navigate(`/course/${id}/quiz/${activityId}`);
        break;
      case "assignment":
        navigate(`/assignment/${activityId}`);
        break;
      case "video":
        navigate(`/course/${id}/class/${activityId}`);
        break;
      case "link":
        window.open("https://chat.whatsapp.com", "_blank");
        break;
      default:
        break;
    }
  };

  // Fetch content for all initially expanded subunits (none collapsed = all expanded)
  useEffect(() => {
    if (subUnits.length > 0 && jwt) {
      subUnits.forEach((s) => {
        if (!collapsedSections.has(s.id)) {
          fetchSubUnitContent(s.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subUnits]);

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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Course Title Header */}
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={() => navigate("/my-courses")}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to My Courses
            </button>
            <h1 className="text-xl font-black text-[#1a2a5e] leading-snug">
              {course
                ? `${course.courseCode ? course.courseCode + ": " : ""}${course.courseName}`
                : `Course #${id}`}
            </h1>
            {course && (
              <p className="text-sm text-gray-400 mt-1">{course.semester}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-[#c9a227] text-[#c9a227]"
                    : "border-transparent text-gray-500 hover:text-[#1a2a5e]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "Course" && (
              <div>
                {/* Loading state */}
                {subUnitsLoading && (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-[#c9a227]" />
                  </div>
                )}

                {!subUnitsLoading && subUnits.length === 0 && (
                  <div className="text-center py-16 text-gray-400 text-sm">
                    No sub-units found for this course.
                  </div>
                )}

                {!subUnitsLoading && subUnits.length > 0 && (
                  <>
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={allCollapsed ? expandAll : collapseAll}
                        className="text-xs text-[#c9a227] font-semibold hover:underline"
                      >
                        {allCollapsed ? "Expand all" : "Collapse all"}
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {subUnits.map((subUnit) => {
                        const isCollapsed = collapsedSections.has(subUnit.id);
                        const content = subUnitContent[subUnit.id];
                        const contentLoading = content?.loading ?? false;
                        const notes = content?.notes ?? [];
                        const assignments = content?.assignments ?? [];

                        return (
                          <div
                            key={subUnit.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Section header */}
                            <button
                              onClick={() => toggleSection(subUnit.id)}
                              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {isCollapsed
                                  ? <ChevronDown size={16} className="text-[#c9a227]" />
                                  : <ChevronUp   size={16} className="text-[#c9a227]" />
                                }
                                <span className="font-bold text-sm text-[#1a2a5e] text-left">
                                  {subUnit.title}
                                </span>
                              </div>
                              {subUnit.description && (
                                <span className="text-xs text-gray-400 hidden sm:block truncate max-w-xs ml-4">
                                  {subUnit.description}
                                </span>
                              )}
                            </button>

                            {/* Section body */}
                            {!isCollapsed && (
                              <div className="divide-y divide-gray-100">
                                {/* Loading activities */}
                                {contentLoading && (
                                  <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-400">
                                    <Loader2 size={13} className="animate-spin text-[#c9a227]" />
                                    Loading content...
                                  </div>
                                )}

                                {/* Notes */}
                                {!contentLoading && notes.map((note) => (
                                  <div key={`note-${note.id}`}>
                                    <div
                                      onClick={() => toggleNote(note.id)}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5">{activityIcon("notes")}</div>
                                        <div>
                                          <p className="text-sm font-medium text-[#c9a227] group-hover:underline">
                                            {note.title}
                                            <span className="ml-2 text-[10px] text-indigo-400">
                                              {expandedNotes.has(note.id) ? "▲ collapse" : "▼ read notes"}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 font-semibold px-2 py-1 rounded border border-green-200 flex-shrink-0">
                                        <CheckCircle2 size={12} /> Open
                                      </span>
                                    </div>

                                    {/* Inline note content */}
                                    {expandedNotes.has(note.id) && (
                                      <div className="px-4 py-4 border-t border-gray-100">
                                        <div
                                          className="px-6 py-5 rounded-lg border border-gray-100 bg-white"
                                          style={{
                                            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #f3f4f6 31px, #f3f4f6 32px)",
                                            backgroundPositionY: "8px",
                                            fontFamily: "'Georgia', serif",
                                            lineHeight: "2rem",
                                          }}
                                        >
                                          <div
                                            className="prose prose-sm max-w-none text-gray-800 leading-8"
                                            dangerouslySetInnerHTML={{ __html: note.content }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {/* Assignments */}
                                {!contentLoading && assignments.map((assignment) => (
                                  <div
                                    key={`assignment-${assignment.id}`}
                                    onClick={() => handleActivityClick("assignment", assignment.id)}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="mt-0.5">{activityIcon("assignment")}</div>
                                      <div>
                                        <p className="text-sm font-medium text-[#c9a227] group-hover:underline">
                                          {assignment.title}
                                        </p>
                                        {assignment.dueDate && (
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            Due: {new Date(assignment.dueDate).toLocaleDateString("en-GB", {
                                              day: "numeric", month: "short", year: "numeric"
                                            })}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-1 rounded border border-amber-200 flex-shrink-0">
                                      <ClipboardList size={12} /> To do
                                    </span>
                                  </div>
                                ))}

                                {/* Empty subunit */}
                                {!contentLoading && notes.length === 0 && assignments.length === 0 && (
                                  <div className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                                    <AlertTriangle size={13} className="text-amber-400" />
                                    No content available for this sub-unit yet.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "Participants" && (
              <div className="py-8 text-center text-gray-400 text-sm">
                Participants list will appear here.
              </div>
            )}
            {activeTab === "Grades" && (
              <div className="py-8 text-center text-gray-400 text-sm">
                Grades will appear here.
              </div>
            )}
            {activeTab === "Activities" && (
              <div className="py-8 text-center text-gray-400 text-sm">
                Activities will appear here.
              </div>
            )}
            {activeTab === "Competencies" && (
              <div className="py-8 text-center text-gray-400 text-sm">
                Competencies will appear here.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;