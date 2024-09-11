import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slicers/userSlicer.js";
import themeReducer from "./slicers/themeSlicer.js";
import worksSlicer from "./slicers/worksSlicer.js";
import activitySlicer from "./slicers/activitySlicer.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    works: worksSlicer,
    activity: activitySlicer,
  },
});

export default store;
