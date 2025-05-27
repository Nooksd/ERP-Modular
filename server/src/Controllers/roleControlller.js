import Role from "../Models/roleModel.js";

class RoleController {
  static async createRole(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { role, sector, baseSalary, additives, isField } = req.body;

      if (!role || !sector || !baseSalary) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await Role.isUnique(role);

      if (!isUnique) {
        return res.status(409).json({
          message: "Função já cadastrada",
          status: false,
        });
      }

      const newRole = await Role.create({
        role,
        sector,
        baseSalary,
        additives,
        isField,
      });

      res.status(201).json({
        message: "Função criada com sucesso",
        status: true,
        role: newRole,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getRole(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { roleId } = req.params;

      const role = await Role.findById(roleId).exec();

      if (!role) {
        return res.status(404).json({
          message: "Função não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "Função encontrada com sucesso",
        role,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async updateRole(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { roleId } = req.params;

      const { role, sector, baseSalary, additives, isField } = req.body;

      if (!role && !sector && !baseSalary && !isField && !additives) {
        return res.status(400).json({
          message: "Nenhum dado para atualizar",
          status: false,
        });
      }

      const updateData = {};
      if (role) updateData.role = role;
      if (sector) updateData.sector = sector;
      if (baseSalary) updateData.baseSalary = baseSalary;
      if (isField === true || isField === false) updateData.isField = isField;
      if (additives) updateData.additives = additives;

      const roleToUpdate = await Role.findByIdAndUpdate(
        roleId,
        {
          $set: updateData,
        },
        {
          new: true,
        }
      ).exec();

      if (!roleToUpdate) {
        return res.status(404).json({
          message: "Função não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "Função atualizada com sucesso",
        role: roleToUpdate,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getAllRoles(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { page = 1, limit = 100000, name, order = true } = req.query;

      let filter = name ? { name: { $regex: name, $options: "i" } } : {};

      const sortOrder = order ? 1 : -1;

      const totalRoles = await Role.countDocuments(filter);

      const baseSlary = req.user.user.isManager ? "" : "-baseSalary";

      const roles = await Role.find()
        .sort({ ["sector"]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select(`${baseSlary} -additives`)
        .exec();

      if (!roles) {
        return res.status(404).json({
          message: "Sem funções",
          status: false,
        });
      }

      res.status(200).json({
        message: "Funções",
        roles,
        pagination: {
          totalRoles,
          totalPages: Math.ceil(totalRoles / limit),
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

  static async getAllFieldRoles(req, res) {
    try {
      const roles = await Role.find({ isField: true })
        .select("-baseSalary -isField -additives")
        .exec();

      if (!roles) {
        return res.status(404).json({
          message: "Sem Funções de campo",
          status: false,
        });
      }

      res.status(200).json({
        message: "Funções de campo",
        status: true,
        roles,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async deleteRole(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { roleId } = req.params;

      const deletedRole = await Role.findByIdAndDelete(roleId).exec();

      if (!deletedRole) {
        return res.status(404).json({
          message: "Função não encontrada",
          status: false,
        });
      }

      res.status(200).json({
        message: "Função deletada com sucesso",
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

export default RoleController;
