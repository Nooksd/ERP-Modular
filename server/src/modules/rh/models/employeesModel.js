import mongoose from "mongoose";

const personalDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true, maxlength: 15 },
    birthDate: { type: Date, required: true },
    nationality: { type: String, required: true },
    naturalness: { type: String, required: true },
  },
  { _id: false }
);

const documentsSchema = new mongoose.Schema(
  {
    CPF: { type: String, required: true, unique: true, match: /^\d{11}$/ },
    PIS: { type: String, required: true, unique: true },
    RG: {
      Number: { type: String, required: true, unique: true },
      Emissor: { type: String, required: true },
    },
    CTPS: { type: String, required: true, unique: true },
    CNH: {
      Number: { type: String, required: true },
      Category: { type: String, required: true },
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
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
  },
  { _id: false }
);

const familyMemberSchema = new mongoose.Schema(
  {
    name: String,
    CPF: String,
    birthDate: Date,
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
    pix: { type: String, unique: true, sparse: true },
    vtDiscount: { type: Boolean, default: false },
  },
  { _id: false }
);

const allocationSchema = new mongoose.Schema(
  {
    entryDate: { type: Date, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    makePunches: { type: Boolean, default: true },
    workingCity: { type: String, required: true },
  },
  { _id: false }
);

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
