import { createSlice } from "@reduxjs/toolkit";
import {
    createSubUnit,
    getSubUnitsByCourse,
    getSubUnitsByCourseStudent,
} from "./subunitThunk";

interface SubUnitDto {
    id: number;
    title: string;
    description: string;
    courseId: number;
    courseName: string;
    createdByLecturerId: number;
    createdByLecturerName: string;
    createdAt: string;
    updatedAt: string;
}

interface SubUnitState {
    subUnits: SubUnitDto[];
    loading: boolean;
    error: string | null;
}

const initialState: SubUnitState = {
    subUnits: [],
    loading: false,
    error: null,
};

const subUnitSlice = createSlice({
    name: "subUnit",
    initialState,
    reducers: {
        clearSubUnitState: (state) => {
            state.subUnits = [];
            state.error = null;
        },
        clearSubUnitError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Create SubUnit (Lecturer)
            .addCase(createSubUnit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubUnit.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns ApiResponse wrapper — extract .data
                state.subUnits.push(action.payload.data);
            })
            .addCase(createSubUnit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get SubUnits by Course (Lecturer)
            .addCase(getSubUnitsByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubUnitsByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.subUnits = action.payload;
            })
            .addCase(getSubUnitsByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ── Get SubUnits by Course (Student)
            .addCase(getSubUnitsByCourseStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubUnitsByCourseStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.subUnits = action.payload;
            })
            .addCase(getSubUnitsByCourseStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { clearSubUnitState, clearSubUnitError } = subUnitSlice.actions;
export default subUnitSlice.reducer;