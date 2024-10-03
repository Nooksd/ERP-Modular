import Role from "../Models/RoleModel.js";

class RoleController {
  static async createRole(req, res) {
    try {
      if (!req.user.user.pages.includes("Administrativo")) {
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

  static async getAllRoles(req, res) {
    try {
      if (!req.user.user.pages.includes("Administrativo")) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const roles = await Role.find()
        .select("-baseSalary -isField -additives")
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
}

export default RoleController;
