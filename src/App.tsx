import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import MainLayout from "./layout/Mainlayout";
import HomePage from "./Features/Home/HomePage";
import Login from "./Features/Authentication/Login";
import Dashboard from "./Features/Dashboard/Dashboard";
import MyCourses from "./Features/Dashboard/MyCourses";
import CourseDetail from "./Features/Dashboard/CourseDetail";
import QuizPage from "./Features/Dashboard/QuizPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/course/:id/quiz/:quizId" element={<QuizPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;