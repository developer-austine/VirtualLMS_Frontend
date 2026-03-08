import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Trash2, HelpCircle, Loader2,
  ChevronDown, ChevronUp, Clock, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AppDispatch, RootState } from "@/Redux-Toolkit/globalState";
import { useBanner } from "@/hooks/useBanner";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Choice {
  letter: string;
  text: string;
}

interface Question {
  id: string; // local only for UI key
  questionText: string;
  correctAnswer: string; // letter e.g. "A"
  choices: Choice[];
}

const LETTERS = ["A", "B", "C", "D"];

const blankQuestion = (): Question => ({
  id: crypto.randomUUID(),
  questionText: "",
  correctAnswer: "A",
  choices: LETTERS.map((l) => ({ letter: l, text: "" })),
});

// ── Question card ─────────────────────────────────────────────────────────────
const QuestionCard = ({
  question, index, total,
  onChange, onDelete, onMoveUp, onMoveDown,
}: {
  question: Question; index: number; total: number;
  onChange: (q: Question) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateChoice = (letter: string, text: string) =>
    onChange({ ...question, choices: question.choices.map((c) => c.letter === letter ? { ...c, text } : c) });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#1a2a5e] bg-[#1a2a5e]/10 px-2 py-0.5 rounded-full">
            Q{index + 1}
          </span>
          {collapsed && (
            <span className="text-xs text-gray-500 truncate max-w-[200px]">
              {question.questionText || "Untitled question"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp} disabled={index === 0}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={onMoveDown} disabled={index === total - 1}
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            <ChevronDown size={13} />
          </button>
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-400"
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Card body */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Question text */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Question</label>
            <Textarea
              value={question.questionText}
              onChange={(e) => onChange({ ...question, questionText: e.target.value })}
              placeholder="Enter the question..."
              className="text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Choices */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Choices</label>
            <div className="space-y-2">
              {question.choices.map((choice) => (
                <div key={choice.letter} className="flex items-center gap-2">
                  {/* Correct answer radio */}
                  <button
                    onClick={() => onChange({ ...question, correctAnswer: choice.letter })}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                      question.correctAnswer === choice.letter
                        ? "border-[#1a2a5e] bg-[#1a2a5e] text-white"
                        : "border-gray-300 text-gray-400 hover:border-[#c9a227]"
                    }`}
                  >
                    {choice.letter}
                  </button>
                  <Input
                    value={choice.text}
                    onChange={(e) => updateChoice(choice.letter, e.target.value)}
                    placeholder={`Option ${choice.letter}`}
                    className="text-sm flex-1"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Click the letter circle to mark the correct answer.
              Currently correct: <span className="font-bold text-[#1a2a5e]">{question.correctAnswer}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const LecturerQuizBuilder = () => {
  const { id } = useParams();           // courseId from URL
  const navigate  = useNavigate();
  const dispatch  = useDispatch<AppDispatch>();
  const location  = useLocation();

  const { jwt } = useSelector((state: RootState) => state.auth);
  const token = jwt || localStorage.getItem("jwt") || "";

  // Passed from LecturerCourseDetail via navigate state
  const { subUnitId, courseId: stateCourseId, title: preTitle } = (location.state ?? {}) as {
    subUnitId?: number; courseId?: number; title?: string;
  };

  const courseId = stateCourseId ?? Number(id);

  const [title,       setTitle]       = useState(preTitle ?? "");
  const [description, setDescription] = useState("");
  const [dueDate,     setDueDate]     = useState("");
  const [questions,   setQuestions]   = useState<Question[]>([blankQuestion()]);
  const [submitting,  setSubmitting]  = useState(false);

  const addQuestion = () => setQuestions((p) => [...p, blankQuestion()]);

  const updateQuestion = (index: number, q: Question) =>
    setQuestions((p) => p.map((old, i) => i === index ? q : old));

  const deleteQuestion = (index: number) =>
    setQuestions((p) => p.filter((_, i) => i !== index));

  const moveUp = (index: number) => {
    if (index === 0) return;
    setQuestions((p) => {
      const a = [...p];
      [a[index - 1], a[index]] = [a[index], a[index - 1]];
      return a;
    });
  };

  const moveDown = (index: number) => {
    setQuestions((p) => {
      if (index === p.length - 1) return p;
      const a = [...p];
      [a[index], a[index + 1]] = [a[index + 1], a[index]];
      return a;
    });
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Please enter a quiz title.";
    if (!subUnitId)    return "Sub-unit not found. Please go back and try again.";
    if (questions.length === 0) return "Add at least one question.";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} is missing text.`;
      const filledChoices = q.choices.filter((c) => c.text.trim());
      if (filledChoices.length < 2) return `Question ${i + 1} needs at least 2 choices.`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    try {
      const { default: api } = await import("@/utils/api");

      // Step 1 — Save the quiz/assignment with all questions
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        questions: questions.map((q) => ({
          questionText: q.questionText.trim(),
          correctAnswer: q.correctAnswer,
          choices: q.choices
            .filter((c) => c.text.trim())
            .map((c) => ({ letter: c.letter, text: c.text.trim() })),
        })),
      };

      const assignmentRes = await api.post(
        `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/assignments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2 — Create a Material record of type QUIZ so it shows in the section
      // The material url stores the assignment id for later retrieval
      const assignmentId = assignmentRes.data?.data?.id ?? assignmentRes.data?.id;
      await api.post(
        `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/materials`,
        {
          title: title.trim(),
          description: description.trim() || undefined,
          type: "QUIZ",
          orderIndex: 0,
          url: assignmentId ? String(assignmentId) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Quiz published successfully!");
      navigate(`/lecturer/course/${id}`, { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${useBanner()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

          {/* ── Header ── */}
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3"
            >
              <ArrowLeft size={13} /> Back to Course
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle size={18} className="text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg font-black text-[#1a2a5e]">Quiz Builder</h1>
                <p className="text-xs text-gray-400">Create questions with multiple-choice answers and set a due date.</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">

            {/* ── Quiz details ── */}
            <div className="space-y-3">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Quiz Details</h2>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Title <span className="text-red-400">*</span></label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Midterm Quiz — OOP Concepts" className="text-sm" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Instructions <span className="text-gray-400 font-normal">(optional)</span></label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Answer all questions. Each question is worth 1 mark."
                  className="text-sm resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Due Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2a5e]/20"
                />
                {dueDate && (
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    Due: {new Date(dueDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* ── Questions ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  Questions <span className="text-[#1a2a5e]">({questions.length})</span>
                </h2>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-1 text-xs font-bold text-[#c9a227] hover:underline"
                >
                  <Plus size={12} /> Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <HelpCircle size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-semibold">No questions yet</p>
                  <button onClick={addQuestion} className="mt-2 text-xs font-bold text-[#c9a227] hover:underline flex items-center gap-1 mx-auto">
                    <Plus size={11} /> Add first question
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={i}
                      total={questions.length}
                      onChange={(updated) => updateQuestion(i, updated)}
                      onDelete={() => deleteQuestion(i)}
                      onMoveUp={() => moveUp(i)}
                      onMoveDown={() => moveDown(i)}
                    />
                  ))}
                </div>
              )}

              {questions.length > 0 && (
                <button
                  onClick={addQuestion}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
                >
                  <Plus size={13} /> Add another question
                </button>
              )}
            </div>

            {/* ── Summary & submit ── */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-gray-500">
                <span className="font-black text-[#1a2a5e]">{questions.length}</span> question{questions.length !== 1 ? "s" : ""}
                {dueDate && (
                  <span className="ml-3">
                    · Due <span className="font-bold text-[#1a2a5e]">{new Date(dueDate).toLocaleDateString()}</span>
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs" onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <><Loader2 size={13} className="animate-spin" /> Publishing...</>
                    : "Publish Quiz"
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerQuizBuilder;