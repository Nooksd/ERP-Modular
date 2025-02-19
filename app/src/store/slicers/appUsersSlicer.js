import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const fetchAppUsers = createAsyncThunk(
  "users/fetchAppUsers",
  async () => {
    const { data } = await innovaApi.get("/user/get-all");
    return data;
  }
);

const appUsersSlicer = createSlice({
  name: "appUsers",
  initialState: { appUsers: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.appUsers = action.payload.users;
      })
      .addCase(fetchAppUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default appUsersSlicer.reducer;
