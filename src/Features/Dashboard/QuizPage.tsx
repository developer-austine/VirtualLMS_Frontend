import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { getAssignmentDetails } from "@/Redux-Toolkit/features/Assignments/assignmentThunk";
import { clearSelectedAssignment } from "@/Redux-Toolkit/features/Assignments/assignmentSlice";
import {
  Clock, ChevronLeft, ChevronRight, AlertCircle,
  CheckCircle2, XCircle, Loader2, ClipboardList,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import schoolOfBusiness from "../../assets/school-of-business.png";

type QuizState = "intro" | "active" | "submitted";

const QuizPage = () => {
  const { id: courseId, quizId } = useParams<{ id: string; quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { jwt } = useSelector((state: RootState) => state.auth);
  const { selectedAssignment: quiz, loading } = useSelector(
    (state: RootState) => state.assignment
  );

  const [quizState,       setQuizState]       = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,         setAnswers]         = useState<Record<number, string>>({});
  const [timeLeft,        setTimeLeft]        = useState(0);
  const [score,           setScore]           = useState(0);
  const [startedAt,       setStartedAt]       = useState<Date | null>(null);
  const [completedAt,     setCompletedAt]     = useState<Date | null>(null);

  // Fetch assignment on mount
  useEffect(() => {
    if (jwt && quizId) {
      dispatch(clearSelectedAssignment());
      dispatch(getAssignmentDetails({ assignmentId: Number(quizId), token: jwt }));
    }
  }, [jwt, quizId, dispatch]);

  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      const given   = answers[q.id]?.toString().trim().toUpperCase();
      const expected = q.correctAnswer?.toString().trim().toUpperCase();
      if (given && expected && given === expected) correct++;
    });
    setScore(correct);
    setCompletedAt(new Date());
    setQuizState("submitted");
  }, [quiz, answers]);

  // Timer countdown
  useEffect(() => {
    if (quizState !== "active" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const getDuration = () => {
    if (!startedAt || !completedAt) return "—";
    const diff = Math.round((completedAt.getTime() - startedAt.getTime()) / 60000);
    return `${diff} min${diff !== 1 ? "s" : ""}`;
  };

  // Default time limit: 15 mins (no timeLimit field on DTO — use dueDate as reference)
  const TIME_LIMIT_MINS = 15;

  const startQuiz = () => {
    setTimeLeft(TIME_LIMIT_MINS * 60);
    setStartedAt(new Date());
    setQuizState("active");
  };

  const selectAnswer = (letter: string) => {
    if (!quiz) return;
    const q = quiz.questions[currentQuestion];
    setAnswers((prev) => ({ ...prev, [q.id]: letter }));
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading || !quiz) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${schoolOfBusiness})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#c9a227]" />
          <p className="text-sm text-gray-400 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const questions       = quiz.questions ?? [];
  const answeredCount   = Object.keys(answers).length;
  const progress        = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const timerDanger     = timeLeft < 120;
  const question        = questions[currentQuestion];
  // passed is derived from score state - correctly reflects post-submit value
  const passed          = score >= Math.ceil(questions.length * 0.5);

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${schoolOfBusiness})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── INTRO DIALOG ──────────────────────────────────────── */}
      <Dialog open={quizState === "intro"} onOpenChange={() => {}}>
        <DialogContent className="max-w-md rounded-xl border-0 shadow-2xl overflow-hidden p-0">
          <div className="h-1.5 w-full bg-[#c9a227]" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-[#1a2a5e] leading-snug">
                {quiz.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {quiz.courseName} · {quiz.subUnitTitle}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Questions",   value: questions.length > 0 ? questions.length : "—" },
                  { label: "Time Limit",  value: `${TIME_LIMIT_MINS} min` },
                  { label: "Total Marks", value: questions.length > 0 ? questions.length : "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <p className="text-lg font-black text-[#1a2a5e]">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Due date */}
              {quiz.dueDate && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Due: {new Date(quiz.dueDate).toLocaleDateString("en-GB", {
                      weekday: "long", day: "numeric", month: "long",
                      year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                    <br />Once started, the timer cannot be paused. Answer all questions before submitting.
                  </p>
                </div>
              )}

              {quiz.description && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold"
                onClick={startQuiz}
                disabled={questions.length === 0}
              >
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
                <p className="text-xs text-gray-400 font-medium">{quiz.title}</p>
                <p className="text-sm font-black text-[#1a2a5e]">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-sm ${
                timerDanger
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : "bg-gray-50 text-[#1a2a5e]"
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

            {/* Question */}
            <div className="px-6 py-6">
              <p className="text-sm font-bold text-[#1a2a5e] leading-relaxed mb-5">
                {currentQuestion + 1}. {question.questionText}
              </p>

              {/* Choices */}
              <div className="space-y-3">
                {question.choices.map((choice) => {
                  const selected = answers[question.id] === choice.letter;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => selectAnswer(choice.letter)}
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

            {/* Navigation footer */}
            <div className="px-6 pb-6 flex items-center justify-between flex-wrap gap-3">
              {/* Question number pills */}
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                      i === currentQuestion
                        ? "bg-[#1a2a5e] text-white"
                        : answers[q.id]
                        ? "bg-[#c9a227] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Prev / Next / Submit */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
                  disabled={currentQuestion === 0}
                  className="gap-1"
                >
                  <ChevronLeft size={14} /> Prev
                </Button>

                {currentQuestion < questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQuestion((p) => p + 1)}
                    className="bg-[#1a2a5e] hover:bg-[#132047] text-white gap-1"
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMITTED — KCAU-style results card ───────────────── */}
      {quizState === "submitted" && (
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="h-1.5 w-full bg-[#c9a227]" />

            <div className="px-6 py-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap mb-5">
                <span
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="px-3 py-1 bg-gray-100 rounded-full font-semibold cursor-pointer hover:bg-gray-200"
                >
                  {quiz.courseName}
                </span>
                <span>›</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full font-semibold">
                  {quiz.subUnitTitle}
                </span>
                <span>›</span>
                <span className="px-3 py-1 bg-[#c9a227] text-white rounded-full font-bold">
                  {quiz.title}
                </span>
              </div>

              {/* Title */}
              <div className="flex items-center gap-3 mb-5">
                <ClipboardList size={28} className="text-[#c9a227]" />
                <h1 className="text-2xl font-black text-[#1a2a5e]">{quiz.title}</h1>
              </div>

              {/* Opened / Closed */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-5 py-4 text-sm text-gray-600 mb-5 space-y-1">
                <p>
                  <span className="font-bold text-[#1a2a5e]">Opened: </span>
                  {formatDateTime(startedAt)}
                </p>
                {quiz.dueDate && (
                  <p>
                    <span className="font-bold text-[#1a2a5e]">Closed: </span>
                    {new Date(quiz.dueDate).toLocaleDateString("en-GB", {
                      weekday: "long", day: "numeric", month: "long",
                      year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              {/* Score summary */}
              <div className={`flex items-center gap-3 px-5 py-3 rounded-lg border mb-5 ${
                passed
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}>
                {passed
                  ? <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                  : <XCircle     size={18} className="text-red-500 flex-shrink-0"   />
                }
                <p className={`text-sm font-bold ${passed ? "text-green-700" : "text-red-600"}`}>
                  You scored {score} out of {questions.length} —{" "}
                  {passed ? "Well done! 🎉" : "Keep practising 💪"}
                </p>
              </div>

              {/* Attempts info row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="font-semibold text-gray-600">Attempts allowed: 1</span>
                <span>Time limit: {TIME_LIMIT_MINS} mins</span>
              </div>

              {/* Your attempts heading */}
              <h2 className="text-lg font-black text-[#1a2a5e] mb-3">Your attempts</h2>

              {/* Attempt 1 card */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <p className="font-bold text-sm text-[#1a2a5e]">Attempt 1</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "Status",    value: "Finished"                   },
                      { label: "Started",   value: formatDateTime(startedAt)    },
                      { label: "Completed", value: formatDateTime(completedAt)  },
                      { label: "Duration",  value: getDuration()                },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2.5 font-semibold text-gray-500 w-36 border-r border-gray-100">
                          {row.label}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Review not permitted */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <p className="text-sm text-gray-500 italic">Review not permitted</p>
                </div>
              </div>

              {/* No more attempts */}
              <p className="text-sm text-gray-500 mb-6">No more attempts are allowed</p>

              {/* Back to course button */}
              <div className="flex justify-center">
                <Button
                  className="bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold px-8"
                  onClick={() => navigate(`/course/${courseId}`)}
                >
                  Back to the course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;