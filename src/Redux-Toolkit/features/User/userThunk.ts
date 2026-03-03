import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET /api/users/profile
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

// GET /api/users/{id}
export const getUserById = createAsyncThunk(
    "user/getById",
    async ({ userId, token }: { userId: string; token: string }, { rejectWithValue }) => {
        if (!token) return rejectWithValue("Missing auth token");
        try {
            const res = await api.get(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get user by Id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
            }
            return rejectWithValue("Failed to fetch user");
        }
    }
);

// Logout — clears localStorage only, no API call needed
export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem("jwt");
        } catch (error) {
            return rejectWithValue("Failed to logout");
        }
    }
);