import { createSlice } from "@reduxjs/toolkit";
import {
    createMaterial,
    getMaterialsBySubUnit,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
} from "./materialThunk";

export type MaterialType =
    | "FILE"
    | "VIDEO"
    | "LINK"
    | "ANNOUNCEMENT"
    | "QUIZ"
    | "ASSIGNMENT";

export interface MaterialDto {
    id: number;
    title: string;
    description: string | null;
    url: string | null;
    fileName: string | null;
    fileSize: number | null;
    type: MaterialType;
    orderIndex: number;
    courseId: number;
    courseName: string;
    subUnitId: number;
    subUnitTitle: string;
    createdByLecturerId: number;
    createdByLecturerName: string;
    createdAt: string;
    updatedAt: string;
}

interface MaterialState {
    materials: MaterialDto[];
    selectedMaterial: MaterialDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: MaterialState = {
    materials: [],
    selectedMaterial: null,
    loading: false,
    error: null,
};

const materialSlice = createSlice({
    name: "material",
    initialState,
    reducers: {
        clearMaterialState: (state) => {
            state.materials = [];
            state.selectedMaterial = null;
            state.error = null;
        },
        clearMaterialError: (state) => {
            state.error = null;
        },
        clearSelectedMaterial: (state) => {
            state.selectedMaterial = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Create Material
            .addCase(createMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMaterial.fulfilled, (state, action) => {
                state.loading = false;
                state.materials.push(action.payload);
            })
            .addCase(createMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Materials by SubUnit
            .addCase(getMaterialsBySubUnit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMaterialsBySubUnit.fulfilled, (state, action) => {
                state.loading = false;
                state.materials = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getMaterialsBySubUnit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get Material by ID
            .addCase(getMaterialById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMaterialById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMaterial = action.payload;
            })
            .addCase(getMaterialById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Update Material
            .addCase(updateMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMaterial.fulfilled, (state, action) => {
                state.loading = false;
                // Replace the updated material in the list
                const index = state.materials.findIndex(m => m.id === action.payload.id);
                if (index !== -1) state.materials[index] = action.payload;
                // Also update selectedMaterial if it's the same one
                if (state.selectedMaterial?.id === action.payload.id) {
                    state.selectedMaterial = action.payload;
                }
            })
            .addCase(updateMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Delete Material
            .addCase(deleteMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMaterial.fulfilled, (state, action) => {
                state.loading = false;
                // Remove deleted material from list by ID
                state.materials = state.materials.filter(m => m.id !== action.payload);
                if (state.selectedMaterial?.id === action.payload) {
                    state.selectedMaterial = null;
                }
            })
            .addCase(deleteMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const {
    clearMaterialState,
    clearMaterialError,
    clearSelectedMaterial,
} = materialSlice.actions;

export default materialSlice.reducer;