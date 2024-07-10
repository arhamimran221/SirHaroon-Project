import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    text: '',
    number: '',
    password: '',
    gender: '',
    dropdown: 'Select from dropdown',
    file: null,
    acceptTerms: false,
  },
  errors: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export const { setFormData, setErrors } = formSlice.actions;
export default formSlice.reducer;
