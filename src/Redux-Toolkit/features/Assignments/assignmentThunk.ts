import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ChoiceRequest {
    letter: string;
    text: string;
}

interface QuestionRequest {
    questionText: string;
    correctAnswer: string;
    choices: ChoiceRequest[];
}

interface CreateAssignmentPayload {
    courseId: number;
    subUnitId: number;
    token: string;
    data: {
        title: string;
        description?: string;
        dueDate?: string;
        questions: QuestionRequest[];
    };
}

interface GetAssignmentsBySubUnitPayload {
    courseId: number;
    subUnitId: number;
    token: string;
}

interface GetAssignmentDetailsPayload {
    assignmentId: number;
    token: string;
}

// POST /api/lecturer/courses/{courseId}/sub-units/{subUnitId}/assignments
export const createAssignment = createAsyncThunk(
    "assignment/create",
    async ({ courseId, subUnitId, token, data }: CreateAssignmentPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/assignments`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("create assignment success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create assignment");
            }
            return rejectWithValue("Failed to create assignment");
        }
    }
);

// GET /api/lecturer/courses/{courseId}/sub-units/{subUnitId}/assignments
export const getAssignmentsBySubUnitLecturer = createAsyncThunk(
    "assignment/getBySubUnitLecturer",
    async ({ courseId, subUnitId, token }: GetAssignmentsBySubUnitPayload, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/assignments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get assignments (lecturer) success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch assignments");
            }
            return rejectWithValue("Failed to fetch assignments");
        }
    }
);

// GET /api/student/sub-units/{subUnitId}/assignments
export const getAssignmentsBySubUnitStudent = createAsyncThunk(
    "assignment/getBySubUnitStudent",
    async ({ subUnitId, token }: { subUnitId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/student/sub-units/${subUnitId}/assignments`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get assignments (student) success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch assignments");
            }
            return rejectWithValue("Failed to fetch assignments");
        }
    }
);

// GET /api/student/assignments/{assignmentId}
export const getAssignmentDetails = createAsyncThunk(
    "assignment/getDetails",
    async ({ assignmentId, token }: GetAssignmentDetailsPayload, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/student/assignments/${assignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get assignment details success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch assignment details");
            }
            return rejectWithValue("Failed to fetch assignment details");
        }
    }
);