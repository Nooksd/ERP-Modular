import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  pages: {
    type: [String],
    default: [],
  },
});

userSchema.statics.isUnique = async function (cpf, email) {
  try {
    if (!email || !cpf) throw new Error("Dados inválidos");

    const emailInDatabase = await this.findOne({ email });
    const cpfInDatabase = await this.findOne({ cpf });

    if (emailInDatabase || cpfInDatabase) return false;
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
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

userSchema.statics.comparePassword = async function (password, hashedPassword) {
  try {
    if (!password) throw new Error("Senha inválida");
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  } catch (err) {
    console.log("Erro ao verificar senha ", err.message);
    return false;
  }
};

export default mongoose.model("User", userSchema);
