import mongoose from "mongoose";

import {
  personalDataSchema,
  documentsSchema,
  addressSchema,
  familyMemberSchema,
  bankDetailsSchema,
  allocationSchema,
} from "./schemas.js";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    registrationNumber: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

employeeSchema.index({ "documents.CPF": 1 });
employeeSchema.index({ modality: 1 });
employeeSchema.index({ "allocation.department": 1 });

export default mongoose.model("Employee", employeeSchema);
