import mongoose from "mongoose";

import { addressSchema } from "./schemas.js";

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
