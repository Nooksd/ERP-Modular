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
      const { page = 1, limit = 10, name, order = true } = req.query;

      let filter = name ? { area: { $regex: name, $options: "i" } } : {};

      const sortOrder = order ? 1 : -1;

      const totalAreas = await Activity.countDocuments(filter);

      const activities = await Activity.find(filter)
        .sort({ ["area"]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      if (!activities) {
        return res.status(404).json({
          message: "Nenhuma atividade encontrada",
          status: false,
        });
      }

      const activitiesWithCounts = activities.map((activity) => {
        const totalActivities = activity.activities.length;

        const activitiesWithSubCounts = activity.activities.map((act) => {
          const totalSubActivities = act.subactivities
            ? act.subactivities.length
            : 0;

          return {
            ...act.toObject(),
            totalSubActivities,
          };
        });

        return {
          ...activity.toObject(),
          activities: activitiesWithSubCounts,
          totalActivities,
          totalSubactivities: activitiesWithSubCounts.reduce(
            (sum, act) => sum + act.totalSubActivities,
            0
          ),
        };
      });

      res.status(200).json({
        message: "Atividades encontradas",
        activities: activitiesWithCounts,
        pagination: {
          totalAreas,
          totalPages: Math.ceil(totalAreas / limit),
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

  static async getActivity(req, res) {
    try {
      if (!req.user.user.pages.includes("Administrativo")) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { activityId } = req.params;

      const activity = await Activity.findById(activityId).exec();

      if (!activity) {
        return res.status(404).json({
          message: "Atividade não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "atividade encontrada com sucesso",
        activity,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async updateActivity(req, res) {
    try {
      if (!req.user.user.pages.includes("Administrativo")) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { activityId } = req.params;

      const { area, activities } = req.body;

      if (!area && !activities) {
        return res.status(400).json({
          message: "Nenhum dado para atualizar",
          status: false,
        });
      }

      const updateData = {};
      if (area) updateData.area = area;
      if (activities) updateData.activities = activities;

      const activity = await Activity.findByIdAndUpdate(
        activityId,
        {
          $set: updateData,
        },
        { new: true }
      ).exec();

      if (!activity) {
        return res.status(404).json({
          message: "Atividade não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "Atividade atualizada com sucesso",
        activity,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async deleteActivity(req, res) {
    try {
      if (!req.user.user.pages.includes("Administrativo")) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { activityId } = req.params;

      const activity = await Activity.findByIdAndDelete(activityId).exec();

      if (!activity) {
        return res.status(404).json({
          message: "Atividade não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "atividade excluída com sucesso",
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
