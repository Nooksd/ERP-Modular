import mongoose from "mongoose";
import axios from "axios";
import https from "https";
import Employee from "./employeeModel.js";
// import Punch from "./punchModel.js";

const connectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["tcp", "https"],
      required: true,
      default: "https",
    },
    ipAddress: {
      type: String,
      required: true,
      validate: {
        validator: function (ip) {
          return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
        },
        message: "IP address inválido",
      },
    },
    port: {
      type: Number,
      min: 1,
      max: 65535,
      default: 443,
      required: true,
    },
    timeout: {
      type: Number,
      default: 10000,
      min: 1000,
      max: 30000,
    },
  },
  { _id: false }
);

const authenticationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      default: null,
    },
    sessionExpires: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const punchClockSchema = new mongoose.Schema(
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
    connection: connectionSchema,
    authentication: authenticationSchema,
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
        default: 600000, // 10 minutos
        min: 300000, // 5 minuto
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
  },
  {
    timestamps: true,
  }
);

punchClockSchema.index({ status: 1 });
punchClockSchema.index({ "connection.ipAddress": 1 });
punchClockSchema.index({ isActive: 1 });

punchClockSchema.methods.testConnection = async function () {
  try {
    const protocol = this.connection.type;
    const url = `${protocol}://${this.connection.ipAddress}:${this.connection.port}/login.fcgi`;

    console.log("Tentando conectar em:", url);

    // Configuração do agente HTTPS para ignorar certificados autoassinados
    const agent =
      protocol === "https"
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined;

    const requestData = {
      login: this.authentication.username,
      password: this.authentication.password,
    };

    const response = await axios.post(url, requestData, {
      httpsAgent: agent,
      timeout: this.connection.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Resposta do equipamento:", response.data);

    if (response.data && response.data.session) {
      this.status = "online";
      this.lastConnection = new Date();
      this.authentication.session = response.data.session;
      this.authentication.sessionExpires = new Date(Date.now() + 3600000);
      await this.save();

      return {
        success: true,
        session: response.data.session,
        message: "Conexão bem-sucedida",
      };
    } else {
      throw new Error("Falha na autenticação: sessão não recebida");
    }
  } catch (error) {
    console.error("Erro na conexão:", error.message);

    this.status = "error";
    this.lastConnection = new Date();
    this.authentication.session = null;
    this.authentication.sessionExpires = null;

    await this.save();

    let errorMessage = error.message;
    if (error.code === "ECONNREFUSED") {
      errorMessage = "Conexão recusada. Verifique o IP e porta do equipamento.";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Tempo de conexão excedido. Verifique a rede.";
    } else if (error.response) {
      errorMessage = `Erro ${error.response.status}: ${error.response.data}`;
    }

    return {
      success: false,
      message: errorMessage,
      code: error.code || "CONNECTION_ERROR",
    };
  }
};

punchClockSchema.methods.collectPunches = async function (startDate) {
  try {
    if (
      !this.authentication.session ||
      !this.authentication.sessionExpires ||
      this.authentication.sessionExpires < new Date()
    ) {
      const connectionResult = await this.testConnection();
      if (!connectionResult.success) {
        throw new Error("Falha na autenticação: " + connectionResult.message);
      }
    }

    // Formatar data
    const dateObj = startDate ? new Date(startDate) : new Date();
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    // Buscar registros AFD
    const response = await axios.post(
      `https://${this.connection.ipAddress}:${this.connection.port}/get_afd.fcgi`,
      {
        session: this.authentication.session,
        initial_date: {
          day: day,
          month: month,
          year: year,
        },
      }
    );

    if (response.data) {
      this.syncConfig.lastPunchSync = new Date();
      this.lastSync = new Date();
      await this.save();

      return {
        success: true,
        data: response.data,
        processed: await this.processAFDData(response.data),
      };
    } else {
      throw new Error("Nenhum dado recebido do equipamento");
    }
  } catch (error) {
    this.status = "error";
    await this.save();

    return {
      success: false,
      message: error.message,
      code: error.code || "SYNC_ERROR",
    };
  }
};

punchClockSchema.methods.processAFDData = async function (afdData) {
  try {
    const lines = afdData.split("\n");
    const processedPunches = [];
    const errors = [];

    for (const line of lines) {
      if (line.length < 24) continue;

      const nsr = line.substring(0, 9);
      const type = line.substring(9, 10);

      if (type !== "3") continue;

      const dateStr = line.substring(10, 18);
      const timeStr = line.substring(18, 24);
      const pis = line.substring(24, 35);

      const day = dateStr.substring(0, 2);
      const month = dateStr.substring(2, 4);
      const year = dateStr.substring(4, 8);
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      const seconds = timeStr.substring(4, 6);

      const timestamp = new Date(
        `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      );

      const employee = await Employee.findOne({ "documents.PIS": pis });

      if (employee) {
        // const punch = await Punch.create({
        //   employee: employee._id,
        //   timestamp: timestamp,
        //   eventCode: "1", // Entrada (ajuste conforme necessário)
        //   punchType: "fingerprint", // Modo de captura
        //   metadata: {
        //     nsr: nsr,
        //     equipment: this._id,
        //     rawLine: line,
        //   },
        // });
        // processedPunches.push(punch);
      } else {
        errors.push(`Funcionário com PIS ${pis} não encontrado`);
      }
    }

    return processedPunches;
  } catch (error) {
    console.error("Erro ao processar dados AFD:", error);
    throw error;
  }
};

punchClockSchema.pre("save", function (next) {
  if (
    this.isModified("syncConfig.lastUserSync") ||
    this.isModified("syncConfig.lastPunchSync")
  ) {
    this.lastSync = new Date();
  }
  next();
});

export default mongoose.model("PunchClock", punchClockSchema);
