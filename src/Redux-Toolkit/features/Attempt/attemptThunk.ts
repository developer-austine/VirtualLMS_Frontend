import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AnswerRequest {
    questionId: number;
    selectedLetter: string;
}

interface SubmitAttemptPayload {
    assignmentId: number;
    token: string;
    data: {
        startedAt: string;
        answers: AnswerRequest[];
    };
}

// POST /api/student/assignments/{assignmentId}/submit
export const submitQuizAttempt = createAsyncThunk(
    "attempt/submit",
    async ({ assignmentId, token, data }: SubmitAttemptPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/student/assignments/${assignmentId}/submit`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Returns ApiResponse wrapper — extract .data (AttemptDto)
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to submit quiz"
                );
            }
            return rejectWithValue("Failed to submit quiz");
        }
    }
);

// GET /api/student/assignments/{assignmentId}/my-attempt
export const getMyAttempt = createAsyncThunk(
    "attempt/getMyAttempt",
    async (
        { assignmentId, token }: { assignmentId: number; token: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(
                `/api/student/assignments/${assignmentId}/my-attempt`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // 404 means no attempt yet — return null
            return res.data.data ?? null;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null; // Not attempted yet — not an error
            }
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data?.message || "Failed to fetch attempt"
                );
            }
            return rejectWithValue("Failed to fetch attempt");
        }
    }
);