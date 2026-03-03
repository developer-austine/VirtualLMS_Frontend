import { createSlice } from "@reduxjs/toolkit";
import {
    createBranch,
    getBranchById,
    updateBranch,
    deleteBranch,
    getAllBranches,
} from "./branchThunk";

interface LecturerDto {
    id: number;
    fullName: string;
    email: string;
}

interface StudentDto {
    id: number;
    fullName: string;
    email: string;
}

interface BranchDto {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    workingDays: string[];
    openTime: string;
    closeTime: string;
    lecturers: LecturerDto[];
    students: StudentDto[];
    createdAt: string;
    updatedAt: string;
}

interface BranchState {
    branches: BranchDto[];
    selectedBranch: BranchDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: BranchState = {
    branches: [],
    selectedBranch: null,
    loading: false,
    error: null,
};

const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        clearBranchState: (state) => {
            state.branches = [];
            state.selectedBranch = null;
            state.loading = false;
            state.error = null;
        },
        clearBranchError: (state) => {
            state.error = null;
        },
        clearSelectedBranch: (state) => {
            state.selectedBranch = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create Branch
            .addCase(createBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBranch.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns BranchDTO directly (no ApiResponse wrapper)
                state.branches.push(action.payload);
            })
            .addCase(createBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Branch By ID
            .addCase(getBranchById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBranchById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBranch = action.payload;
            })
            .addCase(getBranchById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update Branch
            .addCase(updateBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.selectedBranch = updated;
                // Sync into branches list if present
                const index = state.branches.findIndex(b => b.id === updated.id);
                if (index !== -1) state.branches[index] = updated;
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete Branch
            .addCase(deleteBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is the branchId we returned
                state.branches = state.branches.filter(b => b.id !== action.payload);
                // Clear selected if it was the deleted one
                if (state.selectedBranch?.id === action.payload) {
                    state.selectedBranch = null;
                }
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // ── Get All Branches
            .addCase(getAllBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
            })
            .addCase(getAllBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const {
    clearBranchState,
    clearBranchError,
    clearSelectedBranch
} = branchSlice.actions;

export default branchSlice.reducer;