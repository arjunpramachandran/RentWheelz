import { createSlice } from '@reduxjs/toolkit'



let initialUser = {};
let isLoggedIn = false;
let authChecked = false;





const initialState = {
    userData: initialUser,
    isLoggedIn: isLoggedIn ,
}

export const userSlice = createSlice({

    name: 'user',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.userData = action.payload
            state.isLoggedIn = true
            state.authChecked = true;
        },
        logoutUser: (state) => {
            
            state.isLoggedIn = false
            state.userData = {}
           state.authChecked = true;
            
        },
        updateUser: (state, action) => {
            state.userData = { ...state.userData, ...action.payload }
        },
    },
})

export const { saveUser, logoutUser, updateUser } = userSlice.actions

export default userSlice.reducer