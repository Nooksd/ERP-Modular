import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const fetchEmployees = createAsyncThunk(
  "employee/fetch-employees",
  async () => {
    const { data } = await innovaApi.get("/employee/get-all");
    return data;
  }
);

const employeeSlicer = createSlice({
  name: "employees",
  initialState: { employees: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload.employees;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeeSlicer.reducer;
