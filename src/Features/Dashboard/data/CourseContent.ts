export interface CourseActivity {
  id: string;
  type: "announcement" | "link" | "video" | "file" | "quiz";
  title: string;
  subtitle?: string;
  status?: "done" | "ended" | "open";
  statusLabel?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  activities: CourseActivity[];
}

export interface CourseContent {
  courseId: string;
  fullTitle: string;
  sections: CourseSection[];
}

export const courseContents: CourseContent[] = [
  {
    courseId: "1",
    fullTitle: "CPP 3202:ADVANCED JAVA PROGRAMMING:FT:JARED MARANGA KAMUNYA:TC 1-5:Stream A",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "link", title: "Whatsapp", status: "done", statusLabel: "Done" },
          { id: "a3", type: "video", title: "Online Class", subtitle: "Starts: Thursday, 26 February 2026, 3:00 PM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction",
        activities: [
          { id: "a4", type: "file", title: "Introduction", subtitle: "PPT" },
          { id: "a5", type: "video", title: "Lecture 1: Introduction", subtitle: "Ended: Thursday, 29 January 2026, 7:15 PM", status: "ended" },
        ],
      },
      {
        id: "g3",
        title: "Lecture 2: Advanced Concepts",
        activities: [
          { id: "a6", type: "file", title: "Advanced Java Notes", subtitle: "PPT" },
        ],
      },
      {
        id: "g4",
        title: "Lecture 3: Design Patterns",
        activities: [
          { id: "a7", type: "quiz", title: "Quiz 1", subtitle: "Opened: Thursday, 12 February 2026, 4:50 PM", status: "open" },
          { id: "a8", type: "file", title: "Design Patterns", subtitle: "PDF" },
        ],
      },
    ],
  },
  {
    courseId: "2",
    fullTitle: "CPP 3204:NETWORK PROGRAMMING:FT:JOHN KIMANI:TC 1-5:Stream A",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "link", title: "Whatsapp", status: "done", statusLabel: "Done" },
          { id: "a3", type: "video", title: "Online Class", subtitle: "Starts: Thursday, 26 February 2026, 3:00 PM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction",
        activities: [
          { id: "a4", type: "file", title: "Introduction", subtitle: "PPT" },
          { id: "a5", type: "video", title: "Lecture 1: Introduction", subtitle: "Ended: Thursday, 29 January 2026, 7:15 PM", status: "ended" },
        ],
      },
      {
        id: "g3",
        title: "Lecture 2: Network Protocols",
        activities: [
          { id: "a6", type: "file", title: "Network Protocols Notes", subtitle: "PPT" },
        ],
      },
    ],
  },
  {
    courseId: "3",
    fullTitle: "CPU 3203:MOBILE GAMING PROGRAMMING:FT:MAIN:SAMUEL MUTHEE KAMUNYA:TC 1-5:Stream A",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "link", title: "Whatsapp", status: "done", statusLabel: "Done" },
          { id: "a3", type: "video", title: "Online Class", subtitle: "Starts: Thursday, 26 February 2026, 3:00 PM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction",
        activities: [
          { id: "a4", type: "file", title: "Introduction", subtitle: "PPT" },
          { id: "a5", type: "video", title: "Lecture 1: Introduction", subtitle: "Ended: Thursday, 29 January 2026, 7:15 PM", status: "ended" },
        ],
      },
      {
        id: "g3",
        title: "Lecture 2: Game development analysis",
        activities: [
          { id: "a6", type: "file", title: "Game analysis", subtitle: "PPT" },
        ],
      },
      {
        id: "g4",
        title: "Lecture 3: Game Components and Mechanics",
        activities: [
          { id: "a7", type: "quiz", title: "quiz 1", subtitle: "Opened: Thursday, 12 February 2026, 4:50 PM", status: "open" },
          { id: "a8", type: "file", title: "Components", subtitle: "PDF" },
        ],
      },
    ],
  },
  {
    courseId: "4",
    fullTitle: "ISS 3102:EXPERT SYSTEMS:FT:ISAAC OKOLA:ZOOM:Stream B",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "video", title: "Online Class", subtitle: "Starts: Friday, 27 February 2026, 2:00 PM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction to Expert Systems",
        activities: [
          { id: "a3", type: "file", title: "Introduction", subtitle: "PPT" },
        ],
      },
    ],
  },
  {
    courseId: "5",
    fullTitle: "ISS 4104:DISTRIBUTED SYSTEMS:FT:ERNEST KAYEYIA:TC 1-5:Stream A",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "video", title: "Online Class", subtitle: "Starts: Wednesday, 25 February 2026, 4:00 PM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction",
        activities: [
          { id: "a3", type: "file", title: "Introduction to Distributed Systems", subtitle: "PPT" },
        ],
      },
    ],
  },
  {
    courseId: "6",
    fullTitle: "MAT 3201:LINEAR PROGRAMMING:FT:MAIN:JOHN NGAII:TC 1-5:Stream A",
    sections: [
      {
        id: "g1",
        title: "General",
        activities: [
          { id: "a1", type: "announcement", title: "Announcements" },
          { id: "a2", type: "video", title: "Online Class", subtitle: "Starts: Monday, 23 February 2026, 10:00 AM" },
        ],
      },
      {
        id: "g2",
        title: "Introduction to Linear Programming",
        activities: [
          { id: "a3", type: "file", title: "LP Fundamentals", subtitle: "PPT" },
          { id: "a4", type: "quiz", title: "Quiz 1", subtitle: "Opened: Thursday, 12 February 2026, 4:50 PM", status: "open" },
        ],
      },
    ],
  },
];