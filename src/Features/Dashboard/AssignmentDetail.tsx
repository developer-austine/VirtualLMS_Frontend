import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAssignmentDetails } from "@/Redux-Toolkit/features/Assignments/assignmentThunk";
import { clearSelectedAssignment } from "@/Redux-Toolkit/features/Assignments/assignmentSlice";
import { getMyAttempt, submitQuizAttempt } from "@/Redux-Toolkit/features/Attempt/attemptThunk";
import { clearAttempt } from "@/Redux-Toolkit/features/Attempt/attemptSlice";
import {
  ArrowLeft, Upload, FileText, CheckCircle2, Clock,
  ChevronDown, ChevronUp, AlertTriangle, Download,
  X, Loader2, ChevronLeft, ChevronRight, AlertCircle,
  XCircle, ClipboardList, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import schoolOfBusiness from "../../assets/school-of-business.png";

type QuizState = "intro" | "active" | "submitted";
const TIME_LIMIT_MINS = 15;

const AssignmentDetail = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate         = useNavigate();
  const dispatch         = useDispatch<AppDispatch>();

  const { jwt }                                         = useSelector((state: RootState) => state.auth);
  const { selectedAssignment: assignment, loading }     = useSelector((state: RootState) => state.assignment);
  const { attempt: savedAttempt, loading: attemptLoading, submitting } = useSelector((state: RootState) => state.attempt);

  // ── File-submission state ────────────────────────────────────────
  const [submitted,     setSubmitted]     = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragging,      setDragging]      = useState(false);
  const [showSubmit,    setShowSubmit]    = useState(false);
  const [saveSuccess,   setSaveSuccess]   = useState(false);
  const [fileSubmitting, setFileSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Quiz state ───────────────────────────────────────────────────
  const [quizState,       setQuizState]       = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,         setAnswers]         = useState<Record<number, string>>({});
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [localScore,      setLocalScore]      = useState(0);
  const [startedAt,       setStartedAt]       = useState<Date | null>(null);

  // ── Fetch assignment + existing attempt on mount ─────────────────
  useEffect(() => {
    if (jwt && assignmentId) {
      dispatch(clearSelectedAssignment());
      dispatch(clearAttempt());
      dispatch(getAssignmentDetails({ assignmentId: Number(assignmentId), token: jwt }));
      dispatch(getMyAttempt({ assignmentId: Number(assignmentId), token: jwt }));
    }
  }, [jwt, assignmentId, dispatch]);

  // ── If a saved attempt exists, jump straight to results ──────────
  useEffect(() => {
    if (savedAttempt) setQuizState("submitted");
  }, [savedAttempt]);

  // ── Quiz: submit handler ─────────────────────────────────────────
  const handleQuizSubmit = useCallback(async () => {
    if (!assignment || !jwt) return;

    const answersPayload = assignment.questions.map((q) => ({
      questionId:     q.id,
      selectedLetter: answers[q.id] ?? "",
    }));

    // Optimistic local score for immediate UI feedback
    let correct = 0;
    assignment.questions.forEach((q) => {
      const given    = answers[q.id]?.toString().trim().toUpperCase();
      const expected = q.correctAnswer?.toString().trim().toUpperCase();
      if (given && expected && given === expected) correct++;
    });
    setLocalScore(correct);

    await dispatch(submitQuizAttempt({
      assignmentId: Number(assignmentId),
      token: jwt,
      data: {
        startedAt: (startedAt ?? new Date()).toISOString(),
        answers:   answersPayload,
      },
    }));

    setQuizState("submitted");
  }, [assignment, answers, assignmentId, jwt, startedAt, dispatch]);

  // ── Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (quizState !== "active" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleQuizSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, timeLeft, handleQuizSubmit]);

  // ── Loading screen ───────────────────────────────────────────────
  if (loading || attemptLoading || !assignment) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundImage: `url(${schoolOfBusiness})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#c9a227]" />
          <p className="text-sm text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const isQuiz = (assignment.questions?.length ?? 0) > 0;

  // ════════════════════════════════════════════════════════════════
  // QUIZ RENDER
  // ════════════════════════════════════════════════════════════════
  if (isQuiz) {
    const questions     = assignment.questions;
    const answeredCount = Object.keys(answers).length;
    const progress      = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
    const timerDanger   = timeLeft < 120;
    const question      = questions[currentQuestion];

    // Use backend attempt data if available, otherwise use local optimistic values
    const displayScore    = savedAttempt ? savedAttempt.score        : localScore;
    const displayTotal    = savedAttempt ? savedAttempt.totalQuestions : questions.length;
    const displayPassed   = savedAttempt ? savedAttempt.passed        : localScore >= Math.ceil(questions.length * 0.5);
    const displayStarted  = savedAttempt ? new Date(savedAttempt.startedAt)   : startedAt;
    const displayCompleted = savedAttempt ? new Date(savedAttempt.completedAt) : new Date();

    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60).toString().padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    const formatDateTime = (date: Date | null) =>
      date ? date.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long",
        year: "numeric", hour: "2-digit", minute: "2-digit",
      }) : "—";

    const getDuration = () => {
      if (!displayStarted || !displayCompleted) return "—";
      const diff = Math.round((displayCompleted.getTime() - displayStarted.getTime()) / 60000);
      return `${diff} min${diff !== 1 ? "s" : ""}`;
    };

    const startQuiz = () => {
      setTimeLeft(TIME_LIMIT_MINS * 60);
      setStartedAt(new Date());
      setQuizState("active");
    };

    return (
      <div
        className="min-h-screen w-full relative"
        style={{ backgroundImage: `url(${schoolOfBusiness})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        {/* ── INTRO DIALOG ──────────────────────────────────────── */}
        <Dialog open={quizState === "intro"} onOpenChange={() => {}}>
          <DialogContent className="max-w-md rounded-xl border-0 shadow-2xl overflow-hidden p-0">
            <div className="h-1.5 w-full bg-[#c9a227]" />
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-[#1a2a5e] leading-snug">
                  {assignment.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  {assignment.courseName} · {assignment.subUnitTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Questions",   value: questions.length },
                    { label: "Time Limit",  value: `${TIME_LIMIT_MINS} min` },
                    { label: "Total Marks", value: questions.length },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                      <p className="text-lg font-black text-[#1a2a5e]">{s.value}</p>
                      <p className="text-xs text-gray-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    {assignment.dueDate && (
                      <>Due: {new Date(assignment.dueDate).toLocaleDateString("en-GB", {
                        weekday: "long", day: "numeric", month: "long",
                        year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}<br /></>
                    )}
                    Once started, the timer cannot be paused. Answer all questions before submitting.
                  </p>
                </div>

                {assignment.description && (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {assignment.description}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-600" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── ACTIVE QUIZ ───────────────────────────────────────── */}
        {quizState === "active" && question && (
          <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{assignment.title}</p>
                  <p className="text-sm font-black text-[#1a2a5e]">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-sm ${
                  timerDanger ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-50 text-[#1a2a5e]"
                }`}>
                  <Clock size={15} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Progress */}
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{answeredCount} of {questions.length} answered</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Question + choices */}
              <div className="px-6 py-6">
                <p className="text-sm font-bold text-[#1a2a5e] leading-relaxed mb-5">
                  {currentQuestion + 1}. {question.questionText}
                </p>
                <div className="space-y-3">
                  {question.choices.map((choice) => {
                    const selected = answers[question.id] === choice.letter;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => setAnswers((p) => ({ ...p, [question.id]: choice.letter }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all duration-150 ${
                          selected
                            ? "border-[#c9a227] bg-[#c9a227]/10 text-[#1a2a5e] font-semibold"
                            : "border-gray-200 hover:border-[#c9a227]/50 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 uppercase ${
                          selected ? "bg-[#c9a227] text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {choice.letter}
                        </span>
                        {choice.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="px-6 pb-6 flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(i)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                        i === currentQuestion ? "bg-[#1a2a5e] text-white"
                        : answers[q.id] ? "bg-[#c9a227] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1"
                    onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                    disabled={currentQuestion === 0}>
                    <ChevronLeft size={14} /> Prev
                  </Button>
                  {currentQuestion < questions.length - 1 ? (
                    <Button size="sm" className="bg-[#1a2a5e] hover:bg-[#132047] text-white gap-1"
                      onClick={() => setCurrentQuestion((p) => p + 1)}>
                      Next <ChevronRight size={14} />
                    </Button>
                  ) : (
                    <Button size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold min-w-[110px]"
                      onClick={handleQuizSubmit}
                      disabled={submitting}>
                      {submitting
                        ? <><Loader2 size={13} className="animate-spin" /> Submitting...</>
                        : "Submit Quiz"
                      }
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SUBMITTED / LOCKED results card ───────────────────── */}
        {quizState === "submitted" && (
          <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-1.5 w-full bg-[#c9a227]" />
              <div className="px-6 py-6">

                {/* Locked badge */}
                <div className="flex items-center gap-2 mb-5 px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200 w-fit">
                  <Lock size={14} className="text-gray-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Quiz Locked — Already Attempted
                  </span>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap mb-5">
                  <span onClick={() => navigate(-1)}
                    className="px-3 py-1 bg-gray-100 rounded-full font-semibold cursor-pointer hover:bg-gray-200">
                    {assignment.courseName}
                  </span>
                  <span>›</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">{assignment.subUnitTitle}</span>
                  <span>›</span>
                  <span className="px-3 py-1 bg-[#c9a227] text-white rounded-full font-bold">{assignment.title}</span>
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-5">
                  <ClipboardList size={28} className="text-[#c9a227]" />
                  <h1 className="text-2xl font-black text-[#1a2a5e]">{assignment.title}</h1>
                </div>

                {/* Opened / Closed */}
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-5 py-4 text-sm text-gray-600 mb-5 space-y-1">
                  <p><span className="font-bold text-[#1a2a5e]">Opened: </span>{formatDateTime(displayStarted)}</p>
                  {assignment.dueDate && (
                    <p>
                      <span className="font-bold text-[#1a2a5e]">Closed: </span>
                      {new Date(assignment.dueDate).toLocaleDateString("en-GB", {
                        weekday: "long", day: "numeric", month: "long",
                        year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                {/* Score banner */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border mb-5 ${
                  displayPassed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}>
                  {displayPassed
                    ? <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                    : <XCircle     size={18} className="text-red-500 flex-shrink-0"   />
                  }
                  <p className={`text-sm font-bold ${displayPassed ? "text-green-700" : "text-red-600"}`}>
                    You scored {displayScore} out of {displayTotal} —{" "}
                    {displayPassed ? "Well done! 🎉" : "Keep practising 💪"}
                  </p>
                </div>

                {/* Attempts info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="font-semibold text-gray-600">Attempts allowed: 1</span>
                  <span>Time limit: {TIME_LIMIT_MINS} mins</span>
                </div>

                <h2 className="text-lg font-black text-[#1a2a5e] mb-3">Your attempts</h2>

                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <p className="font-bold text-sm text-[#1a2a5e]">Attempt 1</p>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: "Status",    value: "Finished"                      },
                        { label: "Started",   value: formatDateTime(displayStarted)  },
                        { label: "Completed", value: formatDateTime(displayCompleted)},
                        { label: "Duration",  value: getDuration()                   },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 font-semibold text-gray-500 w-36 border-r border-gray-100">{row.label}</td>
                          <td className="px-4 py-2.5 text-gray-700">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <p className="text-sm text-gray-500 italic">Review not permitted</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">No more attempts are allowed</p>

                <div className="flex justify-center">
                  <Button className="bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold px-8"
                    onClick={() => navigate(-1)}>
                    Back to the course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // FILE SUBMISSION RENDER
  // ════════════════════════════════════════════════════════════════
  const dueDateObj   = assignment.dueDate   ? new Date(assignment.dueDate)   : null;
  const createdAtObj = assignment.createdAt ? new Date(assignment.createdAt) : null;
  const now          = new Date();
  const isOverdue    = dueDateObj ? now > dueDateObj : false;

  const formatDt = (d: Date | null) =>
    d ? d.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    }) : "—";

  const timeRemaining = () => {
    if (!dueDateObj) return "No due date";
    if (submitted)   return "Submitted on time";
    if (isOverdue)   return "Assignment is overdue";
    const diff = dueDateObj.getTime() - now.getTime();
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    return days > 0 ? `${days} day${days !== 1 ? "s" : ""} ${hrs} hrs` : `${hrs} hour${hrs !== 1 ? "s" : ""}`;
  };

  const statusColor = submitted
    ? "text-green-600 bg-green-50 border-green-200"
    : isOverdue
      ? "text-red-500 bg-red-50 border-red-200"
      : "text-amber-600 bg-amber-50 border-amber-200";

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((p) => [...p, ...files].slice(0, 5));
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles((p) => [...p, ...files].slice(0, 5));
  };

  const handleSaveChanges = async () => {
    if (uploadedFiles.length === 0) return;
    setFileSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setFileSubmitting(false);
    setSaveSuccess(true);
    setSubmitted(true);
    setTimeout(() => { setSaveSuccess(false); setShowSubmit(false); }, 2000);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundImage: `url(${schoolOfBusiness})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Breadcrumb */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
              <ArrowLeft size={13} /> Back to Course
            </button>
            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400 mb-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">{assignment.courseName}</span>
              <span>›</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">{assignment.subUnitTitle}</span>
              <span>›</span>
              <span className="px-3 py-1 bg-[#c9a227] text-white rounded-full font-bold">{assignment.title}</span>
            </div>
          </div>

          {/* Title row */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0">
                <Upload size={22} className="text-pink-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-[#1a2a5e]">{assignment.title}</h1>
                <p className="text-sm text-gray-400 mt-1">{assignment.courseName} · {assignment.subUnitTitle}</p>
                <p className="text-xs text-gray-400 mt-0.5">By {assignment.createdByLecturerName}</p>
              </div>
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

          {submitted && (
            <div className="px-6 py-3 border-b border-gray-100">
              <span className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                <CheckCircle2 size={14} /> Done: View
              </span>
            </div>
          )}

          {/* Info */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col gap-1.5 text-sm mb-5">
              <p className="text-gray-600"><span className="font-bold text-[#1a2a5e]">Opened:</span> {formatDt(createdAtObj)}</p>
              <p className="text-gray-600"><span className="font-bold text-[#1a2a5e]">Due:</span> {formatDt(dueDateObj)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {assignment.description || "No description provided for this assignment."}
              </p>
            </div>
          </div>

          {/* Submission panel */}
          <div className="px-6 py-4 border-b border-gray-100">
            {!showSubmit ? (
              <Button onClick={() => setShowSubmit(true)}
                className="bg-[#c9a227] hover:bg-[#b8911f] text-white font-bold px-6">
                {submitted ? "Edit Submission" : "Add submission"}
              </Button>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5 cursor-pointer" onClick={() => setShowSubmit(false)}>
                  <div className="w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center flex-shrink-0">
                    <ChevronUp size={14} className="text-white" />
                  </div>
                  <h2 className="text-lg font-black text-[#1a2a5e]">Add submission</h2>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-gray-600">File submissions</span>
                  <span>Maximum file size: 10MB, maximum files: 5</span>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                    dragging ? "border-[#c9a227] bg-amber-50" : "border-gray-200 hover:border-[#c9a227] hover:bg-amber-50/30"
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Download size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-semibold">Drag and drop files here to add them.</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
                  <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFilePick} />
                </div>

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
                        <button onClick={() => setUploadedFiles((p) => p.filter((_, idx) => idx !== i))}
                          className="p-1.5 rounded hover:bg-red-50 text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-5">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={fileSubmitting || uploadedFiles.length === 0}
                    className={`font-bold px-6 ${saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"} text-white disabled:opacity-40`}
                  >
                    {fileSubmitting
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : saveSuccess ? <><CheckCircle2 size={15} /> Saved!</> : "Save changes"
                    }
                  </Button>
                  <Button variant="outline" onClick={() => { setShowSubmit(false); setUploadedFiles([]); }}
                    className="border-gray-300 text-gray-600 font-bold px-6">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submission status table */}
          <div className="px-6 py-5">
            <h2 className="text-lg font-black text-[#1a2a5e] mb-4">Submission status</h2>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Submission status",   value: submitted ? "Submitted for grading" : "No submissions have been made yet", highlight: submitted },
                    { label: "Grading status",       value: "Not graded", highlight: false },
                    { label: "Time remaining",       value: timeRemaining(), red: !submitted && isOverdue },
                    { label: "Last modified",        value: submitted ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—" },
                    { label: "Submission comments",  value: "Comments (0)", link: true },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-5 py-3.5 font-bold text-[#1a2a5e] w-48 border-r border-gray-100">{row.label}</td>
                      <td className={`px-5 py-3.5 ${
                        row.red ? "text-red-500 font-semibold"
                        : row.highlight ? "text-green-600 font-semibold"
                        : row.link ? "text-[#c9a227]" : "text-gray-600"
                      }`}>
                        {row.link
                          ? <button className="flex items-center gap-1 hover:underline"><ChevronDown size={13} />{row.value}</button>
                          : row.value
                        }
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