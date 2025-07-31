import mongoose from "mongoose";

const punchConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Configuração de Ponto",
    required: true,
  },
  tolerance: {
    type: {
      time: {
        type: Number,
        default: 10,
        required: true,
      },
      type: {
        type: String,
        enum: ["singular", "compartilhada"],
        default: "compartilhada",
        required: true,
      },
      compensate: {
        type: Boolean,
        default: false,
        required: true,
      },
      validForIntervals: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    required: true,
  },
  overtime: {
    type: {
      overtime1: {
        type: Number,
        default: 50,
        max: 500,
        min: 0,
        required: true,
      },
      overtime2: {
        type: Number,
        default: 100,
        max: 500,
        min: 0,
        required: true,
      },
    },
    required: true,
  },
  comptime: {
    type: {
      active: {
        type: Boolean,
        default: false,
        required: true,
      },
      interjornada: {
        type: Boolean,
        default: false,
        required: true,
      },
      startDate: {
        type: Date,
        default: null,
        required: true,
      },
      multiplyFactor1: {
        type: Number,
        default: 1,
        required: true,
      },
      multiplyFactor2: {
        type: Number,
        default: 2,
        required: true,
      },
      ignoreMultiplyFactor2: {
        type: Boolean,
        default: false,
        required: true,
      },
      vigencia: {
        type: Number,
        default: 12,
        required: true,
      },
      positiveLimit: {
        type: Number,
        default: 0,
        required: true,
      },
      negativeLimit: {
        type: Number,
        default: 0,
        required: true,
      },
      distributePositive: {
        type: {
          active: {
            type: Boolean,
            default: false,
            required: true,
          },
          comptimePercentage: {
            type: Number,
            default: 50,
            required: true,
          },
          payPercentage: {
            type: Number,
            default: 50,
            required: true,
          },
        },
        required: true,
      },
      distributeNegative: {
        type: {
          active: {
            type: Boolean,
            default: false,
            required: true,
          },
          comptimePercentage: {
            type: Number,
            default: 50,
            required: true,
          },
          payPercentage: {
            type: Number,
            default: 50,
            required: true,
          },
        },
        required: true,
      },
    },
    required: true,
  },
  nighttimeExtra: {
    type: {
      active: {
        type: Boolean,
        default: false,
        required: true,
      },
      percentage: {
        type: Number,
        default: 20,
        required: true,
      },
      startTime: {
        type: String,
        default: "22:00",
        required: true,
      },
      endTime: {
        type: String,
        default: "05:00",
        required: true,
      },
    },
    required: true,
  },
  DSR: {
    type: {
      active: {
        type: Boolean,
        default: false,
        required: true,
      },
      holidayDeduction: {
        type: Boolean,
        default: false,
        required: true,
      },
      overToleranceDeduction: {
        type: Boolean,
        default: false,
        required: true,
      },
      tolerance: {
        type: String,
        default: "00:30",
        required: true,
      },
    },
    required: true,
  },
});

export default mongoose.model("PunchConfig", punchConfigSchema);
