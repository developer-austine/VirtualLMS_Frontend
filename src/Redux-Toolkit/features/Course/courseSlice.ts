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
}

interface CourseState {
    courses: CourseDto[];
    myCourses: CourseDto[];
    enrolledStudents: StudentDto[];
    selectedCourse: CourseDto | null;
    courseLecturers: LecturerDto[];
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    myCourses: [],
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
            // Create Course
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get All Courses
            .addCase(getAllCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get Course By ID
            .addCase(getCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get My Courses (admin)
            .addCase(getMyCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.myCourses = action.payload;
            })
            .addCase(getMyCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Assign Lecturer to Course
            .addCase(assignLecturerToCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignLecturerToCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
                // Update in courses list if present
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })
            .addCase(assignLecturerToCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Remove Lecturer from Course
            .addCase(removeLecturerFromCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeLecturerFromCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCourse = action.payload;
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })
            .addCase(removeLecturerFromCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get Courses by Lecturer
            .addCase(getCoursesByLecturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCoursesByLecturer.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getCoursesByLecturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get Lecturers by Course
            .addCase(getLecturersByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLecturersByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseLecturers = action.payload;
            })
            .addCase(getLecturersByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // ── Get Enrolled Students (Lecturer)
            .addCase(getEnrolledStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEnrolledStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.enrolledStudents = action.payload;
            })
            .addCase(getEnrolledStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { clearCourseState, clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;