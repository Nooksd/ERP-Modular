import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["Nacional", "Estadual", "Municipal", "Corporativo", "Ponte"],
      required: true,
    },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

holidaySchema.index({ date: 1 });
holidaySchema.index({ type: 1 });
holidaySchema.index({ isActive: 1 });

holidaySchema.statics.findByDateRange = function (
  startDate,
  endDate,
  filters = {}
) {
  const query = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    isActive: true,
    ...filters,
  };

  return this.find(query).sort({ date: 1 });
};

holidaySchema.statics.isHoliday = function (
  date,
  location = null,
  department = null,
  state = null
) {
  const query = {
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
    },
    isActive: true,
    $or: [
      { type: "Nacional" },
      { "scope.states": state },
      { "scope.locations": location },
      { "scope.departments": department },
    ],
  };

  return this.findOne(query);
};

export default mongoose.model("Holiday", holidaySchema);
