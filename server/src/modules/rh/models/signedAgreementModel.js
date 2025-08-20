import mongoose from "mongoose";

const signedAgreementSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    agreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement",
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    isSigned: {
      type: Boolean,
      default: false,
      required: true,
    },
    signedAt: {
      type: Date,
      required: () => this.isSigned,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

signedAgreementSchema.index({ employee: 1, agreement: 1 }, { unique: true });

export default mongoose.model("SignedAgreement", signedAgreementSchema);
