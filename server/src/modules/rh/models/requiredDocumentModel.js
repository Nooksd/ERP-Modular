import mongoose from "mongoose";

const requiredDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 30,
    },
    requiredFor: {
      type: [
        {
          type: String,
          enum: ["CLT", "PJ", "Estágio", "Aprendiz", "Temporário"],
          required: true,
        },
      ],
      required: true,
    },
    expirationTime: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

requiredDocumentSchema.index({ isActive: 1 });
requiredDocumentSchema.index({ title: 1 });
requiredDocumentSchema.index({ requiredFor: 1 });

export default mongoose.model("RequiredDocument", requiredDocumentSchema);
