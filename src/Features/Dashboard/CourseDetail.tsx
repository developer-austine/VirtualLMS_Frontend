import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Megaphone,
  Link2,
  Video,
  FileText,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { courses } from "./data/courses";
import { courseContents } from "./data/courseContent";
import schoolOfBusiness from "../../assets/school-of-business.png";

const tabs = ["Course", "Participants", "Grades", "Activities", "Competencies"];

const activityIcon = (type: string) => {
  switch (type) {
    case "announcement": return <Megaphone size={16} className="text-[#c9a227]" />;
    case "link":         return <Link2 size={16} className="text-blue-500" />;
    case "video":        return <Video size={16} className="text-red-500" />;
    case "file":         return <FileText size={16} className="text-orange-400" />;
    case "quiz":         return <HelpCircle size={16} className="text-purple-500" />;
    default:             return <FileText size={16} className="text-gray-400" />;
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Course");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const course = courses.find((c) => c.id === id);
  const content = courseContents.find((c) => c.courseId === id);

  if (!course || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Course not found.</p>
          <button onClick={() => navigate("/my-courses")} className="text-[#c9a227] font-semibold hover:underline">
            ← Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const collapseAll = () => setCollapsedSections(new Set(content.sections.map((s) => s.id)));
  const expandAll = () => setCollapsedSections(new Set());
  const allCollapsed = collapsedSections.size === content.sections.length;

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
              {content.fullTitle}
            </h1>
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
                <div className="flex justify-end mb-4">
                  <button
                    onClick={allCollapsed ? expandAll : collapseAll}
                    className="text-xs text-[#c9a227] font-semibold hover:underline"
                  >
                    {allCollapsed ? "Expand all" : "Collapse all"}
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {content.sections.map((section) => {
                    const isCollapsed = collapsedSections.has(section.id);
                    return (
                      <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {isCollapsed
                              ? <ChevronDown size={16} className="text-[#c9a227]" />
                              : <ChevronUp size={16} className="text-[#c9a227]" />
                            }
                            <span className="font-bold text-sm text-[#1a2a5e]">{section.title}</span>
                          </div>
                        </button>

                        {!isCollapsed && (
                          <div className="divide-y divide-gray-100">
                            {section.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">{activityIcon(activity.type)}</div>
                                  <div>
                                    <p className="text-sm font-medium text-[#c9a227] group-hover:underline">
                                      {activity.title}
                                      {activity.subtitle && activity.type === "file" && (
                                        <span className="text-gray-400 font-normal ml-1">{activity.subtitle}</span>
                                      )}
                                    </p>
                                    {activity.subtitle && activity.type !== "file" && (
                                      <p className="text-xs text-gray-400 mt-0.5">{activity.subtitle}</p>
                                    )}
                                  </div>
                                </div>
                                {activity.status === "done" && (
                                  <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded border border-gray-300">
                                    <CheckCircle2 size={12} className="text-green-500" /> Done
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "Participants" && <div className="py-8 text-center text-gray-400 text-sm">Participants list will appear here.</div>}
            {activeTab === "Grades" && <div className="py-8 text-center text-gray-400 text-sm">Grades will appear here.</div>}
            {activeTab === "Activities" && <div className="py-8 text-center text-gray-400 text-sm">Activities will appear here.</div>}
            {activeTab === "Competencies" && <div className="py-8 text-center text-gray-400 text-sm">Competencies will appear here.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;