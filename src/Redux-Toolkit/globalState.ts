import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/Auth/authSlice"
import userReducer from "./features/User/userSlice"
import courseReducer from "./features/Course/courseSlice"
import subUnitReducer from "./features/subUnit/subunitSlice"
import enrollmentReducer from "./features/Enrollment/enrollmentSlice"
import notesReducer from "./features/Notes/noteSlice"
import attendanceReducer from "./features/Attendance/attendanceSlice"
import branchReducer from "./features/Branch/branchSlice"
import adminReducer from "./features/Admin/adminSlice"

const globalState = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        admin: adminReducer,
        course: courseReducer,
        subUnit: subUnitReducer,
        enrollment: enrollmentReducer,
        notes: notesReducer,
        attendance: attendanceReducer,
        branch: branchReducer,
    }
})

export default globalState;