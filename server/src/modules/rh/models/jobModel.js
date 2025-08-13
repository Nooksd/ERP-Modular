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
  salary: String,
  period: String,
  tags: [String],
  recruitment: {
    type: [String],
    required: true,
  },
  candidates: {
    type: [
      {
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate",
          immutable: true,
          required: true,
        },
        recruitmentStage: {
          type: String,
          required: true,
        },
        commentary: {
          type: String,
          required: false,
        },
        status: {
          type: String,
          enum: ["aprovado", "reprovado", "pendente"],
          default: "pendente",
          required: true,
        },
        apliedAt: {
          type: Date,
          default: Date.now,
          immutable: true,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
          required: true,
        },
      },
    ],
    required: false,
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
