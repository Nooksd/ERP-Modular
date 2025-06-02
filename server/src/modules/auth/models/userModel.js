import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    console.log(await this.findOne({ email }).exec());
    return await this.findOne({ email }).exec();
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
