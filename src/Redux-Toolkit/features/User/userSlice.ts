import { createSlice } from "@reduxjs/toolkit"
import { getAllLecturers, getAllStudents, getUserById, getUserProfile, logout } from "./userThunk"

interface UserState {
    userProfile: object | null;
    users: object[];
    students: object[];
    lecturers: object[];
    selectedUser: object | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userProfile: null,
    users: [],
    students: [],
    lecturers: [],
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
            state.users = [];
            state.students = [];
            state.lecturers = [];
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
            .addCase(getAllStudents.fulfilled, (state, action) => {
                state.students = action.payload;
            })
            .addCase(getAllLecturers.fulfilled, (state, action) => {
                state.lecturers = action.payload;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            })
            .addCase(logout.fulfilled, () => initialState)
    }
})

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;