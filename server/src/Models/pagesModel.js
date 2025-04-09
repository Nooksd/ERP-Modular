import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

pageSchema.statics.isUnique = async function (path) {
  try {
    if (!path) throw new Error("Dados inválidos");

    const pathInDatabase = await this.findOne({ path });

    if (pathInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

export default mongoose.model("Page", pageSchema);
