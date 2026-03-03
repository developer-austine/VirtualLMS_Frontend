import { createSlice } from "@reduxjs/toolkit";
import { login, signup } from "./authThunk";

interface AuthState {
    user: object | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("jwt");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signup.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
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
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})

export default authSlice.reducer;