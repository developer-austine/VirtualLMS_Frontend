import { createSlice } from "@reduxjs/toolkit";
import {
    takeAttendance,
    getAttendanceSessions,
    getAttendanceSessionById,
    updateAttendance,
    deleteAttendanceSession,
} from "./attendanceThunk";

interface AttendanceRecordDto {
    id: number;
    studentId: number;
    studentName: string;
    studentEmail: string;
    isPresent: boolean;
    notes: string;
}

interface AttendanceSessionDto {
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
    records: AttendanceRecordDto[];
    createdAt: string;
    updatedAt: string;
}

interface AttendanceState {
    sessions: AttendanceSessionDto[];
    selectedSession: AttendanceSessionDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: AttendanceState = {
    sessions: [],
    selectedSession: null,
    loading: false,
    error: null,
};

const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        clearAttendanceState: (state) => {
            state.sessions = [];
            state.selectedSession = null;
            state.error = null;
        },
        clearAttendanceError: (state) => {
            state.error = null;
        },
        clearSelectedSession: (state) => {
            state.selectedSession = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Take Attendance
            .addCase(takeAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(takeAttendance.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data
                state.sessions.push(action.payload.data);
            })
            .addCase(takeAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Attendance Sessions
            .addCase(getAttendanceSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttendanceSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload;
            })
            .addCase(getAttendanceSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Session By ID
            .addCase(getAttendanceSessionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttendanceSessionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSession = action.payload;
            })
            .addCase(getAttendanceSessionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update Attendance
            .addCase(updateAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAttendance.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data
                const updated = action.payload.data;
                state.selectedSession = updated;
                // Sync update into sessions list
                const index = state.sessions.findIndex(s => s.id === updated.id);
                if (index !== -1) state.sessions[index] = updated;
            })
            .addCase(updateAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete Attendance Session
            .addCase(deleteAttendanceSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAttendanceSession.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is the sessionId we returned
                state.sessions = state.sessions.filter(s => s.id !== action.payload);
                // Clear selected if it was the deleted one
                if (state.selectedSession?.id === action.payload) {
                    state.selectedSession = null;
                }
            })
            .addCase(deleteAttendanceSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearAttendanceState,
    clearAttendanceError,
    clearSelectedSession
} = attendanceSlice.actions;

export default attendanceSlice.reducer;