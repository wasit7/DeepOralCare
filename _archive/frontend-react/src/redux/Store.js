import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/SearchSlice';
import layoutReducer from './layout/LayoutSlice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        layout: layoutReducer
    },
})