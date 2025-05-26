import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  pages: [
    {
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
      },
      link: {
        type: String,
        required: function () {
          return this.type === "image";
        },
      },
      settings: {
        type: [
          {
            filter: {
              type: String,
              enum: ["hours", "months"],
            },
          },
        ],
        required: function () {
          return this.type === "work";
        },
      },
    },
  ],
});

export default mongoose.model("Slider", sliderSchema);
