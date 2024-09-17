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

hhrecordSchema.statics.getHistoryByProjectId = async function (
  projectId,
  order = true,
  dateFilter = {}
) {
  try {
    if (!projectId) throw new Error("projectId é obrigatório.");

    const matchQuery = {
      projectId: new mongoose.Types.ObjectId(projectId),
    };

    if (Object.keys(dateFilter).length > 0) {
      matchQuery.date = dateFilter;
    }

    const history = await this.aggregate([
      { $match: matchQuery },
      { $unwind: "$hhRecords" },
      {
        $group: {
          _id: "$date",
          activities: { $sum: 1 }, // Contar atividades
          roles: {
            $sum: {
              $sum: "$hhRecords.roles.quantity" // Somar os valores de quantity
            }
          },
          hours: {
            $sum: {
              $reduce: {
                input: "$hhRecords.roles", // Percorrer o array de roles
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    { $multiply: ["$$this.hours", "$$this.quantity"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          activities: 1,
          roles: 1,
          hours: 1,
        },
      },
      {
        $sort: { date: order ? -1 : 1 },
      },
    ]);

    return history;
  } catch (err) {
    console.log("Erro ao buscar histórico de HH", err.message);
    return [];
  }
};

export default mongoose.model("HHRecord", hhrecordSchema);
