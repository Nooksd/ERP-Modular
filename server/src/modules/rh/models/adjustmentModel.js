import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    type: {
      type: String,
      enum: ["ajuste", "justificativa"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pendente", "aceita", "negada"],
      default: "pendente",
    },
    adjustmentData: {
      originalPunches: [
        {
          timestamp: Date,
          eventCode: String,
        },
      ],
      newPunches: [
        {
          timestamp: Date,
          eventCode: String,
        },
      ],
    },
    justificationData: {
      date: Date,
      documents: [
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
        },
      ],
      fullDayJustification: {
        type: Boolean,
        default: false,
      },
      justifiedMinutes: {
        type: Number,
        default: 0,
      },
    },
    reviewDate: {
      type: Date,
      default: null,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

adjustmentSchema.index({ employee: 1, status: 1 });
adjustmentSchema.index({ team: 1, status: 1 });
adjustmentSchema.index({ reviewedBy: 1 });
adjustmentSchema.index({ type: 1, status: 1 });
adjustmentSchema.index({ createdAt: 1 });

adjustmentSchema.methods.approve = function (reviewerId, comments = "") {
  this.status = "aceita";
  this.reviewedBy = reviewerId;
  this.reviewDate = new Date();
  this.reviewComments = comments;
};

adjustmentSchema.methods.reject = function (reviewerId, comments) {
  this.status = "negada";
  this.reviewedBy = reviewerId;
  this.reviewDate = new Date();
  this.reviewComments = comments;
};

adjustmentSchema.pre("save", function (next) {
  if (this.type === "ajuste" && !this.adjustmentData) {
    return next(
      new Error("adjustmentData é obrigatório para correções do tipo ajuste")
    );
  }

  if (this.type === "justificativa" && !this.justificationData) {
    return next(
      new Error(
        "justificationData é obrigatório para correções do tipo justificativa"
      )
    );
  }

  if (
    this.type === "justificativa" &&
    this.justificationData.documents.length === 0
  ) {
    return next(new Error("Documentos são obrigatórios para justificativas"));
  }

  next();
});

adjustmentSchema.statics.findPendingForManager = function (managerId) {
  return this.aggregate([
    {
      $match: { status: "pendente" },
    },
    {
      $lookup: {
        from: "teams",
        localField: "team",
        foreignField: "_id",
        as: "teamData",
      },
    },
    {
      $match: {
        "teamData.managers": managerId,
        "teamData.isActive": true,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employeeData",
      },
    },
    {
      $sort: { createdAt: 1 },
    },
  ]);
};

export default mongoose.model("Adjustment", adjustmentSchema);
