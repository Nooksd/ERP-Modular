import mongoose from "mongoose";

import User from "./userModel.js";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpf: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      required: true,
    },
    department: {
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
    managerId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

employeeSchema.post("save", async function (doc) {
  try {
    await User.updateMany(
      { employeeId: doc._id },
      { $set: { name: doc.name } }
    );
  } catch (error) {
    console.error("Erro ao atualizar o nome do usuário:", error);
  }
});

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
