import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import bookingReducer from './features/user/bookingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking:bookingReducer
  },
})