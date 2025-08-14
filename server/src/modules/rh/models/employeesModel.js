import mongoose from "mongoose";

import {
  personalDataSchema,
  documentsSchema,
  addressSchema,
  familyMemberSchema,
  bankDetailsSchema,
  allocationSchema,
} from "./schemas.js";

const employmentStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["incompleto", "ativo", "demitido", "afastado"],
      default: "incompleto",
      required: true,
    },
    terminationDate: Date,
    terminationReason: String,
    terminationNotes: String,
  },
  { _id: false }
);

const changeHistorySchema = new mongoose.Schema(
  {
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, immutable: true },
    lastName: { type: String, required: true, immutable: true },
    registrationNumber: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
    },
    modality: {
      type: String,
      enum: ["CLT", "PJ", "Estágio", "Aprendiz", "Temporário"],
      required: true,
    },
    personalData: personalDataSchema,
    documents: documentsSchema,
    education: {
      degree: {
        type: String,
        enum: [
          "Ensino Fundamental",
          "Ensino Médio",
          "Ensino Superior",
          "Pós-graduação",
          "Mestrado",
          "Doutorado",
        ],
        required: true,
      },
      status: {
        type: String,
        enum: ["Completo", "Incompleto", "Cursando"],
        required: true,
      },
    },
    address: addressSchema,
    family: {
      father: familyMemberSchema,
      mother: familyMemberSchema,
      spouse: familyMemberSchema,
      children: [familyMemberSchema],
    },
    bankDetails: bankDetailsSchema,
    allocation: allocationSchema,
    employmentStatus: employmentStatusSchema,
    changeHistory: [changeHistorySchema],
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
  { timestamps: true, strict: true }
);

employeeSchema.index({ modality: 1 });
employeeSchema.index({ "allocation.department": 1 });

export default mongoose.model("Employee", employeeSchema);
