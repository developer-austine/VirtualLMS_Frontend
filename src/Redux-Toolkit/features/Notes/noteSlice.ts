import { createSlice } from "@reduxjs/toolkit";
import {
    createNote,
    getNotesBySubUnitLecturer,
    getNotesBySubUnitStudent,
} from "./noteThunk";

interface NotesDto {
    id: number;
    title: string;
    content: string;
    courseId: number;
    courseName: string;
    subUnitId: number;
    subUnitTitle: string;
    createdByLecturerId: number;
    createdByLecturerName: string;
    createdAt: string;
    updatedAt: string;
}

interface NotesState {
    notes: NotesDto[];
    selectedNote: NotesDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: NotesState = {
    notes: [],
    selectedNote: null,
    loading: false,
    error: null,
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        clearNotesState: (state) => {
            state.notes = [];
            state.selectedNote = null;
            state.error = null;
        },
        clearNotesError: (state) => {
            state.error = null;
        },
        clearSelectedNote: (state) => {
            state.selectedNote = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create Note (Lecturer)
            .addCase(createNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data
                state.notes.push(action.payload);
            })
            .addCase(createNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Notes by SubUnit (Lecturer)
            .addCase(getNotesBySubUnitLecturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotesBySubUnitLecturer.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(getNotesBySubUnitLecturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Notes by SubUnit (Student)
            .addCase(getNotesBySubUnitStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotesBySubUnitStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(getNotesBySubUnitStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearNotesState,
    clearNotesError,
    clearSelectedNote
} = notesSlice.actions;

export default notesSlice.reducer;