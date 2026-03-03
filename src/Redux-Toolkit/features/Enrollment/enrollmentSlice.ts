import { createSlice } from "@reduxjs/toolkit";
import {
    getAllCoursesStudent,
    getAvailableCourses,
    getMyEnrolledCourses,
    enrollInCourse,
    unenrollFromCourse,
    checkEnrollmentStatus,
} from "./enrollmentThunk";

interface CourseDto {
    id: number;
    courseName: string;
    semester: string;
    description: string;
    courseCode: string;
    creditHours: number;
    status: string;
    totalEnrolledStudents: number;
    isEnrolled: boolean;
    createdAt: string;
    updatedAt: string;
    lastModifiedAt: string;
}

interface EnrollmentState {
    allCourses: CourseDto[];
    availableCourses: CourseDto[];
    enrolledCourses: CourseDto[];
    enrollmentStatus: Record<number, boolean>;
    loading: boolean;
    error: string | null;
}

const initialState: EnrollmentState = {
    allCourses: [],
    availableCourses: [],
    enrolledCourses: [],
    enrollmentStatus: {},
    loading: false,
    error: null,
};

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {
        clearEnrollmentState: (state) => {
            state.allCourses = [];
            state.availableCourses = [];
            state.enrolledCourses = [];
            state.enrollmentStatus = {};
            state.error = null;
        },
        clearEnrollmentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Get All Courses (Student view)
            .addCase(getAllCoursesStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCoursesStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.allCourses = action.payload;
            })
            .addCase(getAllCoursesStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Available Courses
            .addCase(getAvailableCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvailableCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.availableCourses = action.payload;
            })
            .addCase(getAvailableCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get My Enrolled Courses
            .addCase(getMyEnrolledCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyEnrolledCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.enrolledCourses = action.payload;
            })
            .addCase(getMyEnrolledCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Enroll in Course
            .addCase(enrollInCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data (CourseDto)
                const enrolledCourse = action.payload.data;
                state.enrolledCourses.push(enrolledCourse);
                // Remove from available since now enrolled
                state.availableCourses = state.availableCourses.filter(
                    c => c.id !== enrolledCourse.id
                );
                // Update enrollment status map
                state.enrollmentStatus[enrolledCourse.id] = true;
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Unenroll from Course
            .addCase(unenrollFromCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unenrollFromCourse.fulfilled, (state, action) => {
                state.loading = false;
                const { courseId } = action.payload;
                // Remove from enrolled list
                state.enrolledCourses = state.enrolledCourses.filter(
                    c => c.id !== courseId
                );
                // Add back to available list when known
                const course = state.allCourses.find(c => c.id === courseId);
                if (course && !state.availableCourses.some(c => c.id === courseId)) {
                    state.availableCourses.push(course);
                }
                // Update enrollment status map
                state.enrollmentStatus[courseId] = false;
            })
            .addCase(unenrollFromCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Check Enrollment Status
            .addCase(checkEnrollmentStatus.fulfilled, (state, action) => {
                const { courseId, isEnrolled } = action.payload;
                state.enrollmentStatus[courseId] = isEnrolled;
            })
            .addCase(checkEnrollmentStatus.rejected, (state, action) => {
                state.error = action.payload as string;
            })
    }
});

export const { clearEnrollmentState, clearEnrollmentError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;