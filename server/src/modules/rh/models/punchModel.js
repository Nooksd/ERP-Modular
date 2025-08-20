import mongoose from "mongoose";

const punchSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      immutable: true,
    },
    timestamp: {
      type: Date,
      required: true,
      immutable: true,
    },
    eventCode: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7"],
      required: true,
      immutable: true,
    },
    punchType: {
      type: String,
      enum: ["facial", "location", "fingerprint"],
      required: true,
      immutable: true,
    },
    geoLocation: {
      lat: Number,
      lng: Number,
      required: function () {
        return this.punchType === "location";
      },
      immutable: true,
    },
    faceMatch: {
      success: Boolean,
      similarity: Number,
      required: function () {
        return this.punchType === "facial";
      },
    },
    metadata: mongoose.Schema.Types.Mixed,
    processedAt: {
      type: Date,
      default: null,
      immutable: true,
    },
  },
  { timestamps: true }
);

punchSchema.index({ employee: 1, timestamp: 1 });

export default mongoose.model("Punch", punchSchema);
