import { createSlice } from "@reduxjs/toolkit";
import { getUserProfile, getUserById, logout } from "./userThunk";

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

interface UserState {
    userProfile: UserDto | null;
    selectedUser: UserDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userProfile: null,
    selectedUser: null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.userProfile = null;
            state.selectedUser = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.userProfile = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userProfile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(logout.fulfilled, () => initialState)
    }
})

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;