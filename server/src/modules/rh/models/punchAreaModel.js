import mongoose from "mongoose";

const punchAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    circularArea: {
      center: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
          required: true,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
          required: true,
        },
      },
      radius: {
        type: Number,
        min: 1,
        max: 5000,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

punchAreaSchema.index({ isActive: 1 });
punchAreaSchema.index({
  "circularArea.center.latitude": 1,
  "circularArea.center.longitude": 1,
});

punchAreaSchema.methods.isWithinArea = function (lat, lng) {
  const centerLat = this.circularArea.center.latitude;
  const centerLng = this.circularArea.center.longitude;
  const radius = this.circularArea.radius;

  const R = 6371e3;
  const φ1 = (centerLat * Math.PI) / 180;
  const φ2 = (lat * Math.PI) / 180;
  const Δφ = ((lat - centerLat) * Math.PI) / 180;
  const Δλ = ((lng - centerLng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance <= radius;
};

export default mongoose.model("PunchArea", punchAreaSchema);
