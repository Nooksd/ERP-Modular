import mongoose from "mongoose";

const sliderItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["work", "image"],
    required: true,
  },
  time: {
    type: Number,
    required: true,
    min: 5,
  },
  link: {
    type: String,
    required: true,
  },
  filter: {
    type: Boolean,
    default: false,
  },
});

const sliderSchema = new mongoose.Schema({
  items: [sliderItemSchema],
});

export default mongoose.model("Slider", sliderSchema);
