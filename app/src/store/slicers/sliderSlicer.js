import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { innovaApi } from "../../services/http";

export const fetchSlider = createAsyncThunk("slider/fetch-slider", async () => {
  const { data } = await innovaApi.get("/slider/");
  return data;
});

export const updateSlider = createAsyncThunk(
  "slider/update",
  async (sliderData) => {
    const { data } = await innovaApi.put("/slider/update", sliderData);
    return data;
  }
);

export const sendImage = createAsyncThunk(
  "slider/send-image",
  async (formData) => {
    const { data } = await innovaApi.post("/slider/send-image", formData);
    return data;
  }
);

const sliderSlicer = createSlice({
  name: "slider",
  initialState: { items: [], link: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlider.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSlider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.slider.items;
      })
      .addCase(fetchSlider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(updateSlider.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.slider.items;
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    builder
      .addCase(sendImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.link = action.payload.fileName;
      })
      .addCase(sendImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default sliderSlicer.reducer;
