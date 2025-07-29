import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  apliedIn: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 15,
  },
  resume: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  salaryExpectation: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Candidate", candidateSchema);
