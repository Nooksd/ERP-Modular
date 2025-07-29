import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  salary: {
    type: String,
    required: false,
  },
  period: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  recruitment: {
    type: [String],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Job", jobSchema);
