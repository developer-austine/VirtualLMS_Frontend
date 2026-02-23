import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { quizzes } from "./data/quizData";
import schoolOfBusiness from "../../assets/school-of-business.png";

type QuizState = "intro" | "active" | "submitted";

const QuizPage = () => {
  const { id: courseId, quizId } = useParams();
  const navigate = useNavigate();

  const quiz = quizzes.find((q) => q.id === quizId && q.courseId === courseId);

  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "a" | "b" | "c" | "d">>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  // Timer countdown
  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setQuizState("submitted");
  }, [quiz, answers]);

  useEffect(() => {
    if (quizState !== "active" || timeLeft <= 0) return;
    if (timeLeft === 0) { handleSubmit(); return; }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, timeLeft, handleSubmit]);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Quiz not found.</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startQuiz = () => {
    setTimeLeft(quiz.timeLimit * 60);
    setQuizState("active");
  };

  const selectAnswer = (key: "a" | "b" | "c" | "d") => {
    setAnswers((prev) => ({ ...prev, [quiz.questions[currentQuestion].id]: key }));
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.questions.length) * 100;
  const timerDanger = timeLeft < 120; // red when under 2 mins

  const question = quiz.questions[currentQuestion];

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${schoolOfBusiness})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* ── INTRO DIALOG ─────────────────────────────── */}
      <Dialog open={quizState === "intro"} onOpenChange={() => {}}>
        <DialogContent className="max-w-md rounded-xl border-0 shadow-2xl overflow-hidden p-0">
          <div className="h-1.5 w-full bg-[#c9a227]" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-[#1a2a5e] leading-snug">
                {quiz.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Read the instructions carefully before starting.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Questions", value: quiz.questions.length },
                  { label: "Time Limit", value: `${quiz.timeLimit} min` },
                  { label: "Total Marks", value: quiz.totalMarks },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <p className="text-lg font-black text-[#1a2a5e]">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{quiz.instructions}</p>
              </div>
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
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── ACTIVE QUIZ ──────────────────────────────── */}
      {quizState === "active" && (
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">{quiz.title}</p>
                <p className="text-sm font-black text-[#1a2a5e]">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-sm ${
                timerDanger ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-50 text-[#1a2a5e]"
              }`}>
                <Clock size={15} />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>{answeredCount} of {quiz.questions.length} answered</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Question */}
            <div className="px-6 py-6">
              <p className="text-sm font-bold text-[#1a2a5e] leading-relaxed mb-5">
                {currentQuestion + 1}. {question.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt) => {
                  const selected = answers[question.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => selectAnswer(opt.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all duration-150 ${
                        selected
                          ? "border-[#c9a227] bg-[#c9a227]/10 text-[#1a2a5e] font-semibold"
                          : "border-gray-200 hover:border-[#c9a227]/50 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 uppercase ${
                        selected ? "bg-[#c9a227] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {opt.key}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation footer */}
            <div className="px-6 pb-6 flex items-center justify-between flex-wrap gap-3">
              {/* Question number pills */}
              <div className="flex flex-wrap gap-1.5">
                {quiz.questions.map((q, i) => (
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

                {currentQuestion < quiz.questions.length - 1 ? (
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

      {/* ── RESULTS ──────────────────────────────────── */}
      {quizState === "submitted" && (
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="h-1.5 w-full bg-[#c9a227]" />
            <div className="p-8 text-center">

              {/* Score circle */}
              <div className={`w-28 h-28 rounded-full mx-auto flex flex-col items-center justify-center mb-5 ${
                score >= quiz.questions.length * 0.7
                  ? "bg-green-50 border-4 border-green-400"
                  : "bg-red-50 border-4 border-red-400"
              }`}>
                <p className="text-3xl font-black text-[#1a2a5e]">{score}/{quiz.questions.length}</p>
                <p className="text-xs text-gray-400">Score</p>
              </div>

              <h2 className="text-xl font-black text-[#1a2a5e] mb-1">
                {score >= quiz.questions.length * 0.7 ? "Well done! 🎉" : "Keep practising 💪"}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                You scored <strong>{score * (quiz.totalMarks / quiz.questions.length)}</strong> out of {quiz.totalMarks} marks
              </p>

              {/* Question review */}
              <div className="text-left space-y-3 mb-6">
                {quiz.questions.map((q, i) => {
                  const userAnswer = answers[q.id];
                  const correct = userAnswer === q.correctAnswer;
                  return (
                    <div key={q.id} className={`rounded-lg p-3 border text-sm ${
                      correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}>
                      <div className="flex items-start gap-2">
                        {correct
                          ? <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                          : <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                        }
                        <div>
                          <p className="font-semibold text-[#1a2a5e]">{i + 1}. {q.question}</p>
                          <p className="text-xs mt-1 text-gray-500">
                            Your answer: <span className={`font-bold uppercase ${correct ? "text-green-600" : "text-red-500"}`}>
                              {userAnswer ? `(${userAnswer}) ${q.options.find(o => o.key === userAnswer)?.text}` : "Not answered"}
                            </span>
                          </p>
                          {!correct && (
                            <p className="text-xs text-green-600 font-bold mt-0.5">
                              Correct: ({q.correctAnswer}) {q.options.find(o => o.key === q.correctAnswer)?.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={() => navigate(`/course/${courseId}`)}
                >
                  Back to Course
                </Button>
                <Button
                  className="flex-1 bg-[#1a2a5e] hover:bg-[#132047] text-white font-bold"
                  onClick={() => {
                    setAnswers({});
                    setCurrentQuestion(0);
                    setQuizState("intro");
                  }}
                >
                  Retake Quiz
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