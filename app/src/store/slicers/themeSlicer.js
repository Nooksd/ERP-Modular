import { createSlice } from "@reduxjs/toolkit";

const themeSlicer = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlicer.actions;
export default themeSlicer.reducer;
