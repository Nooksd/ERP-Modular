import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlicer.js";
import themeReducer from "./slicers/themeSlicer.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});

export default store;
