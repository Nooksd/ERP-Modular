import mongoose from "mongoose";

import { addressSchema } from "./locationModel.js";

const personalDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true, maxlength: 15 },
    birthDate: { type: Date, required: true },
    nationality: { type: String, required: true },
    naturalidade: { type: String, required: true },
  },
  { _id: false }
);

const documentsSchema = new mongoose.Schema(
  {
    CPF: { type: String, unique: true, required: true, match: /^\d{11}$/ },
    PIS: String,
    RG: {
      Number: { type: String, required: true, unique: true },
      Emissor: { type: String, required: true },
    },
    CTPS: String,
    CNH: {
      Number: String,
      Category: String,
    },
  },
  { _id: false }
);

const familyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    CPF: { type: String, required: true, match: /^\d{11}$/ },
    birthDate: { type: Date, required: true },
    isDependent: { type: Boolean, default: false },
  },
  { _id: false }
);

const bankDetailsSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    agency: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["Corrente", "Poupança"],
      required: true,
    },
    salaryAdvance: { type: Boolean, default: false },
    pix: { type: String, sparse: true },
    vtDiscount: { type: Boolean, default: false },
  },
  { _id: false }
);

const allocationSchema = new mongoose.Schema(
  {
    salary: { type: Number, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    workingLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
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
      required: true,
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
    entryDate: Date,
    esocial: {
      type: String,
      required: function () {
        return this.modality !== "PJ" && this.isActive;
      },
      immutable: true,
    },
    modality: {
      type: String,
      required: true,
      enum: ["CLT", "PJ", "Estágio", "Aprendiz", "Temporário"],
    },
    personalData: personalDataSchema,
    documents: {
      type: documentsSchema,
    },
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
    changeHistory: [changeHistorySchema],
    status: {
      type: String,
      enum: ["Em contratação", "Ativo", "Em desligamento", "Desligado"],
      default: "Em contratação",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

employeeSchema.index({ modality: 1 });
employeeSchema.index({ "allocation.department": 1 });

export default mongoose.model("Employee", employeeSchema);
