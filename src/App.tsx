import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SystemProvider } from "./context/systemContext";
import MainLayout from "./layout/Mainlayout";

// Public
import HomePage  from "./Features/Home/HomePage";
import Login     from "./Features/Authentication/Login";

// Student
import Dashboard       from "./Features/Dashboard/Dashboard";
import MyCourses       from "./Features/Dashboard/MyCourses";
import CourseDetail    from "./Features/Dashboard/CourseDetail";
import QuizPage        from "./Features/Dashboard/QuizPage";
import AssignmentDetail from "./Features/Dashboard/AssignmentDetail";

// Lecturer
import LecturerDashboard   from "./Features/Lecturer/LecturerDashboard";
import LecturerCourses     from "./Features/Lecturer/LecturerCourses";
import LecturerCourseDetail from "./Features/Lecturer/LecturerCourseDetail";
import StudentList         from "./Features/Lecturer/StudentList";
import Grades              from "./Features/Lecturer/Grades";
import ScheduleClass       from "./Features/Lecturer/ScheduleClass";
import Announcements       from "./Features/Lecturer/Announcements";
import NotesEditor         from "./Features/Lecturer/NotesEditor";

// Admin
import AdminDashboard from "./Features/Admin/AdminDashboard";
import AdminUsers     from "./Features/Admin/AdminUsers";
import AdminReports   from "./Features/Admin/AdminReports";
import AdminSettings  from "./Features/Admin/AdminSettings";
import AdminCreate    from "./Features/Admin/AdminCreate";

//shadcn
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <Toaster position="top-right" richColors />
          <MainLayout>
            <Routes>
              {/* ── Public ── */}
              <Route path="/"      element={<HomePage />} />
              <Route path="/login" element={<Login />} />

              {/* ── Student ── */}
              <Route path="/dashboard"                    element={<Dashboard />} />
              <Route path="/my-courses"                   element={<MyCourses />} />
              <Route path="/course/:id"                   element={<CourseDetail />} />
              <Route path="/course/:id/quiz/:quizId"      element={<QuizPage />} />
              <Route path="/assignment/:assignmentId"     element={<AssignmentDetail />} />

              {/* ── Lecturer ── */}
              <Route path="/lecturer/dashboard"                element={<LecturerDashboard />} />
              <Route path="/lecturer/courses"                  element={<LecturerCourses />} />
              <Route path="/lecturer/course/:id"               element={<LecturerCourseDetail />} />
              <Route path="/lecturer/course/:id/students"      element={<StudentList />} />
              <Route path="/lecturer/course/:id/grades"        element={<Grades />} />
              <Route path="/lecturer/course/:id/notes/:noteId" element={<NotesEditor />} />
              <Route path="/lecturer/schedule"                 element={<ScheduleClass />} />
              <Route path="/lecturer/announcements"            element={<Announcements />} />

              {/* ── Admin ── */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<AdminUsers />} />
              <Route path="/admin/reports"   element={<AdminReports />} />
              <Route path="/admin/settings"  element={<AdminSettings />} />
              <Route path="/admin/create" element={<AdminCreate />} />

            </Routes>
          </MainLayout>
      </SystemProvider>
    </BrowserRouter>
  );
}

export default App;