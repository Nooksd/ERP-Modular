import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 30,
  },
  document: {
    filename: String,
    mimetype: String,
    size: Number,
    path: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Agreement", agreementSchema);
