export interface AssignmentFile {
  name: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  openedAt: string;
  dueAt: string;
  description: string;
  attachments: AssignmentFile[];
  maxFileSize: string;
  maxFiles: number;
  submissionStatus: "not_submitted" | "submitted" | "graded";
  gradingStatus: "not_graded" | "graded";
  grade?: string;
  timeRemaining: string;
  lastModified?: string;
}

export const assignmentsData: Record<string, Assignment> = {
  "asn1": {
    id: "asn1",
    title: "Assignment 1",
    courseId: "1",
    courseName: "CPP 3202: Advanced Java Programming",
    openedAt: "Sunday, 1 February 2026, 12:00 AM",
    dueAt: "Sunday, 8 February 2026, 12:00 AM",
    description: "This assignment covers Java GUI development using Swing and AWT. You are required to build a simple desktop application with at least three interactive components demonstrating event-driven programming.",
    attachments: [
      { name: "Java_Assignment_1_Instructions.pdf", uploadedAt: "1 February 2026, 9:00 AM" },
    ],
    maxFileSize: "250 MB",
    maxFiles: 20,
    submissionStatus: "not_submitted",
    gradingStatus: "not_graded",
    timeRemaining: "Assignment is overdue by: 17 days 12 hours",
    lastModified: undefined,
  },
  "asn2": {
    id: "asn2",
    title: "Assignment 1",
    courseId: "2",
    courseName: "CPP 3204: Network Programming",
    openedAt: "Sunday, 1 February 2026, 12:00 AM",
    dueAt: "Sunday, 8 February 2026, 12:00 AM",
    description: "This assignment covers socket programming. Implement a client-server chat application using Java TCP sockets. The server should handle multiple clients concurrently using threads.",
    attachments: [],
    maxFileSize: "250 MB",
    maxFiles: 20,
    submissionStatus: "not_submitted",
    gradingStatus: "not_graded",
    timeRemaining: "Assignment is overdue by: 17 days 12 hours",
    lastModified: undefined,
  },
  "mat-asn1": {
    id: "mat-asn1",
    title: "ASSIGNMENT ONE",
    courseId: "6",
    courseName: "MAT 3201: Linear Programming",
    openedAt: "Sunday, 1 February 2026, 12:00 AM",
    dueAt: "Sunday, 8 February 2026, 12:00 AM",
    description: "THIS IS AN ASSIGNMENT ON FEASIBLE SOLUTIONS AND BASIC FEASIBLE SOLUTIONS/OPTIMAL SOLUTIONS",
    attachments: [
      { name: "LINEAR PROGRAMMING ASSIGNMENT ONE. (1).docx", uploadedAt: "1 February 2026, 2:09 PM" },
    ],
    maxFileSize: "250 MB",
    maxFiles: 20,
    submissionStatus: "not_submitted",
    gradingStatus: "not_graded",
    timeRemaining: "Assignment is overdue by: 17 days 12 hours",
    lastModified: undefined,
  },
};