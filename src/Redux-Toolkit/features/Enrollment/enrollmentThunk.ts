import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET /api/student/courses
export const getAllCoursesStudent = createAsyncThunk(
    "enrollment/getAllCourses",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/student/courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get all courses (student) success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
            }
            return rejectWithValue("Failed to fetch courses");
        }
    }
);

// GET /api/student/courses/available
export const getAvailableCourses = createAsyncThunk(
    "enrollment/getAvailable",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/student/courses/available", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get available courses success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch available courses");
            }
            return rejectWithValue("Failed to fetch available courses");
        }
    }
);

// GET /api/student/my-courses
export const getMyEnrolledCourses = createAsyncThunk(
    "enrollment/getMyCourses",
    async (token: string, { rejectWithValue }) => {
        try {
            const res = await api.get("/api/student/my-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("get my enrolled courses success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to fetch enrolled courses");
            }
            return rejectWithValue("Failed to fetch enrolled courses");
        }
    }
);

// POST /api/student/enrollments
export const enrollInCourse = createAsyncThunk(
    "enrollment/enroll",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/api/student/enrollments",
                { courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("enroll in course success", res.data);
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to enroll in course");
            }
            return rejectWithValue("Failed to enroll in course");
        }
    }
);

// DELETE /api/student/enrollments/{courseId}
export const unenrollFromCourse = createAsyncThunk(
    "enrollment/unenroll",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/api/student/enrollments/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("unenroll from course success", res.data);
            return { courseId, message: res.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to unenroll from course");
            }
            return rejectWithValue("Failed to unenroll from course");
        }
    }
);

// GET /api/student/courses/{courseId}/enrollment-status
export const checkEnrollmentStatus = createAsyncThunk(
    "enrollment/checkStatus",
    async ({ courseId, token }: { courseId: number; token: string }, { rejectWithValue }) => {
        try {
            const res = await api.get(
                `/api/student/courses/${courseId}/enrollment-status`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("check enrollment status success", res.data);
            return { courseId, isEnrolled: res.data.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || "Failed to check enrollment status");
            }
            return rejectWithValue("Failed to check enrollment status");
        }
    }
);