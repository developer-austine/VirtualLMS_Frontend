import { createSlice } from "@reduxjs/toolkit";
import {
    createLecturer,
    getAllLecturersAdmin,
    getLecturerByIdAdmin,
    deleteLecturer,
    updateLecturerBranches,
    addLecturerToBranch,
    removeLecturerFromBranch,
    createStudent,
    getAllStudentsAdmin,
    getStudentByIdAdmin,
    deleteStudent,
} from "./adminThunk";

interface BranchDto {
    id: number;
    name: string;
}

interface LecturerDto {
    id: number;
    fullName: string;
    email: string;
    branches: BranchDto[];
    createdAt: string;
    updatedAt: string;
}

interface StudentDto {
    id: number;
    fullName: string;
    email: string;
    branch: BranchDto;
    createdAt: string;
    updatedAt: string;
}

interface AdminState {
    lecturers: LecturerDto[];
    selectedLecturer: LecturerDto | null;
    students: StudentDto[];
    selectedStudent: StudentDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    lecturers: [],
    selectedLecturer: null,
    students: [],
    selectedStudent: null,
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.lecturers = [];
            state.selectedLecturer = null;
            state.students = [];
            state.selectedStudent = null;
            state.error = null;
        },
        clearAdminError: (state) => {
            state.error = null;
        },
        clearSelectedLecturer: (state) => {
            state.selectedLecturer = null;
        },
        clearSelectedStudent: (state) => {
            state.selectedStudent = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create Lecturer
            .addCase(createLecturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLecturer.fulfilled, (state, action) => {
                state.loading = false;
                state.lecturers.push(action.payload);
            })
            .addCase(createLecturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get All Lecturers
            .addCase(getAllLecturersAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllLecturersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.lecturers = action.payload;
            })
            .addCase(getAllLecturersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Lecturer By ID
            .addCase(getLecturerByIdAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLecturerByIdAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLecturer = action.payload;
            })
            .addCase(getLecturerByIdAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete Lecturer
            .addCase(deleteLecturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLecturer.fulfilled, (state, action) => {
                state.loading = false;
                state.lecturers = state.lecturers.filter(
                    l => l.id !== action.payload
                );
                if (state.selectedLecturer?.id === action.payload) {
                    state.selectedLecturer = null;
                }
            })
            .addCase(deleteLecturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update Lecturer Branches
            .addCase(updateLecturerBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLecturerBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLecturer = action.payload;
                const index = state.lecturers.findIndex(l => l.id === action.payload.id);
                if (index !== -1) state.lecturers[index] = action.payload;
            })
            .addCase(updateLecturerBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Add Lecturer To Branch
            .addCase(addLecturerToBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addLecturerToBranch.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse — extract .data (LecturerDto)
                const updated = action.payload.data;
                state.selectedLecturer = updated;
                const index = state.lecturers.findIndex(l => l.id === updated.id);
                if (index !== -1) state.lecturers[index] = updated;
            })
            .addCase(addLecturerToBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Remove Lecturer From Branch
            .addCase(removeLecturerFromBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeLecturerFromBranch.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                state.selectedLecturer = updated;
                const index = state.lecturers.findIndex(l => l.id === updated.id);
                if (index !== -1) state.lecturers[index] = updated;
            })
            .addCase(removeLecturerFromBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Create Student
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students.push(action.payload);
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get All Students
            .addCase(getAllStudentsAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllStudentsAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(getAllStudentsAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Student By ID
            .addCase(getStudentByIdAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentByIdAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStudent = action.payload;
            })
            .addCase(getStudentByIdAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete Student
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter(
                    s => s.id !== action.payload
                );
                if (state.selectedStudent?.id === action.payload) {
                    state.selectedStudent = null;
                }
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearAdminState,
    clearAdminError,
    clearSelectedLecturer,
    clearSelectedStudent,
} = adminSlice.actions;

export default adminSlice.reducer;