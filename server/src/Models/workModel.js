import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    cno: {
      type: Number,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
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

workSchema.statics.isUnique = async function (cno) {
  try {
    if (!cno) throw new Error("Dados inválidos");

    const cnoInDatabase = await this.findOne({ cno });

    if (cnoInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

export default mongoose.model("Work", workSchema);
