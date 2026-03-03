import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/Auth/authSlice"
import userReducer from "./features/User/userSlice"

const globalState = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    }
})

export default globalState;