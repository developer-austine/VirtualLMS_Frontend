import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { MaterialType } from "./materialSlice";

interface CreateMaterialPayload {
    courseId: number;
    subUnitId: number;
    token: string;
    data: {
        title: string;
        description?: string;
        url?: string;
        type: MaterialType;
        orderIndex?: number;
    };
    file?: File | null;
}

interface UpdateMaterialPayload {
    materialId: number;
    token: string;
    data: {
        title: string;
        description?: string;
        url?: string;
        orderIndex?: number;
    };
}

// ── POST /api/lecturer/courses/{courseId}/sub-units/{subUnitId}/materials ─────
// Uses multipart/form-data — sends JSON as "data" part + optional file
export const createMaterial = createAsyncThunk(
    "material/create",
    async ({ courseId, subUnitId, token, data, file }: CreateMaterialPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // Send the JSON fields as a Blob with application/json type
            formData.append(
                "data",
                new Blob([JSON.stringify(data)], { type: "application/json" })
            );

            if (file) {
                formData.append("file", file);
            }

            const res = await api.post(
                `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/materials`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("create material success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create material");
            }
            return rejectWithValue("Failed to create material");
        }
    }
);

// ── GET /api/lecturer/courses/{courseId}/sub-units/{subUnitId}/materials
export const getMaterialsBySubUnit = createAsyncThunk(
    "material/getBySubUnit",
    async (
        { courseId, subUnitId, token }: { courseId: number; subUnitId: number; token: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await api.get(
                `/api/lecturer/courses/${courseId}/sub-units/${subUnitId}/materials`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get materials success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch materials");
            }
            return rejectWithValue("Failed to fetch materials");
        }
    }
);

// ── GET /api/lecturer/materials/{materialId}
export const getMaterialById = createAsyncThunk(
    "material/getById",
    async ({ materialId, token }: { materialId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/materials/${materialId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get material by id success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch material");
            }
            return rejectWithValue("Failed to fetch material");
        }
    }
);

// ── PUT /api/lecturer/materials/{materialId}
export const updateMaterial = createAsyncThunk(
    "material/update",
    async ({ materialId, token, data }: UpdateMaterialPayload, { rejectWithValue }) => {
        try {
            const res = await api.put(
                `/api/lecturer/materials/${materialId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("update material success", res.data);
            return res.data.data ?? res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to update material");
            }
            return rejectWithValue("Failed to update material");
        }
    }
);

// ── DELETE /api/lecturer/materials/{materialId}
export const deleteMaterial = createAsyncThunk(
    "material/delete",
    async ({ materialId, token }: { materialId: number; token: string }, { rejectWithValue }) => {
        try {
            await api.delete(
                `/api/lecturer/materials/${materialId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("delete material success", materialId);
            return materialId; // Return ID so slice can remove it from state
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to delete material");
            }
            return rejectWithValue("Failed to delete material");
        }
    }
);