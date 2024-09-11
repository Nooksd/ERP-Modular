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
          subActivity: {
            type: String,
            required: true,
          },
          workDescription: {
            type: String,
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

export default mongoose.model("HHRecord", hhrecordSchema);
