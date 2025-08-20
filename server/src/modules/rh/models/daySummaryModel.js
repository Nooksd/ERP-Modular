import mongoose from "mongoose";

const daySummarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    punches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Punch",
      },
    ],
    adjustment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adjustment",
    },
    workedMinutes: {
      type: Number,
      default: 0,
    },
    overtimeMinutes: {
      type: Number,
      default: 0,
    },
    missingMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["original", "irregular", "corrected", "calculated"],
      default: "original",
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

daySummarySchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("DaySummary", daySummarySchema);
