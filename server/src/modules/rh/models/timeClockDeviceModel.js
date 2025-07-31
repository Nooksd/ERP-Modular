import mongoose from "mongoose";

const timeClockDeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
      immutable: true,
    },
    model: {
      type: String,
      required: true,
      enum: [
        "iDClass",
        "iDFlex",
        "iDFlex Pro",
        "iDAccess",
        "iDBlock",
        "Henry",
        "Henry Face",
        "Inner Rep Plus",
        "Inner Rep",
        "iDBox",
        "Control iD",
        "Outros",
      ],
      immutable: true,
    },
    manufacturer: {
      type: String,
      default: "Control iD",
      required: true,
      immutable: true,
    },
    connection: {
      type: {
        type: String,
        enum: ["tcp", "udp", "http", "https", "serial"],
        required: true,
        default: "tcp",
      },
      ipAddress: {
        type: String,
        required: function () {
          return ["tcp", "udp", "http", "https"].includes(this.connection.type);
        },
        validate: {
          validator: function (ip) {
            if (!["tcp", "udp", "http", "https"].includes(this.connection.type))
              return true;
            return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
          },
          message: "IP address inválido",
        },
      },
      port: {
        type: Number,
        min: 1,
        max: 65535,
        default: 3570, // Porta padrão ControlID
        required: function () {
          return ["tcp", "udp", "http", "https"].includes(this.connection.type);
        },
      },
      baudRate: {
        type: Number,
        enum: [9600, 19200, 38400, 57600, 115200],
        default: 115200,
        required: function () {
          return this.connection.type === "serial";
        },
      },
      comPort: {
        type: String,
        required: function () {
          return this.connection.type === "serial";
        },
      },
      timeout: {
        type: Number,
        default: 5000,
        min: 1000,
        max: 30000,
      },
    },
    authentication: {
      username: String,
      password: String,
      apiKey: String,
      securityKey: String,
    },
    status: {
      type: String,
      enum: ["online", "offline", "error", "maintenance", "unknown"],
      default: "unknown",
    },
    lastConnection: {
      type: Date,
      default: null,
    },
    lastSync: {
      type: Date,
      default: null,
    },
    syncConfig: {
      autoSync: {
        type: Boolean,
        default: true,
      },
      syncInterval: {
        type: Number,
        default: 300000,
        min: 60000,
      },
      syncUsers: {
        type: Boolean,
        default: true,
      },
      syncPunches: {
        type: Boolean,
        default: true,
      },
      lastUserSync: Date,
      lastPunchSync: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: mongoose.Schema.Types.Mixed,
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

timeClockDeviceSchema.index({ serialNumber: 1 });
timeClockDeviceSchema.index({ status: 1 });
timeClockDeviceSchema.index({ "connection.ipAddress": 1 });
timeClockDeviceSchema.index({ isActive: 1 });

timeClockDeviceSchema.methods.testConnection = async function () {
  try {
    // TODO: Implementar lógica de conexão aqui
    this.status = "online";
    this.lastConnection = new Date();
    await this.save();
    return true;
  } catch (error) {
    this.status = "error";
    this.lastError = {
      message: error.message,
      timestamp: new Date(),
      code: error.code || "CONNECTION_ERROR",
    };
    await this.save();
    return false;
  }
};

timeClockDeviceSchema.methods.syncUsers = async function () {
  try {
    // TODO: Implementar sincronização de usuários
    this.syncConfig.lastUserSync = new Date();
    await this.save();
    return { success: true, message: "Usuários sincronizados com sucesso" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

timeClockDeviceSchema.methods.collectPunches = async function () {
  try {
    // TODO: Implementar coleta de registros de ponto
    this.syncConfig.lastPunchSync = new Date();
    await this.save();
    return { success: true, punches: [] };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

timeClockDeviceSchema.methods.reboot = async function () {
  try {
    // TODO: Implementar comando de reinicialização
    this.statistics.lastReboot = new Date();
    this.status = "offline";
    await this.save();
    return { success: true, message: "Dispositivo reiniciado" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

timeClockDeviceSchema.statics.findOfflineDevices = function () {
  return this.find({
    status: { $in: ["offline", "error"] },
    isActive: true,
  });
};

timeClockDeviceSchema.statics.findNeedingSync = function () {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.find({
    "syncConfig.autoSync": true,
    isActive: true,
    $or: [
      { "syncConfig.lastPunchSync": { $lt: fiveMinutesAgo } },
      { "syncConfig.lastPunchSync": null },
    ],
  });
};

timeClockDeviceSchema.pre("save", function (next) {
  if (
    this.isModified("syncConfig.lastUserSync") ||
    this.isModified("syncConfig.lastPunchSync")
  ) {
    this.lastSync = new Date();
  }
  next();
});

export default mongoose.model("TimeClockDevice", timeClockDeviceSchema);
