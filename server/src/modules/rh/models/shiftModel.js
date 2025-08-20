import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    type: {
      type: String,
      enum: ["Semanal", "12h/36h", "24h/72h", "5d/1d", "Intermitente"],
      required: true,
    },
    DSR: {
      type: String,
      required: true,
    },
    ignoreHolidays: {
      type: Boolean,
      default: false,
    },
    ignoreVacation: {
      type: Boolean,
      default: false,
    },
    flexibleShift: {
      type: Boolean,
      default: false,
    },
    flexibleShiftBreak: {
      type: Boolean,
      default: false,
    },
    shift: {
      type: [
        {
          day: {
            type: String,
            required: true,
          },
          entry1: { type: String, required: true },
          exit1: { type: String, required: true },
          entry2: { type: String, required: true },
          exit2: { type: String, required: true },
          shiftEnd: { type: String, required: true },
          overtimeLimit: { type: String, default: "02:00", required: true },
          onlyOvertime1: { type: Boolean, default: false },
          onlyOvertime2: { type: Boolean, default: false },
        },
      ],
      required: true,
    },
    workOnHolidays: {
      type: Boolean,
      default: false,
    },
    overtimeOnHolidays: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

shiftSchema.index({ title: 1 });
shiftSchema.index({ type: 1 });

export default mongoose.model("Shift", shiftSchema);
