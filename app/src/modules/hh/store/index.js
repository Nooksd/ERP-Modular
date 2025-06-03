import { configureStore } from "@reduxjs/toolkit";
import worksSlicer from "./slicers/worksSlicer.js";
import activitySlicer from "./slicers/activitySlicer.js";
import fieldRoleSlicer from "./slicers/fieldRoleSlicer.js";
import appUsersSlicer from "./slicers/appUsersSlicer.js";
import employeeSlicer from "./slicers/employeeSlicer.js";
import sliderSlicer from "./slicers/sliderSlicer.js";

const store = configureStore({
  reducer: {
    works: worksSlicer,
    activity: activitySlicer,
    fieldRoles: fieldRoleSlicer,
    appUsers: appUsersSlicer,
    employees: employeeSlicer,
    slider: sliderSlicer,
  },
});

export default store;
