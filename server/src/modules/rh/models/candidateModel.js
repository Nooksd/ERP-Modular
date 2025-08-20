import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    naturalidade: {
      type: String,
      required: true,
    },
    appliedIn: {
      type: {
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
