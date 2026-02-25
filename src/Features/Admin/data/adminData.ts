export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  regNumber?: string;
  staffId?: string;
  department?: string;
  status: "active" | "inactive";
  lastLogin: string;
  joinedAt: string;
  avatar: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  role: "student" | "lecturer" | "admin";
  loginAt: string;
  device: string;
  status: "success" | "failed";
}

export interface SystemReport {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  activeUsers: number;
  loginsToday: number;
  submissionsThisWeek: number;
  quizzesCompleted: number;
  notesPublished: number;
}

// ── Users ─────────────────────────────────────
export const systemUsers: SystemUser[] = [
  {
    id: "s1", name: "Austine Alex", email: "student@kcau.ac.ke",
    role: "student", regNumber: "SKL/2021/001", status: "active",
    lastLogin: "25 Feb 2026, 10:30 AM", joinedAt: "Jan 2021", avatar: "AA",
  },
  {
    id: "s2", name: "Brian Omondi", email: "brian@kcau.ac.ke",
    role: "student", regNumber: "SKL/2021/002", status: "active",
    lastLogin: "24 Feb 2026, 8:15 PM", joinedAt: "Jan 2021", avatar: "BO",
  },
  {
    id: "s3", name: "Carol Wanjiku", email: "carol@kcau.ac.ke",
    role: "student", regNumber: "SKL/2021/003", status: "active",
    lastLogin: "25 Feb 2026, 9:00 AM", joinedAt: "Jan 2021", avatar: "CW",
  },
  {
    id: "s4", name: "David Kipchoge", email: "david@kcau.ac.ke",
    role: "student", regNumber: "SKL/2021/004", status: "inactive",
    lastLogin: "10 Feb 2026, 3:00 PM", joinedAt: "Jan 2021", avatar: "DK",
  },
  {
    id: "s5", name: "Esther Mutua", email: "esther@kcau.ac.ke",
    role: "student", regNumber: "SKL/2021/005", status: "active",
    lastLogin: "25 Feb 2026, 11:45 AM", joinedAt: "Jan 2021", avatar: "EM",
  },
  {
    id: "l1", name: "Jared Maranga", email: "lecturer@kcau.ac.ke",
    role: "lecturer", staffId: "STAFF/2018/042", department: "School of Technology",
    status: "active", lastLogin: "25 Feb 2026, 7:30 AM", joinedAt: "Sep 2018", avatar: "JM",
  },
  {
    id: "l2", name: "John Kimani", email: "john.kimani@kcau.ac.ke",
    role: "lecturer", staffId: "STAFF/2016/018", department: "School of Technology",
    status: "active", lastLogin: "24 Feb 2026, 4:00 PM", joinedAt: "Sep 2016", avatar: "JK",
  },
  {
    id: "l3", name: "Isaac Okola", email: "isaac.okola@kcau.ac.ke",
    role: "lecturer", staffId: "STAFF/2019/031", department: "School of Computing",
    status: "active", lastLogin: "23 Feb 2026, 2:20 PM", joinedAt: "Jan 2019", avatar: "IO",
  },
  {
    id: "a1", name: "Admin User", email: "admin@kcau.ac.ke",
    role: "admin", staffId: "ADMIN/2015/001", status: "active",
    lastLogin: "25 Feb 2026, 6:00 AM", joinedAt: "Jan 2015", avatar: "AD",
  },
];

// ── Login Logs ────────────────────────────────
export const loginLogs: LoginLog[] = [
  { id: "l1", userId: "s1", userName: "Austine Alex",  role: "student",  loginAt: "25 Feb 2026, 10:30 AM", device: "Chrome / Windows",  status: "success" },
  { id: "l2", userId: "l1", userName: "Jared Maranga", role: "lecturer", loginAt: "25 Feb 2026, 7:30 AM",  device: "Firefox / Windows", status: "success" },
  { id: "l3", userId: "s3", userName: "Carol Wanjiku", role: "student",  loginAt: "25 Feb 2026, 9:00 AM",  device: "Chrome / Android",  status: "success" },
  { id: "l4", userId: "s5", userName: "Esther Mutua",  role: "student",  loginAt: "25 Feb 2026, 11:45 AM", device: "Safari / iPhone",   status: "success" },
  { id: "l5", userId: "s2", userName: "Brian Omondi",  role: "student",  loginAt: "24 Feb 2026, 8:15 PM",  device: "Chrome / Windows",  status: "success" },
  { id: "l6", userId: "s4", userName: "David Kipchoge",role: "student",  loginAt: "24 Feb 2026, 3:00 PM",  device: "Chrome / Android",  status: "failed"  },
  { id: "l7", userId: "l2", userName: "John Kimani",   role: "lecturer", loginAt: "24 Feb 2026, 4:00 PM",  device: "Edge / Windows",    status: "success" },
  { id: "l8", userId: "a1", userName: "Admin User",    role: "admin",    loginAt: "25 Feb 2026, 6:00 AM",  device: "Chrome / Windows",  status: "success" },
];

// ── Report stats ──────────────────────────────
export const systemReport: SystemReport = {
  totalStudents: 135,
  totalLecturers: 8,
  totalCourses: 12,
  activeUsers: 89,
  loginsToday: 47,
  submissionsThisWeek: 23,
  quizzesCompleted: 61,
  notesPublished: 14,
};