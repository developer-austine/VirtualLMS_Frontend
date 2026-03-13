import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AttendancePayload {
    courseId: number;
    token: string;
    data: {
        title: string;
        date: string; // LocalDate as ISO string e.g. "2026-03-03"
        // attendances removed — students self-mark now
    };
}

interface UpdateAttendancePayload {
    sessionId: number;
    token: string;
    data: {
        title: string;
        date: string;
        // attendances removed — students self-mark now
    };
}

// POST /api/lecturer/courses/{courseId}/attendance
export const takeAttendance = createAsyncThunk(
    "attendance/take",
    async ({ courseId, token, data }: AttendancePayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/lecturer/courses/${courseId}/attendance`,
                { title: data.title, date: data.date },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("take attendance success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to take attendance");
            }
            return rejectWithValue("Failed to take attendance");
        }
    }
);

// GET /api/lecturer/courses/{courseId}/attendance
export const getAttendanceSessions = createAsyncThunk(
    "attendance/getSessions",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/courses/${courseId}/attendance`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get attendance sessions success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch attendance sessions");
            }
            return rejectWithValue("Failed to fetch attendance sessions");
        }
    }
);

// GET /api/lecturer/attendance/{sessionId}
export const getAttendanceSessionById = createAsyncThunk(
    "attendance/getSessionById",
    async ({ sessionId, token }: { sessionId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/attendance/${sessionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get attendance session by id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch attendance session");
            }
            return rejectWithValue("Failed to fetch attendance session");
        }
    }
);

// PUT /api/lecturer/attendance/{sessionId}
export const updateAttendance = createAsyncThunk(
    "attendance/update",
    async ({ sessionId, token, data }: UpdateAttendancePayload, { rejectWithValue }) => {
        try {
            const res = await api.put(
                `/api/lecturer/attendance/${sessionId}`,
                { title: data.title, date: data.date },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("update attendance success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to update attendance");
            }
            return rejectWithValue("Failed to update attendance");
        }
    }
);

// DELETE /api/lecturer/attendance/{sessionId}
export const deleteAttendanceSession = createAsyncThunk(
    "attendance/deleteSession",
    async ({ sessionId, token }: { sessionId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.delete(
                `/api/lecturer/attendance/${sessionId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("delete attendance session success", res.data);
            return sessionId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to delete attendance session");
            }
            return rejectWithValue("Failed to delete attendance session");
        }
    }
);