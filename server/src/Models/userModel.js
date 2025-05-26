import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Employee from "./employeesModel.js";

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://relevium.com.br/wp-content/uploads/2015/09/default-avatar-300x300.png",
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("employeeId")) {
    const employee = await Employee.findById(this.employeeId);
    if (employee) {
      this.name = employee.name;
    }
  }
  next();
});

userSchema.statics.isUnique = async function (email) {
  try {
    if (!email) throw new Error("Dados invÃ¡lidos");

    const emailInDatabase = await this.findOne({ email });

    if (emailInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

userSchema.statics.findByEmail = async function (email) {
  try {
    return await this.findOne({ email }).exec();
  } catch (error) {
    throw new Error(`Erro ao buscar usuÃ¡rio: ${error.message}`);
  }
};

userSchema.statics.comparePassword = async function (password, hashedPassword) {
  try {
    if (!password) throw new Error("Senha invÃ¡lida");
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  } catch (err) {
    console.log("Erro ao verificar senha ", err.message);
    return false;
  }
};

export default mongoose.model("User", userSchema);
