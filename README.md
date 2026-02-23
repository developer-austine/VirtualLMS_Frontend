# SKYLIMIT  Virtual Campus — LMS Frontend

A modern, responsive Learning Management System (LMS) frontend for KCA University, built with React, TypeScript, Tailwind CSS and Shadcn UI. Mirrors the real SKYLIMIT  Virtual Campus (virtualcampus.SKYLIMIT .ac.ke) with a clean, role-based interface for students and lecturers.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| UI Components | Shadcn UI (Radix UI primitives) |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| State | React useState / useContext |
| Persistence | localStorage (notes, sessions) |
| Rich Text | contentEditable + document.execCommand |

---

## 📁 Project Structure

```
src/
├── assets/                         # Images and static files
│   └── school-of-business.png      # Background image used across pages
│
├── components/
│   └── AccessibilityWidget.tsx     # Floating accessibility toolbar (contrast, font size, etc.)
│
├── context/
│   └── authContext.tsx             # Auth context — login, logout, role detection
│
├── hooks/
│   └── useNotesEditor.ts           # Rich text editor hook (bold, italic, lists, colors, save/publish)
│
├── layout/
│   ├── MainLayout.tsx              # Root layout — TopBar + Navbar + children + AccessibilityWidget
│   ├── TopBar.tsx                  # Navy top bar — contact info + auth icons (bell, avatar, dropdown)
│   └── Navbar.tsx                  # Gold sticky navbar — role-based links + E-Library dropdown
│
├── lib/
│   └── auth.ts                     # Auth logic — temp users, login(), saveSession(), loadSession()
│
└── Features/
    ├── Authentication/
    │   └── Login.tsx               # Login form — async, role-based redirect
    │
    ├── Home/
    │   └── HomePage.tsx            # Landing page with hero image slider
    │
    ├── Dashboard/                  # Student module
    │   ├── Dashboard.tsx           # Wrapper → renders DashboardHome
    │   ├── DashboardHome.tsx       # Timeline (upcoming activities) + Calendar
    │   ├── MyCourses.tsx           # Course grid with search, filter, card/list view
    │   ├── CourseDetail.tsx        # Course page — collapsible sections, activities, inline notes
    │   ├── QuizPage.tsx            # MCQ quiz — intro, timer, navigation, results + review
    │   └── data/
    │       ├── courses.ts          # Course metadata (name, code, color, trim)
    │       ├── courseContent.ts    # Course sections and activities per course
    │       ├── quizData.ts         # Quiz questions, options and correct answers
    │       └── timelineData.ts     # Upcoming classes, quizzes, assignments for timeline/calendar
    │
    └── Lecturer/                   # Lecturer module
        ├── LecturerDashboard.tsx   # Dashboard — upcoming classes, recent activity, calendar
        ├── LecturerCourses.tsx     # Course grid — manage, students, grades quick actions
        ├── LecturerCourseDetail.tsx # Course management — sections, materials, add/delete
        ├── NotesEditor.tsx         # Full rich-text notes editor — Word-like toolbar, save/publish
        ├── InlineNotesViewer.tsx   # Renders saved notes inline below the material row
        ├── StudentList.tsx         # Enrolled students — attendance bar, at-risk indicator
        ├── Grades.tsx              # Grade input table — per student, per activity, save
        ├── ScheduleClass.tsx       # Schedule online class — platform, link, date, time
        ├── Announcements.tsx       # Post and manage announcements per course
        └── data/
            ├── lecturerCourses.ts  # Lecturer's courses + sections + materials mock data
            ├── lecturerStudents.ts # Students per course with grades and attendance
            └── notesStore.ts       # localStorage helper — save/load/publish notes by materialId
```

---

## 🔐 Authentication & Roles

Login is at `/login`. Role detection happens automatically on submit and redirects to the correct dashboard.

| Role | Email | Password | Redirects to |
|---|---|---|---|
| Student | `student@SKYLIMIT .ac.ke` | `password123` | `/dashboard` |
| Lecturer | `lecturer@SKYLIMIT .ac.ke` | `lecturer123` | `/lecturer/dashboard` |
| Admin | `admin@SKYLIMIT .ac.ke` | `admin123` | `/admin/dashboard` |

> Session is persisted in `sessionStorage` so it survives page refresh but clears on tab close.

---

## 🗺️ Routing Table

### Public
| Path | Component |
|---|---|
| `/` | `HomePage` |
| `/login` | `Login` |

### Student
| Path | Component |
|---|---|
| `/dashboard` | `DashboardHome` — Timeline + Calendar |
| `/my-courses` | `MyCourses` — course grid |
| `/course/:id` | `CourseDetail` — sections and activities |
| `/course/:id/quiz/:quizId` | `QuizPage` — timed MCQ quiz |

