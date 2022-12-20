import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openLeft: true,
    openRight: true
}

export const layoutSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        handleOpenLeft: (state) => {
            state.openLeft = !state.openLeft
        },
        handleOpenRight: (state) => {
            state.openRight = !state.openRight
        }
    },
})

export const { handleOpenLeft, handleOpenRight } = layoutSlice.actions;

export default layoutSlice.reducer;