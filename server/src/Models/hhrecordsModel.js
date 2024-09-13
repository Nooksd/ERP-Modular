import mongoose from "mongoose";

const hhrecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    hhRecords: {
      type: [
        {
          area: {
            type: String,
            required: true,
          },
          activity: {
            type: String,
            required: true,
          },
          subactivity: {
            type: String,
            required: true,
          },
          workDescription: {
            type: String,
            required: true,
          },
          indicative: {
            type: Number,
            default: "",
          },
          roles: [
            {
              role: {
                type: String,
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                default: 1,
              },
              hours: {
                type: Number,
                required: true,
              },
            },
          ],
        },
      ],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Deve haver pelo menos uma atividade registrada.",
      },
    },
  },
  { timestamps: true }
);

hhrecordSchema.statics.isUnique = async function (projectId, date, hhRecords) {
  try {
    if (!projectId || !date || !hhRecords) throw new Error("Dados inválidos");

    const { area, activity, subActivity } = hhRecords[0];

    const duplicateRecord = await this.findOne({
      projectId,
      date,
      hhRecords: {
        $elemMatch: {
          area,
          activity,
          subActivity,
        },
      },
    });

    return duplicateRecord !== null;
  } catch (err) {
    console.log("Erro ao verificar duplicidade", err.message);
    return false;
  }
};

export default mongoose.model("HHRecord", hhrecordSchema);