### Lecturer
| Path | Component |
|---|---|
| `/lecturer/dashboard` | `LecturerDashboard` — upcoming classes + calendar |
| `/lecturer/courses` | `LecturerCourses` — course management grid |
| `/lecturer/course/:id` | `LecturerCourseDetail` — sections, materials, notes |
| `/lecturer/course/:id/students` | `StudentList` — enrolled students |
| `/lecturer/course/:id/grades` | `Grades` — grade input table |
| `/lecturer/course/:id/notes/:noteId` | `NotesEditor` — rich text editor |
| `/lecturer/schedule` | `ScheduleClass` — schedule Zoom/Teams/Meet class |
| `/lecturer/announcements` | `Announcements` — post and manage announcements |

---

## ✨ Features Implemented

### 🎓 Student Module
- **Home Page** — Hero image slider with auto-advance and manual controls
- **Login** — Async form, role-based redirect, show/hide password
- **Dashboard** — Timeline (filter by next 7/30 days, overdue, all upcoming), Calendar with color-coded dots per activity type, clickable day popout
- **My Courses** — Grid/list toggle, search, filter by term, progress display
- **Course Detail** — Collapsible sections, 6 activity types (video, file, quiz, assignment, announcement, link, notes), inline notes reader
- **Quiz** — Intro modal (time, marks, instructions), per-question navigation pills, countdown timer (red under 2min), auto-submit, results with full answer review
- **Inline Notes Viewer** — Students expand notes inline below the activity row, renders formatted HTML from lecturer

### 👨‍🏫 Lecturer Module
- **Dashboard** — Upcoming classes (vertical list), recent activity feed, interactive calendar with event dots
- **My Courses** — Course cards with Manage / Students / Grades quick action buttons
- **Course Management** — Add/delete sections, add materials (file, video, quiz, assignment, link, announcement, notes)
- **Notes Editor** — Word-processor toolbar (bold, italic, underline, strikethrough, headings, font size, text color, highlight, alignment, lists, indent, links, HR), ruled notepad background, auto-save to `localStorage`, publish button
- **Inline Notes Display** — Lecturer sees notes rendered below material row with ✏️ Edit button
- **Student List** — Attendance progress bar, Active / At Risk status badges
- **Grades** — Editable grade table per activity, totals column, save confirmation
- **Schedule Class** — Platform picker (Zoom/Teams/Meet), meeting link, topic, date, time, duration
- **Announcements** — Single card layout, course selector pills, compose form, posted list with delete

### ♿ Accessibility Widget
- Floating orange button, centered on right edge
- Full-height panel on click
- 11 features: Contrast, Highlight Links, Bigger Text, Text Spacing, Pause Animations, Hide Images, Dyslexia Friendly, Cursor, Tooltips, Line Height, Text Align (cycle)
- Reset all button
- Applies real CSS to `document.body` via class toggles

---

## 🚧 Pending / Planned

- [ ] Admin module (dashboard, user management, course oversight)
- [ ] File upload for materials (PDF, PPT, video)
- [ ] Real Zoom/Teams API integration for class scheduling
- [ ] Backend API integration (replace mock data and localStorage)
- [ ] Email notifications for announcements
- [ ] Grade export to CSV/Excel
- [ ] Student assignment submission
- [ ] Search across all courses and activities

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install & Run
```bash
# Clone the repo
git clone https://github.com/developer-austine/VirtualLMS_Frontend.git
cd VirtualLMS_Frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Navy | `#1a2a5e` | Primary text, buttons, navbar |
| Gold | `#c9a227` | Accents, active states, highlights |
| Background | `school-of-business.png` | Full-page fixed background image |
| Card | `bg-white rounded-xl shadow-lg` | All content cards float on background |
| Font (UI) | System / Tailwind default | Interface text |
| Font (Notes) | Georgia, serif | Notes editor and viewer |

---

## 🔌 Backend Integration Guide

All mock data lives in `src/Features/*/data/*.ts`. To connect a real backend:

1. **Auth** — Replace `login()` in `src/lib/auth.ts`:
```ts
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();
if (res.ok) return { success: true, user: data.user };
return { success: false, error: data.message };
```

2. **Courses** — Replace `courses.ts` and `courseContent.ts` data with API calls using `useEffect` + `fetch` or a data-fetching library like React Query / SWR.

3. **Notes** — Replace `notesStore.ts` localStorage calls with API endpoints:
   - `POST /api/notes` — save note
   - `GET /api/notes/:materialId` — load note
   - `PATCH /api/notes/:materialId/publish` — publish note

4. **Grades** — Replace the `save()` handler in `Grades.tsx` with `POST /api/grades`.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit Message Convention (Conventional Commits)

```
feat:     new feature
fix:      bug fix
refactor: code change that neither fixes nor adds a feature
style:    formatting, missing semicolons, etc.
docs:     documentation changes
chore:    build process or tooling changes
```

---

## 📄 License

This project is for academic and demonstration purposes — SKYLIMIT COLLEGE Virtual Campus Frontend.

---
