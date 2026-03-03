import { createSlice } from "@reduxjs/toolkit";
import {
    createAssignment,
    getAssignmentsBySubUnitLecturer,
    getAssignmentsBySubUnitStudent,
    getAssignmentDetails,
} from "./assignmentThunk";

interface ChoiceDto {
    id: number;
    letter: string;
    text: string;
}

interface QuestionDto {
    id: number;
    questionText: string;
    correctAnswer: string;
    choices: ChoiceDto[];
}

interface AssignmentDto {
    id: number;
    title: string;
    description: string;
    questions: QuestionDto[];
    courseId: number;
    courseName: string;
    subUnitId: number;
    subUnitTitle: string;
    createdByLecturerId: number;
    createdByLecturerName: string;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
}

interface AssignmentState {
    assignments: AssignmentDto[];
    selectedAssignment: AssignmentDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: AssignmentState = {
    assignments: [],
    selectedAssignment: null,
    loading: false,
    error: null,
};

const assignmentSlice = createSlice({
    name: "assignment",
    initialState,
    reducers: {
        clearAssignmentState: (state) => {
            state.assignments = [];
            state.selectedAssignment = null;
            state.error = null;
        },
        clearAssignmentError: (state) => {
            state.error = null;
        },
        clearSelectedAssignment: (state) => {
            state.selectedAssignment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create Assignment (Lecturer)
            .addCase(createAssignment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data
                state.assignments.push(action.payload.data);
            })
            .addCase(createAssignment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Assignments by SubUnit (Lecturer)
            .addCase(getAssignmentsBySubUnitLecturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignmentsBySubUnitLecturer.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
            })
            .addCase(getAssignmentsBySubUnitLecturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Assignments by SubUnit (Student)
            .addCase(getAssignmentsBySubUnitStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignmentsBySubUnitStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
            })
            .addCase(getAssignmentsBySubUnitStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Assignment Details (Student)
            .addCase(getAssignmentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignmentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAssignment = action.payload;
            })
            .addCase(getAssignmentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearAssignmentState,
    clearAssignmentError,
    clearSelectedAssignment
} = assignmentSlice.actions;

export default assignmentSlice.reducer;