"use client";

import { configureStore } from '@reduxjs/toolkit';
import formReducer from './FormSlice'; // Adjust the path as needed

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
});
