import HHrecords from "../Models/hhrecordsModel.js";
import Work from "../Models/workModel.js";

async function isManegerOnWork(projectId, userId) {
  try {
    const work = await Work.findById(projectId);

    if (!work) return false;

    const isManager = work.managerIds.some((managerId) =>
      managerId.equals(userId)
    );

    if (!isManager) return false;
    return true;
  } catch (e) {
    return false;
  }
}

class HHControllController {
  static async sendHH(req, res) {
    try {
      const { projectId, hhRecords, date } = req.body;

      if (!projectId || !(hhRecords.length > 0) || !date) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios.",
          status: false,
        });
      }

      const userId = req.user.user._id;

      const isManager = await isManegerOnWork(projectId, userId);

      if (isManager) {
        return res.status(403).json({
          message: "Usuário não tem permissão para enviar HH para esta obra.",
          status: false,
        });
      }

      for (const record of hhRecords) {
        // Validações de campos principais
        if (
          !record.area ||
          typeof record.area !== "string" ||
          !record.activity ||
          typeof record.activity !== "string" ||
          !record.subactivity ||
          typeof record.subactivity !== "string" ||
          !record.workDescription ||
          typeof record.workDescription !== "string"
        ) {
          return res.status(400).json({
            message:
              "Campos obrigatórios em hhRecords estão ausentes ou inválidos.",
            status: false,
          });
        }

        if (!Array.isArray(record.roles) || record.roles.length === 0) {
          return res.status(400).json({
            message:
              "Pelo menos um role deve ser definido em cada registro de HH.",
            status: false,
          });
        }

        for (const role of record.roles) {
          if (
            !role.role ||
            typeof role.role !== "string" ||
            typeof role.quantity !== "number" ||
            role.quantity <= 0 ||
            typeof role.hours !== "number" ||
            role.hours <= 0
          ) {
            return res.status(400).json({
              message:
                "Campos obrigatórios em roles estão ausentes ou inválidos.",
              status: false,
            });
          }
        }
      }

      const isUnique = await HHrecords.isUnique(projectId, date, hhRecords);

      if (isUnique) {
        return res.status(409).json({
          message: "Registro de HH já existe.",
          status: false,
        });
      }

      HHrecords.create({
        userId,
        projectId,
        hhRecords,
        date: new Date(date),
      });

      return res.status(201).json({
        message: "Registro de HH enviado com sucesso.",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getLastHHRecord(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.user._id;

      if (!projectId) {
        return res.status(400).json({
          message: "Id da obra é obrigatório.",
          status: false,
        });
      }

      const isManager = await isManegerOnWork(projectId, userId);

      if (!isManager) {
        return res.status(403).json({
          message: "Usuário não tem permissão para esta obra.",
          status: false,
        });
      }

      const hhRecord = await HHrecords.findOne({ projectId })
        .sort({ date: -1 })
        .select("-createdAt -updatedAt -date -projectId -userId")
        .exec();

      if (!hhRecord) {
        return res.status(404).json({
          message: "Registro de HH não encontrado.",
          status: false,
        });
      }

      res.status(200).json({
        message: "Registro de HH recente encontrado.",
        hhRecord,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getHHRecordsByProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.user._id;

      if (!projectId) {
        return res.status(400).json({
          message: "Id da obra é obrigatório.",
          status: false,
        });
      }

      const isManager = await isManegerOnWork(projectId, userId);

      if (!isManager) {
        return res.status(403).json({
          message: "Usuário não tem permissão para esta obra.",
          status: false,
        });
      }

      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        order = true,
      } = req.query;

      
      const dateFilter = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }

      
      const hhSummary = await HHrecords.getHistoryByProjectId(
        projectId,
        order === "true",
        dateFilter
      );
      
      const startIndex = (page - 1) * limit;
      const paginatedSummary = hhSummary.slice(
        startIndex,
        startIndex + parseInt(limit)
      );

      const totalRecords = hhSummary.length;

      if (!paginatedSummary.length) {
        return res.status(404).json({
          message: "Sem Registro de HH",
          status: false,
        });
      }

      res.status(200).json({
        message: "Registros de HH encontrados.",
        hhRecords: paginatedSummary,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: parseInt(page),
        },
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getHHRecordsByDate(req, res) {}
}

export default HHControllController;
