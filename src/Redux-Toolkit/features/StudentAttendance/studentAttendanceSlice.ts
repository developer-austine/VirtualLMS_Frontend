import { createSlice } from "@reduxjs/toolkit";
import {
    getStudentAttendanceSessions,
    submitStudentAttendance,
} from "./studentAttendanceThunk";

export interface StudentAttendanceRecord {
    recordId: number;
    isPresent: boolean;
    submittedAt: string;
}

export interface AttendanceSessionDto {
    id: number;
    title: string;
    date: string;           
    courseId: number;
    courseName: string;
    lecturerId: number;
    lecturerName: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    myRecord: StudentAttendanceRecord | null;
    createdAt: string;
    updatedAt: string;
}

interface StudentAttendanceState {
    // keyed by courseId so we can cache per course
    sessionsByCourse: Record<number, AttendanceSessionDto[]>;
    loading:    boolean;
    submitting: boolean;
    error:      string | null;
}

const initialState: StudentAttendanceState = {
    sessionsByCourse: {},
    loading:    false,
    submitting: false,
    error:      null,
};

const studentAttendanceSlice = createSlice({
    name: "studentAttendance",
    initialState,
    reducers: {
        clearStudentAttendance(state) {
            state.sessionsByCourse = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudentAttendanceSessions.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(getStudentAttendanceSessions.fulfilled, (state, action) => {
                state.loading = false;
                const { courseId, sessions } = action.payload;
                state.sessionsByCourse[courseId] = sessions;
            })
            .addCase(getStudentAttendanceSessions.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            });

        builder
            .addCase(submitStudentAttendance.pending, (state) => {
                state.submitting = true;
                state.error      = null;
            })
            .addCase(submitStudentAttendance.fulfilled, (state, action) => {
                state.submitting = false;
                const updated: AttendanceSessionDto = action.payload;
                // Update the session in the cache
                const courseId = updated.courseId;
                if (state.sessionsByCourse[courseId]) {
                    state.sessionsByCourse[courseId] = state.sessionsByCourse[courseId]
                        .map(s => s.id === updated.id ? updated : s);
                }
            })
            .addCase(submitStudentAttendance.rejected, (state, action) => {
                state.submitting = false;
                state.error      = action.payload as string;
            });
    },
});

export const { clearStudentAttendance } = studentAttendanceSlice.actions;
export default studentAttendanceSlice.reducer;