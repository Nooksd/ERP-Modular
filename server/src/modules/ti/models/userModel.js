import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { PermissionLevels } from "../../../utils/permissionLevels.js";

const userSchema = new mongoose.Schema({
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
  isActive: {
    type: Boolean,
    default: true,
  },
  globalPermission: {
    type: Number,
    enum: Object.values(PermissionLevels),
    default: PermissionLevels.NONE,
  },
  modulePermissions: {
    type: [
      {
        module: {
          type: String,
          required: true,
        },
        access: {
          type: Number,
          enum: Object.values(PermissionLevels),
          default: PermissionLevels.NONE,
        },
      },
    ],
    default: [],
  },
});

userSchema.statics.isUnique = async function (email) {
  try {
    if (!email) throw new Error("Dados invalidos");

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
    return await this.findOne({ email })
      .populate({
        path: "employeeId",
        select: "name cpf role",
      })
      .exec();
  } catch (error) {
    throw new Error(`Erro ao buscar usuario: ${error.message}`);
  }
};

userSchema.statics.comparePassword = async function (password, hashedPassword) {
  try {
    if (!password) throw new Error("Senha invalida");
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  } catch (err) {
    console.log("Erro ao verificar senha ", err.message);
    return false;
  }
};

export default mongoose.model("User", userSchema);
