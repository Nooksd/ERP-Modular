import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async () => {
    const { data } = await innovaApi.get("/activity/get-all-activities");
    return data;
  }
);

const activitySlicer = createSlice({
  name: "activity",
  initialState: { activities: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activities = action.payload.activities;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default activitySlicer.reducer;
