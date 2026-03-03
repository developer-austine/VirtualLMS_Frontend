import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateCoursePayload {
    token: string;
    data: {
        courseName: string;
        semester: string;
        description?: string;
        courseCode?: string;
        creditHours?: number;
    };
}

interface AssignLecturerPayload {
    token: string;
    courseId: number;
    lecturerId: number;
}

export const createCourse = createAsyncThunk(
    "course/create",
    async ({ token, data }: CreateCoursePayload, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/admin/courses", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("create course success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to create course");
            }
            return rejectWithValue("Failed to create course");
        }
    }
);

export const getAllCourses = createAsyncThunk(
    "course/getAll",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/admin/courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get all courses success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
            }
            return rejectWithValue("Failed to fetch courses");
        }
    }
);

export const getCourseById = createAsyncThunk(
    "course/getById",
    async ({ token, courseId }: { token: string; courseId: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/admin/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get course by id success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch course");
            }
            return rejectWithValue("Failed to fetch course");
        }
    }
);

export const getMyCourses = createAsyncThunk(
    "course/getMyCourses",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/admin/my-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get my courses success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch my courses");
            }
            return rejectWithValue("Failed to fetch my courses");
        }
    }
);

// GET /api/lecturer/courses/{courseId}/students
export const getEnrolledStudents = createAsyncThunk(
    "course/getEnrolledStudents",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/lecturer/courses/${courseId}/students`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("get enrolled students success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch enrolled students");
            }
            return rejectWithValue("Failed to fetch enrolled students");
        }
    }
);

export const assignLecturerToCourse = createAsyncThunk(
    "course/assignLecturer",
    async ({ token, courseId, lecturerId }: AssignLecturerPayload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/api/admin/courses/assign-lecturer",
                { courseId, lecturerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("assign lecturer success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to assign lecturer");
            }
            return rejectWithValue("Failed to assign lecturer");
        }
    }
);

export const removeLecturerFromCourse = createAsyncThunk(
    "course/removeLecturer",
    async ({ token, courseId, lecturerId }: AssignLecturerPayload, { rejectWithValue }) => {
        try {
            const res = await api.delete("/api/admin/courses/remove-lecturer", {
                headers: { Authorization: `Bearer ${token}` },
                data: { courseId, lecturerId }
            });
            console.log("remove lecturer success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to remove lecturer");
            }
            return rejectWithValue("Failed to remove lecturer");
        }
    }
);

export const getCoursesByLecturer = createAsyncThunk(
    "course/getByLecturer",
    async ({ token, lecturerId }: { token: string; lecturerId: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/admin/lecturers/${lecturerId}/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get courses by lecturer success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch lecturer courses");
            }
            return rejectWithValue("Failed to fetch lecturer courses");
        }
    }
);

export const getLecturersByCourse = createAsyncThunk(
    "course/getLecturers",
    async ({ token, courseId }: { token: string; courseId: number }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/admin/courses/${courseId}/lecturers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get lecturers by course success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch course lecturers");
            }
            return rejectWithValue("Failed to fetch course lecturers");
        }
    }
);