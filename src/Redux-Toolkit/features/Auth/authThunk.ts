import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signup = createAsyncThunk(
    "auth/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/signup", userData);
            localStorage.setItem("jwt", res.data.data.jwt);
            console.log("signup success", res.data);
            return res.data;
        } catch (error) {
            console.log("signup error", error);
            //check if it's an Axios error first
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Signup Failed");
            }
            return rejectWithValue("Signup Failed");
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/login", loginData);
            localStorage.setItem("jwt", res.data.data.jwt);
            console.log("login success", res.data);
            return res.data;
        } catch (error) {
            console.log("login error", error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Login Failed");
            }
            return rejectWithValue("Login Failed");
        }
    }
);