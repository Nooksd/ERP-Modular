// store/worksSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const fetchUserWorks = createAsyncThunk(
  "works/fetchUserWorks",
  async () => {
    const { data } = await innovaApi.get("/work/get-user-works");
    return data;
  }
);

const worksSlice = createSlice({
  name: "works",
  initialState: { works: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWorks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserWorks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.works = action.payload;
      })
      .addCase(fetchUserWorks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default worksSlice.reducer;
