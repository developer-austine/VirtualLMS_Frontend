import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateSubUnitPayload {
    courseId: number;
    token: string;
    data: {
        title: string;
        description?: string;
        orderIndex?: number;
    };
}

// POST /api/lecturer/courses/{courseId}/sub-units
export const createSubUnit = createAsyncThunk(
    "subUnit/create",
    async ({ courseId, token, data }: CreateSubUnitPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/lecturer/courses/${courseId}/sub-units`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("create sub-unit success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create sub-unit");
            }
            return rejectWithValue("Failed to create sub-unit");
        }
    }
);

// GET /api/lecturer/courses/{courseId}/sub-units
export const getSubUnitsByCourse = createAsyncThunk(
    "subUnit/getByCourse",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/courses/${courseId}/sub-units`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get sub-units (lecturer) success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch sub-units");
            }
            return rejectWithValue("Failed to fetch sub-units");
        }
    }
);

// GET /api/student/courses/{courseId}/sub-units
export const getSubUnitsByCourseStudent = createAsyncThunk(
    "subUnit/getByCourseStudent",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/student/courses/${courseId}/sub-units`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get sub-units (student) success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch sub-units");
            }
            return rejectWithValue("Failed to fetch sub-units");
        }
    }
);