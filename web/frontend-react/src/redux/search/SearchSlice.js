import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedKeywords: [],
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addKeyword: (state, action) => {
            state.selectedKeywords = [...state.selectedKeywords, action.payload];
        },
        removeKeyword: (state, action) => {
            let data = state.selectedKeywords.filter(keyword => keyword.id !== action.payload.id);
            state.selectedKeywords = [...data];
        }
    },
})

export const { addKeyword, removeKeyword } = searchSlice.actions;

export default searchSlice.reducer;