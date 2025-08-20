import mongoose from "mongoose";

const terminationStepSchema = new mongoose.Schema(
  {
    stepName: {
      type: String,
      enum: [
        "Aviso Prévio",
        "Devolução de Equipamentos",
        "Acertos Financeiros",
      ],
      required: true,
    },
    completed: { type: Boolean, default: false },
    completedAt: Date,
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
      enum: ["andamento", "completo", "cancelado"],
      default: "andamento",
    },
    reason: {
      type: String,
      enum: [
        "Pedido de Demissão",
        "Justa Causa",
        "Acordo",
        "Fim de Contrato",
        "Outro",
      ],
      required: true,
    },
    tempoAvisoPrevio: {
      type: Number,
      default: 0,
    },
    comment: String,
    initiatedAt: Date,
    completedAt: Date,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("TerminationProcess", terminationProcessSchema);
