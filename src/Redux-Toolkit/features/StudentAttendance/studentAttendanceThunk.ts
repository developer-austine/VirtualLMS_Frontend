import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET /api/student/courses/{courseId}/attendance
export const getStudentAttendanceSessions = createAsyncThunk(
    "studentAttendance/getSessions",
    async (
        { courseId, token }: { courseId: number; token: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(
                `/api/student/courses/${courseId}/attendance`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Returns ApiResponse wrapper
            return { courseId, sessions: res.data.data ?? res.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to fetch attendance sessions"
                );
            }
            return rejectWithValue("Failed to fetch attendance sessions");
        }
    }
);

// POST /api/student/attendance/{sessionId}/submit
export const submitStudentAttendance = createAsyncThunk(
    "studentAttendance/submit",
    async (
        {
            sessionId,
            isPresent,
            token,
        }: { sessionId: number; isPresent: boolean; token: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.post(
                `/api/student/attendance/${sessionId}/submit`,
                { isPresent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to submit attendance"
                );
            }
            return rejectWithValue("Failed to submit attendance");
        }
    }
);