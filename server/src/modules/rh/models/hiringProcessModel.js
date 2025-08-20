import mongoose from "mongoose";

const hiringStepSchema = new mongoose.Schema(
  {
    stepName: {
      type: String,
      enum: [
        "Cadastro de Funcionário",
        "Documentação",
        "Cadastro eSocial",
        "Exames Médicos",
        "Integração",
      ],
      required: true,
    },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
);

const hiringProcessSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    steps: [hiringStepSchema],
    modality: {
      type: String,
      enum: ["CLT", "PJ", "Estágio", "Aprendiz", "Temporário"],
      required: true,
    },
    status: {
      type: String,
      enum: ["andamento", "completo", "cancelado"],
      default: "andamento",
    },
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("HiringProcess", hiringProcessSchema);
