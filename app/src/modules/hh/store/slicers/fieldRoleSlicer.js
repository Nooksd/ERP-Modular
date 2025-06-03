import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "@/services/http";

export const fetchFieldRoles = createAsyncThunk(
  "activity/fetchRoles",
  async () => {
    const { data } = await innovaApi.get("/rh/role/get-all-field-roles");
    return data;
  }
);

const fieldRolesSlicer = createSlice({
  name: "roles",
  initialState: { roles: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFieldRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFieldRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload.roles;
      })
      .addCase(fetchFieldRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default fieldRolesSlicer.reducer;
