import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openLeft: true,
    openRight: true,
    openBottom: false
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
        },
        handleOpenBottom: (state) => {
            state.openBottom = !state.openBottom
        },
        openBottom: (state) => {
            state.openBottom = true
        }
    },
})

export const { handleOpenLeft, handleOpenRight, handleOpenBottom, openBottom } = layoutSlice.actions;

export default layoutSlice.reducer;