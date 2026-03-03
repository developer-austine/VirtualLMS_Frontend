import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateBranchPayload {
    token: string;
    data: {
        name: string;
        address?: string;
        phone: string;
        email?: string;
        workingDays?: string[];
        openTime?: string;  // LocalTime as "HH:mm" string
        closeTime?: string;
    };
}

interface UpdateBranchPayload {
    branchId: number;
    token: string;
    data: {
        name: string;
        address?: string;
        phone: string;
        email?: string;
        workingDays?: string[];
        openTime?: string;
        closeTime?: string;
    };
}

// POST /api/admin/branches
export const createBranch = createAsyncThunk(
    "branch/create",
    async ({ token, data }: CreateBranchPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/api/admin/branches",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("create branch success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create branch");
            }
            return rejectWithValue("Failed to create branch");
        }
    }
);

// GET /api/admin/branches/{id}
export const getBranchById = createAsyncThunk(
    "branch/getById",
    async ({ branchId, token }: { branchId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/admin/branches/${branchId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get branch by id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch branch");
            }
            return rejectWithValue("Failed to fetch branch");
        }
    }
);

// PUT /api/admin/branches/{id}
export const updateBranch = createAsyncThunk(
    "branch/update",
    async ({ branchId, token, data }: UpdateBranchPayload, { rejectWithValue }) => {
        try {
            const res = await api.put(
                `/api/admin/branches/${branchId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("update branch success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to update branch");
            }
            return rejectWithValue("Failed to update branch");
        }
    }
);

// DELETE /api/admin/branches/{id}
export const deleteBranch = createAsyncThunk(
    "branch/delete",
    async ({ branchId, token }: { branchId: number; token: string }, { rejectWithValue }) => {
        try {
            await api.delete(
                `/api/admin/branches/${branchId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("delete branch success");
            return branchId; // return id to remove from state
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to delete branch");
            }
            return rejectWithValue("Failed to delete branch");
        }
    }
);

// GET /api/admin/branches
export const getAllBranches = createAsyncThunk(
    "branch/getAll",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get(
                "/api/admin/branches",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get all branches success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch branches");
            }
            return rejectWithValue("Failed to fetch branches");
        }
    }
);