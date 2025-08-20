import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 20,
      immutable: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      immutable: true,
    },
    document: {
      type: [
        {
          filename: String,
          originalName: String,
          mimetype: String,
          size: Number,
          path: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
          isExpired: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: function () {
        return this.status === "enviado";
      },
    },
    requiredDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequiredDocument",
      required: function () {
        return !this.isRequested;
      },
    },
    status: {
      type: String,
      enum: ["vazio", "enviado", "expirado"],
      default: "vazio",
      required: true,
    },
    isRequested: {
      type: Boolean,
      default: false,
      required: true,
      immutable: true,
    },
    expirationTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
