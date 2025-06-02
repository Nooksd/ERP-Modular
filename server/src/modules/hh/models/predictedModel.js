import mongoose from "mongoose";

const predictedSchema = new mongoose.Schema({
  workId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Work",
    unique: true,
    required: true,
  },
  data: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
        activity: {
          type: String,
          required: true,
        },
        subactivity: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        hours: {
          type: Number,
          required: true,
        },
        extras: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
});

export default mongoose.model("Predicted", predictedSchema);
