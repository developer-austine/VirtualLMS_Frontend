import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, FileText, Trash2,
  CheckCircle2, Clock, ChevronDown, ChevronUp,
  AlertTriangle, Download, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignmentsData } from "./data/assignmentsData";
import schoolOfBusiness from "../../assets/school-of-business.png";

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const assignment = assignmentsData[assignmentId ?? ""];

  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragging,      setDragging]      = useState(false);
  const [showSubmit,    setShowSubmit]    = useState(false);
  const [saveSuccess,   setSaveSuccess]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!assignment) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Assignment not found.</p>
    </div>
  );

  const isOverdue = assignment.timeRemaining.includes("overdue");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((p) => [...p, ...files].slice(0, assignment.maxFiles));
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles((p) => [...p, ...files].slice(0, assignment.maxFiles));
  };

  const removeFile = (index: number) =>
    setUploadedFiles((p) => p.filter((_, i) => i !== index));

  const handleSaveChanges = async () => {
    if (uploadedFiles.length === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSaveSuccess(true);
    setSubmitted(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSubmit(false);
    }, 2000);
  };

  const statusColor = submitted
    ? "text-green-600 bg-green-50 border-green-200"
    : isOverdue
      ? "text-red-500 bg-red-50 border-red-200"
      : "text-amber-600 bg-amber-50 border-amber-200";

  const statusLabel = submitted ? "Submitted" : isOverdue ? "Overdue" : "To do";

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
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Breadcrumb ─────────────────────── */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Course
            </button>
            {/* Breadcrumb trail */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">
                {assignment.courseName.split(":")[0]}
              </span>
              <span>›</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">
                New section
              </span>
              <span>›</span>
              <span className="px-3 py-1 bg-[#c9a227] text-white rounded-full font-bold">
                {assignment.title}
              </span>
            </div>
          </div>

          {/* ── Title ──────────────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0">
                <Upload size={22} className="text-pink-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-[#1a2a5e]">{assignment.title}</h1>
                <p className="text-sm text-gray-400 mt-1">{assignment.courseName}</p>
              </div>
              {/* Status badge */}
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1 flex-shrink-0 ${statusColor}`}>
                {submitted
                  ? <><CheckCircle2 size={12} /> Submitted</>
                  : isOverdue
                    ? <><AlertTriangle size={12} /> Overdue</>
                    : <><Clock size={12} /> To do</>
                }
              </span>
            </div>
          </div>

          {/* ── Done pill (shows when submitted) ── */}
          {submitted && (
            <div className="px-6 py-3 border-b border-gray-100">
              <span className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                <CheckCircle2 size={14} /> Done: View
              </span>
            </div>
          )}

          {/* ── Assignment info ─────────────────── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col gap-1.5 text-sm mb-5">
              <p className="text-gray-600">
                <span className="font-bold text-[#1a2a5e]">Opened:</span> {assignment.openedAt}
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-[#1a2a5e]">Due:</span> {assignment.dueAt}
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">{assignment.description}</p>

              {/* Attached files from lecturer */}
              {assignment.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {assignment.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-px h-4 bg-gray-300" />
                      <FileText size={14} className="text-[#c9a227]" />
                      <a
                        href="#"
                        className="text-sm text-[#c9a227] hover:underline font-semibold"
                      >
                        {file.name}
                      </a>
                      <span className="text-xs text-gray-400">{file.uploadedAt}</span>
                      <Download size={12} className="text-gray-400 ml-1 cursor-pointer hover:text-[#1a2a5e]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Add submission toggle ───────────── */}
          <div className="px-6 py-4 border-b border-gray-100">
            {!showSubmit ? (
              <Button
                onClick={() => setShowSubmit(true)}
                className="bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold px-6"
              >
                {submitted ? "Edit Submission" : "Add submission"}
              </Button>
            ) : (
              <div>
                {/* Add submission header */}
                <div
                  className="flex items-center gap-3 mb-5 cursor-pointer"
                  onClick={() => setShowSubmit(false)}
                >
                  <div className="w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center flex-shrink-0">
                    <ChevronUp size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-black text-[#1a2a5e]">Add submission</h2>
                </div>

                {/* File info row */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-gray-600">File submissions</span>
                  <span>Maximum file size: {assignment.maxFileSize}, maximum number of files: {assignment.maxFiles}</span>
                </div>

                {/* Upload area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                    dragging
                      ? "border-[#c9a227] bg-amber-50"
                      : "border-gray-200 hover:border-[#c9a227] hover:bg-amber-50/30"
                  }`}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Download size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-semibold">You can drag and drop files here to add them.</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilePick}
                  />
                </div>

                {/* Uploaded files list */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={15} className="text-indigo-500" />
                          <div>
                            <p className="text-sm font-semibold text-[#1a2a5e]">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button onClick={() => removeFile(i)} className="p-1.5 rounded hover:bg-red-50 text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Save / Cancel */}
                <div className="flex items-center gap-3 mt-5">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={submitting || uploadedFiles.length === 0}
                    className={`font-bold px-6 ${
                      saveSuccess
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-[#1a2a5e] hover:bg-[#132047]"
                    } text-white disabled:opacity-40`}
                  >
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : saveSuccess
                        ? <><CheckCircle2 size={15} /> Saved!</>
                        : "Save changes"
                    }
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setShowSubmit(false); setUploadedFiles([]); }}
                    className="border-gray-300 text-gray-600 font-bold px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ── Submission status table ─────────── */}
          <div className="px-6 py-5">
            <h2 className="text-lg font-black text-[#1a2a5e] mb-4">Submission status</h2>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    {
                      label: "Submission status",
                      value: submitted ? "Submitted for grading" : "No submissions have been made yet",
                      highlight: submitted,
                    },
                    {
                      label: "Grading status",
                      value: submitted ? "Not graded" : "Not graded",
                      highlight: false,
                    },
                    {
                      label: "Time remaining",
                      value: submitted ? "Submitted on time" : assignment.timeRemaining,
                      red: !submitted && isOverdue,
                    },
                    {
                      label: "Last modified",
                      value: submitted
                        ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "-",
                    },
                    {
                      label: "Submission comments",
                      value: "Comments (0)",
                      link: true,
                    },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-5 py-3.5 font-bold text-[#1a2a5e] w-48 border-r border-gray-100">
                        {row.label}
                      </td>
                      <td className={`px-5 py-3.5 ${
                        row.red ? "text-red-500 font-semibold" :
                        row.highlight ? "text-green-600 font-semibold" :
                        row.link ? "text-[#c9a227]" :
                        "text-gray-600"
                      }`}>
                        {row.link ? (
                          <button className="flex items-center gap-1 hover:underline">
                            <ChevronDown size={13} /> {row.value}
                          </button>
                        ) : row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;