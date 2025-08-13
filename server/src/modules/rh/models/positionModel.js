import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    level: {
      type: String,
      enum: [
        "Estagio",
        "Assistente",
        "Analista",
        "Coordenador",
        "Gerênte",
        "Diretor",
      ],
      required: true,
    },
    salaryRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    requirements: {
      education: {
        type: String,
        enum: [
          "Ensino Fundamental",
          "Ensino Médio",
          "Ensino Superior",
          "Pós-graduação",
          "Mestrado",
          "Doutorado",
        ],
      },
      experience: {
        type: String,
        maxlength: 50,
      },
      skills: [String],
    },
    responsibilities: [String],
    requiresPunchClock: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

positionSchema.index({ department: 1 });
positionSchema.index({ level: 1 });
positionSchema.index({ isActive: 1 });

export default mongoose.model("Position", positionSchema);
