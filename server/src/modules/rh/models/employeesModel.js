import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    managerIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

employeeSchema.statics.isUnique = async function (cpf) {
  try {
    if (!cpf) throw new Error("Dados inválidos");

    const cpfInDatabase = await this.findOne({ cpf });

    if (cpfInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

export default mongoose.model("Employee", employeeSchema);
