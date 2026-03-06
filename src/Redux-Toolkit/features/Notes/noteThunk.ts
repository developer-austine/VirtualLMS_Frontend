import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateNotePayload {
    courseId: number;
    subUnitId: number;
    token: string;
    data: {
        title: string;
        content: string;
    };
}

// POST /api/lecturer/courses/{courseId}/sub-units/{subUnitId}/notes
export const createNote = createAsyncThunk(
    "notes/create",
    async ({ courseId, subUnitId, token, data }: CreateNotePayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/notes`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("create note success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create note");
            }
            return rejectWithValue("Failed to create note");
        }
    }
);

// GET notes by sub-unit (lecturer)
export const getNotesBySubUnitLecturer = createAsyncThunk(
    "notes/getBySubUnitLecturer",
    async (
        { subUnitId, token }: {subUnitId: number; token: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(
                `/api/lecturer/sub-units/${subUnitId}/notes`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get notes (lecturer) success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch notes");
            }
            return rejectWithValue("Failed to fetch notes");
        }
    }
);

// GET /api/student/sub-units/{subUnitId}/notes
export const getNotesBySubUnitStudent = createAsyncThunk(
    "notes/getBySubUnitStudent",
    async ({ subUnitId, token }: { subUnitId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/student/sub-units/${subUnitId}/notes`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get notes (student) success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch notes");
            }
            return rejectWithValue("Failed to fetch notes");
        }
    }
);