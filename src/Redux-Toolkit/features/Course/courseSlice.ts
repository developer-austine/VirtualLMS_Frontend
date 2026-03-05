import { createSlice } from "@reduxjs/toolkit";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    getMyCourses,
    assignLecturerToCourse,
    removeLecturerFromCourse,
    getCoursesByLecturer,
    getLecturersByCourse,
    getLecturerCourses,
    getLecturerCourseById,
    getEnrolledStudents,
} from "./courseThunk";

interface AdminDto {
    id: number;
    fullName: string;
    email: string;
}

interface CourseDto {
    id: number;
    courseName: string;
    semester: string;
    description: string;
    courseCode: string;
    creditHours: number;
    status: string;
    createdBy: AdminDto;
    totalEnrolledStudents: number;
    isEnrolled: boolean;
    createdAt: string;
    updatedAt: string;
    lastModifiedAt: string;
}

interface LecturerDto {
    id: number;
    fullName: string;
    email: string;
}

interface StudentDto {
    id: number;
    fullName: string;
    email: string;
    regNumber?: string;
    attendancePercentage?: number;
    enrolledAt?: string;
}

interface CourseState {
    courses: CourseDto[];
    myCourses: CourseDto[];
    lecturerCourses: CourseDto[];
    selectedCourse: CourseDto | null;
    courseLecturers: LecturerDto[];
    enrolledStudents: StudentDto[];
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    myCourses: [],
    lecturerCourses: [],
    selectedCourse: null,
    courseLecturers: [],
    enrolledStudents: [],
    loading: false,
    error: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        clearCourseState: (state) => {
            state.courses = [];
            state.myCourses = [];
            state.lecturerCourses = [];
            state.selectedCourse = null;
            state.courseLecturers = [];
            state.enrolledStudents = [];
            state.error = null;
        },
        clearCourseError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create Course
            .addCase(createCourse.pending,    (state) => { state.loading = true;  state.error = null; })
            .addCase(createCourse.fulfilled,  (state, action) => { state.loading = false; state.courses.push(action.payload); })
            .addCase(createCourse.rejected,   (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get All Courses (Admin) 
            .addCase(getAllCourses.pending,    (state) => { state.loading = true;  state.error = null; })
            .addCase(getAllCourses.fulfilled,  (state, action) => { state.loading = false; state.courses = action.payload; })
            .addCase(getAllCourses.rejected,   (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Course By ID (Admin)
            .addCase(getCourseById.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(getCourseById.fulfilled, (state, action) => { state.loading = false; state.selectedCourse = action.payload; })
            .addCase(getCourseById.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get My Courses (Admin — /api/admin/my-courses) ────────────
            .addCase(getMyCourses.pending,    (state) => { state.loading = true;  state.error = null; })
            .addCase(getMyCourses.fulfilled,  (state, action) => { state.loading = false; state.myCourses = action.payload; })
            .addCase(getMyCourses.rejected,   (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Lecturer Courses (/api/lecturer/courses) ← THE FIX ────
            .addCase(getLecturerCourses.pending,    (state) => { state.loading = true;  state.error = null; })
            .addCase(getLecturerCourses.fulfilled,  (state, action) => {
                state.loading = false;
                state.lecturerCourses = action.payload;
                // Also populate myCourses so existing components don't break
                state.myCourses = action.payload;
            })
            .addCase(getLecturerCourses.rejected,   (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Lecturer Course By ID (/api/lecturer/courses/{id}) ────
            .addCase(getLecturerCourseById.pending,    (state) => { state.loading = true;  state.error = null; })
            .addCase(getLecturerCourseById.fulfilled,  (state, action) => { state.loading = false; state.selectedCourse = action.payload; })
            .addCase(getLecturerCourseById.rejected,   (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Assign Lecturer 
            .addCase(assignLecturerToCourse.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(assignLecturerToCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })
            .addCase(assignLecturerToCourse.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Remove Lecturer
            .addCase(removeLecturerFromCourse.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(removeLecturerFromCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })
            .addCase(removeLecturerFromCourse.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Courses by Lecturer (Admin view)
            .addCase(getCoursesByLecturer.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(getCoursesByLecturer.fulfilled, (state, action) => { state.loading = false; state.courses = action.payload; })
            .addCase(getCoursesByLecturer.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Lecturers by Course
            .addCase(getLecturersByCourse.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(getLecturersByCourse.fulfilled, (state, action) => { state.loading = false; state.courseLecturers = action.payload; })
            .addCase(getLecturersByCourse.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })

            // ── Get Enrolled Students (Lecturer) 
            .addCase(getEnrolledStudents.pending,   (state) => { state.loading = true;  state.error = null; })
            .addCase(getEnrolledStudents.fulfilled, (state, action) => { state.loading = false; state.enrolledStudents = action.payload; })
            .addCase(getEnrolledStudents.rejected,  (state, action) => { state.loading = false; state.error = action.payload as string; })
    }
});

export const { clearCourseState, clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;