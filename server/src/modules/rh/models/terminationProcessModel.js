import mongoose from "mongoose";

const terminationStepSchema = new mongoose.Schema(
  {
    stepName: {
      type: String,
      enum: [
        "Aviso Prévio",
        "Devolução de Equipamentos",
        "Acertos Financeiros",
        "Baixa eSocial",
      ],
      required: true,
    },
    completed: { type: Boolean, default: false },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedAt: Date,
    notes: String,
  },
  { _id: false }
);

const terminationProcessSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    steps: [terminationStepSchema],
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Completed", "Canceled"],
      default: "Pending",
    },
    terminationDate: { type: Date, required: true },
    reason: {
      type: String,
      enum: ["Resignation", "Dismissal", "Retirement", "EndOfContract"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TerminationProcess", terminationProcessSchema);
