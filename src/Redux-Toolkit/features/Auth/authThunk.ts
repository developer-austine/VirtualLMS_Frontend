import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginPayload {
    email: string;
    password: string;
}

interface SignupPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
}

// POST /auth/signup
export const signup = createAsyncThunk(
    "auth/signup",
    async (userData: SignupPayload, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/signup", userData);
            // AuthResponse: { jwt, message, user }
            localStorage.setItem("jwt", res.data.jwt);
            console.log("signup success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Signup Failed");
            }
            return rejectWithValue("Signup Failed");
        }
    }
);

// POST /auth/login
export const login = createAsyncThunk(
    "auth/login",
    async (loginData: LoginPayload, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/login", loginData);
            // AuthResponse: { jwt, message, user }
            localStorage.setItem("jwt", res.data.jwt);
            console.log("login success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Login Failed");
            }
            return rejectWithValue("Login Failed");
        }
    }
);