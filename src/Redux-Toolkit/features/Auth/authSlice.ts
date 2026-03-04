import { createSlice } from "@reduxjs/toolkit";
import { login, signup } from "./authThunk";

interface UserDto {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}

interface AuthState {
    jwt: string | null;
    user: UserDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    // Rehydrate from localStorage on app load
    jwt: localStorage.getItem("jwt"),
    user: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.jwt = null;
            state.user = null;
            state.error = null;
            localStorage.removeItem("jwt");
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                // AuthResponse: { jwt, message, user }
                state.jwt = action.payload.jwt;
                state.user = action.payload.user;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                // AuthResponse: { jwt, message, user }
                state.jwt = action.payload.jwt;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;