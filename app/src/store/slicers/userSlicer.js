import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const loginUser = createAsyncThunk(
  "user/login",
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const response = await innovaApi.post("/user/login", loginCredentials);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await innovaApi.post("/user/refresh-token");

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const setUserFromStorage = createAsyncThunk(
  "user/setUserSaved",
  async (_, { rejectWithValue }) => {
    try {
      const response = await innovaApi.get("/user/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlicer = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.user = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(setUserFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(setUserFromStorage.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logoutUser } = userSlicer.actions;
export default userSlicer.reducer;
