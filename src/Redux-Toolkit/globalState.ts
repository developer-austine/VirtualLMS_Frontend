import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/Auth/authSlice"
import userReducer from "./features/User/userSlice"
import courseReducer from "./features/Course/courseSlice"
import subUnitReducer from "./features/subUnit/subunitSlice"
import enrollmentReducer from "./features/Enrollment/enrollmentSlice"

const globalState = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        course: courseReducer,
        subUnit: subUnitReducer,
        enrollment: enrollmentReducer,
    }
})

export default globalState;