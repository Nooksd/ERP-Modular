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
  async (_, { getState, rejectWithValue }) => {
    const { isAuthenticated } = getState().user;

    if (!isAuthenticated) {
      return rejectWithValue("Usuário não autenticado.");
    }

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
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated === "false") {
      return rejectWithValue("Usuário não autenticado.");
    }

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
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true");
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", "false");
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
        state.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true");
        state.loading = false;
        state.error = null;
      })
      .addCase(setUserFromStorage.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", "false");
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logoutUser } = userSlicer.actions;
export default userSlicer.reducer;
