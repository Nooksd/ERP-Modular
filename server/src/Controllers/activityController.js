import Activity from "../Models/activityModel.js";

class ActivityController {
  static async createActivity(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { area, activities } = req.body;

      if (!area || !activities) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await Activity.isUnique(area);

      if (!isUnique) {
        return res.status(409).json({
          message: "Atividade já cadastrada",
          status: false,
        });
      }

      Activity.create({
        area,
        activities,
      });

      res.status(201).json({
        message: "Atividade criada com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getAllActivities(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const activities = await Activity.find();

      if (!activities) {
        return res.status(404).json({
          message: "Nenhuma atividade encontrada",
          status: false,
        });
      }

      res.json({
        message: "Atividades encontradas",
        activities,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }
}

export default ActivityController;
