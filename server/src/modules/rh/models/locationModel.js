import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      enum: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MS",
        "MT",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
    },
    city: { type: String, maxlength: 20 },
    neighborhood: { type: String, maxlength: 30 },
    street: { type: String, maxlength: 30 },
    number: { type: String },
    cep: { type: String, match: /^\d{5}-?\d{3}$/ },
    complement: { type: String, maxlength: 50 },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    type: {
      type: String,
      enum: ["Matriz", "Filial", "Obra", "Home Office", "Cliente", "Terceiro"],
      required: true,
    },
    address: addressSchema,
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

locationSchema.index({ type: 1 });
locationSchema.index({ isActive: 1 });

export default mongoose.model("Location", locationSchema);
