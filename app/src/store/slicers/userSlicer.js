import { createSlice } from "@reduxjs/toolkit";

const userSlicer = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    avatar: "",
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.name = "";
      state.email = "";
      state.avatar = "";
      state.role = "";
      state.token = null;
    },
  },
});

export const { setUser, logoutUser } = userSlicer.actions;
export default userSlicer.reducer;
