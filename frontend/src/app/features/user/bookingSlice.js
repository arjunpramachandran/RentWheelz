import { createSlice } from "@reduxjs/toolkit";


let initialBooking = {};
const initialState = {
    bookingData: initialBooking,
}
export const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        savedBooking: (state, action) => {
         
            state.bookingData = action.payload
          
            
            localStorage.setItem("bookingData", JSON.stringify(action.payload));
             
        }
    }

})

export const { savedBooking} = bookingSlice.actions

export default bookingSlice.reducer