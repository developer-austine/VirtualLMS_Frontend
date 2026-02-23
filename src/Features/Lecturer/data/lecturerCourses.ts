export interface LecturerCourse {
  id: string;
  code: string;
  name: string;
  stream: string;
  trim: string;
  enrolledStudents: number;
  color: string;
  schedule: string;
  platform: string;
}

export interface CourseSection {
  id: string;
  title: string;
  materials: CourseMaterial[];
}

export interface CourseMaterial {
  id: string;
  type: "file" | "video" | "quiz" | "assignment" | "link" | "announcement" | "notes";
  title: string;
  subtitle?: string;
  uploadedAt: string;
}

export const lecturerCourses: LecturerCourse[] = [
  {
    id: "lc1",
    code: "CPP 3202",
    name: "ADVANCED JAVA PROGRAMMING",
    stream: "FT:MAIN:Stream A",
    trim: "TRIM1 26",
    enrolledStudents: 45,
    color: "bg-purple-400",
    schedule: "Thursday, 3:00 PM",
    platform: "Zoom",
  },
  {
    id: "lc2",
    code: "CPP 3204",
    name: "NETWORK PROGRAMMING",
    stream: "FT:MAIN:Stream A",
    trim: "TRIM1 26",
    enrolledStudents: 38,
    color: "bg-blue-500",
    schedule: "Tuesday, 10:00 AM",
    platform: "Teams",
  },
  {
    id: "lc3",
    code: "CPP 4101",
    name: "SOFTWARE ENGINEERING",
    stream: "FT:MAIN:Stream B",
    trim: "TRIM1 26",
    enrolledStudents: 52,
    color: "bg-violet-500",
    schedule: "Wednesday, 2:00 PM",
    platform: "Google Meet",
  },
];

export const lecturerCourseSections: Record<string, CourseSection[]> = {
  lc1: [
    {
      id: "s1",
      title: "General",
      materials: [
        { id: "m1", type: "announcement", title: "Announcements", uploadedAt: "2026-01-10" },
        { id: "m2", type: "link", title: "Whatsapp Group", uploadedAt: "2026-01-10" },
        { id: "m3", type: "video", title: "Online Class", subtitle: "Thu 26 Feb, 3:00 PM", uploadedAt: "2026-01-10" },
      ],
    },
    {
      id: "s2",
      title: "Introduction",
      materials: [
        { id: "m4", type: "file", title: "Introduction", subtitle: "PPT", uploadedAt: "2026-01-15" },
        { id: "m5", type: "video", title: "Lecture 1: Introduction", subtitle: "Ended: 29 Jan 2026", uploadedAt: "2026-01-29" },
      ],
    },
    {
      id: "s3",
      title: "Lecture 2: Advanced Concepts",
      materials: [
        { id: "m6", type: "file", title: "Advanced Java Notes", subtitle: "PPT", uploadedAt: "2026-02-05" },
        { id: "m7", type: "assignment", title: "Assignment 1", subtitle: "Due: 20 Feb 2026", uploadedAt: "2026-02-05" },
      ],
    },
    {
      id: "s4",
      title: "Lecture 3: Design Patterns",
      materials: [
        { id: "m8", type: "quiz", title: "Quiz 1", subtitle: "Opened: 12 Feb 2026", uploadedAt: "2026-02-12" },
        { id: "m9", type: "file", title: "Design Patterns", subtitle: "PDF", uploadedAt: "2026-02-12" },
      ],
    },
  ],
  lc2: [
    {
      id: "s1",
      title: "General",
      materials: [
        { id: "m1", type: "announcement", title: "Announcements", uploadedAt: "2026-01-10" },
        { id: "m2", type: "video", title: "Online Class", subtitle: "Tue 24 Feb, 10:00 AM", uploadedAt: "2026-01-10" },
      ],
    },
    {
      id: "s2",
      title: "Introduction",
      materials: [
        { id: "m3", type: "file", title: "Introduction to Networks", subtitle: "PPT", uploadedAt: "2026-01-14" },
      ],
    },
    {
      id: "s3",
      title: "Lecture 2: Network Protocols",
      materials: [
        { id: "m4", type: "file", title: "Network Protocols Notes", subtitle: "PPT", uploadedAt: "2026-02-03" },
        { id: "m5", type: "quiz", title: "Quiz 1", subtitle: "Opened: 10 Feb 2026", uploadedAt: "2026-02-10" },
      ],
    },
  ],
  lc3: [
    {
      id: "s1",
      title: "General",
      materials: [
        { id: "m1", type: "announcement", title: "Announcements", uploadedAt: "2026-01-10" },
        { id: "m2", type: "video", title: "Online Class", subtitle: "Wed 25 Feb, 2:00 PM", uploadedAt: "2026-01-10" },
      ],
    },
    {
      id: "s2",
      title: "Introduction to SE",
      materials: [
        { id: "m3", type: "file", title: "Software Engineering Fundamentals", subtitle: "PPT", uploadedAt: "2026-01-13" },
      ],
    },
  ],
};