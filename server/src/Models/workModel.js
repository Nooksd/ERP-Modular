import mongoose from "mongoose";

import User from "./userModel.js";

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

workSchema.post('save', async function (doc) {
    try {
      await User.updateMany(
        { _id: { $in: doc.managerIds } },
        { $addToSet: { allowedProjects: doc._id } }
      );
    } catch (error) {
      console.error('Erro ao atualizar allowedProjects dos usuários:', error);
    }
  });

  workSchema.post('remove', async function (doc) {
    try {
      await User.updateMany(
        { _id: { $in: doc.managerIds } },
        { $pull: { allowedProjects: doc._id } }
      );
    } catch (error) {
      console.error('Erro ao remover allowedProjects dos usuários:', error);
    }
  });
  

export default mongoose.model("Work", workSchema);
