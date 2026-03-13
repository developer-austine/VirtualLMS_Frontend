import { createSlice } from "@reduxjs/toolkit";
import { submitQuizAttempt, getMyAttempt } from "./attemptThunk";

export interface AttemptDto {
    id: number;
    assignmentId: number;
    assignmentTitle: string;
    studentEmail: string;
    studentName: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    startedAt: string;
    completedAt: string;
}

interface AttemptState {
    attempt:  AttemptDto | null;
    loading:  boolean;
    submitting: boolean;
    error:    string | null;
}

const initialState: AttemptState = {
    attempt:    null,
    loading:    false,
    submitting: false,
    error:      null,
};

const attemptSlice = createSlice({
    name: "attempt",
    initialState,
    reducers: {
        clearAttempt(state) {
            state.attempt  = null;
            state.error    = null;
            state.loading  = false;
            state.submitting = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyAttempt.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(getMyAttempt.fulfilled, (state, action) => {
                state.loading = false;
                state.attempt = action.payload; // null = not attempted yet
            })
            .addCase(getMyAttempt.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload as string;
            });

        builder
            .addCase(submitQuizAttempt.pending, (state) => {
                state.submitting = true;
                state.error      = null;
            })
            .addCase(submitQuizAttempt.fulfilled, (state, action) => {
                state.submitting = false;
                state.attempt    = action.payload;
            })
            .addCase(submitQuizAttempt.rejected, (state, action) => {
                state.submitting = false;
                state.error      = action.payload as string;
            });
    },
});

export const { clearAttempt } = attemptSlice.actions;
export default attemptSlice.reducer;