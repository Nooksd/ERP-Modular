import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  sector: {
    type: String,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  additives: {
    type: [
      {
        additive: {
          type: String,
          required: true,
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100,
          default: 30,
          required: true,
        },
      },
    ],
  },
  isField: {
    type: Boolean,
    default: false,
    required: true,
  },
});

roleSchema.statics.isUnique = async function (role) {
  try {
    if (!role) throw new Error("Dados inválidos");

    const roleInDatabase = await this.findOne({ role });

    if (roleInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

export default mongoose.model("Role", roleSchema);
