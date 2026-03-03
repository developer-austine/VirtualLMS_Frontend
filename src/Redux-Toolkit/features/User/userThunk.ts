import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserProfile = createAsyncThunk(
    "user/getProfile",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get user profile success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
            }
            return rejectWithValue("Failed to fetch profile");
        }
    }
);

export const getAllStudents = createAsyncThunk(
    "user/getStudents",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/users/students", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get students success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch students");
            }
            return rejectWithValue("Failed to fetch students");
        }
    }
);

export const getAllLecturers = createAsyncThunk(
    "user/getlecturers",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/users/lecturers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get lecturers success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturers");
            }
            return rejectWithValue("Failed to fetch lecturers");
        }
    }
);

export const getUserById = createAsyncThunk(
    "user/getById",
    async (
        { userId, token }: { userId: string; token: string },
        { rejectWithValue }
    ) => {
        if (!token) return rejectWithValue("Missing auth token");
        try {
            const res = await api.get(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get user by Id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch user By Id");
            }
            return rejectWithValue("Failed to fetch user By Id");
        }
    }
);

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem("jwt");
        } catch (error) {
            console.log("error ", error);
            return rejectWithValue("Failed to logout");
        }
    }
);