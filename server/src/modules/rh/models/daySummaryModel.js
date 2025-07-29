import mongoose from "mongoose";

const daySummarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
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
  adjustments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adjustment",
    },
  ],
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
  irregular: {
    type: Boolean,
    default: false,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

daySummarySchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("DaySummary", daySummarySchema);
