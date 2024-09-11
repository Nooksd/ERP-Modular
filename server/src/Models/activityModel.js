import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
    unique: true,
  },
  activities: {
    type: [
      {
        activity: {
          type: String,
          required: true,
        },
        subactivities: {
          type: [String],
          required: true,
        },
      },
    ],
    required: true,
  },
});

activitySchema.statics.isUnique = async function (area) {
  try {
    if (!area) throw new Error("Dados inválidos");

    const areaInDatabase = await this.findOne({ area });

    if (areaInDatabase) return false;
    return true;
  } catch (err) {
    console.log("Erro ao verificar dados", err.message);
    return false;
  }
};

export default mongoose.model("Activity", activitySchema);
