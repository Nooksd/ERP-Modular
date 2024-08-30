import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const loginUser = createAsyncThunk(
  "user/login",
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const response = await innovaApi.post("/user/login", loginCredentials);

      // Salve tokens no localStorage
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

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
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await innovaApi.post("/user/refresh-token", {
        refreshToken,
      });

      // Atualize o access token
      localStorage.setItem("accessToken", response.data.accessToken);

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

const userSlicer = createSlice({
  name: "user",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logoutUser } = userSlicer.actions;
export default userSlicer.reducer;
