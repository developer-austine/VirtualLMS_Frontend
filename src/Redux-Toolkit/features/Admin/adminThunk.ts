import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateLecturerPayload {
    token: string;
    data: {
        fullName: string;
        email: string;
        password: string;
        branchIds: number[];
    };
}

interface CreateStudentPayload {
    token: string;
    data: {
        fullName: string;
        email: string;
        password: string;
        branchId: number;
    };
}

interface UpdateLecturerBranchesPayload {
    token: string;
    lecturerId: number;
    branchIds: number[];
}

interface LecturerBranchPayload {
    token: string;
    lecturerId: number;
    branchId: number;
}

// POST /api/admin/lecturers
export const createLecturer = createAsyncThunk(
    "admin/createLecturer",
    async ({ token, data }: CreateLecturerPayload, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/admin/lecturers", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("create lecturer success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create lecturer");
            }
            return rejectWithValue("Failed to create lecturer");
        }
    }
);

// GET /api/admin/lecturers
export const getAllLecturersAdmin = createAsyncThunk(
    "admin/getAllLecturers",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/admin/lecturers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get all lecturers success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturers");
            }
            return rejectWithValue("Failed to fetch lecturers");
        }
    }
);

// GET /api/admin/lecturers/{id}
export const getLecturerByIdAdmin = createAsyncThunk(
    "admin/getLecturerById",
    async ({ lecturerId, token }: { lecturerId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/admin/lecturers/${lecturerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get lecturer by id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturer");
            }
            return rejectWithValue("Failed to fetch lecturer");
        }
    }
);

// DELETE /api/admin/delete/lecturers/{id}
export const deleteLecturer = createAsyncThunk(
    "admin/deleteLecturer",
    async ({ lecturerId, token }: { lecturerId: number; token: string }, { rejectWithValue }) => {
        try {
            await api.delete(`/api/admin/delete/lecturers/${lecturerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("delete lecturer success");
            return lecturerId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to delete lecturer");
            }
            return rejectWithValue("Failed to delete lecturer");
        }
    }
);

// PUT /api/admin/lecturers/{lecturerId}/branches
export const updateLecturerBranches = createAsyncThunk(
    "admin/updateLecturerBranches",
    async ({ token, lecturerId, branchIds }: UpdateLecturerBranchesPayload, { rejectWithValue }) => {
        try {
            const res = await api.put(
                `/api/admin/lecturers/${lecturerId}/branches`,
                branchIds,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("update lecturer branches success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to update lecturer branches");
            }
            return rejectWithValue("Failed to update lecturer branches");
        }
    }
);

// POST /api/admin/lecturers/{lecturerId}/branches/{branchId}
export const addLecturerToBranch = createAsyncThunk(
    "admin/addLecturerToBranch",
    async ({ token, lecturerId, branchId }: LecturerBranchPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                `/api/admin/lecturers/${lecturerId}/branches/${branchId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("add lecturer to branch success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to add lecturer to branch");
            }
            return rejectWithValue("Failed to add lecturer to branch");
        }
    }
);

// DELETE /api/admin/lecturers/{lecturerId}/branches/{branchId}
export const removeLecturerFromBranch = createAsyncThunk(
    "admin/removeLecturerFromBranch",
    async ({ token, lecturerId, branchId }: LecturerBranchPayload, { rejectWithValue }) => {
        try {
            const res = await api.delete(
                `/api/admin/lecturers/${lecturerId}/branches/${branchId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("remove lecturer from branch success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to remove lecturer from branch");
            }
            return rejectWithValue("Failed to remove lecturer from branch");
        }
    }
);

// POST /api/admin/students
export const createStudent = createAsyncThunk(
    "admin/createStudent",
    async ({ token, data }: CreateStudentPayload, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/admin/students", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("create student success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create student");
            }
            return rejectWithValue("Failed to create student");
        }
    }
);

// GET /api/admin/students
export const getAllStudentsAdmin = createAsyncThunk(
    "admin/getAllStudents",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/admin/students", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get all students success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch students");
            }
            return rejectWithValue("Failed to fetch students");
        }
    }
);

// GET /api/admin/students/{id}
export const getStudentByIdAdmin = createAsyncThunk(
    "admin/getStudentById",
    async ({ studentId, token }: { studentId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/admin/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get student by id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch student");
            }
            return rejectWithValue("Failed to fetch student");
        }
    }
);

// DELETE /api/admin/students/{id}
export const deleteStudent = createAsyncThunk(
    "admin/deleteStudent",
    async ({ studentId, token }: { studentId: number; token: string }, { rejectWithValue }) => {
        try {
            await api.delete(`/api/admin/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("delete student success");
            return studentId;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to delete student");
            }
            return rejectWithValue("Failed to delete student");
        }
    }
);