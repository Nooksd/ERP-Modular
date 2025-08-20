import bcrypt from "bcrypt";
import User from "../models/userModel.js";

class UserController {
  static async create(req, res) {
    try {
      const { name, email, password, employeeId, avatar, isManager, pages } =
        req.body;

      if (!name || !email || !password || !employeeId) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await User.isUnique(email);

      if (!isUnique) {
        return res.status(409).json({
          message: "Usuário já cadastrados",
          status: false,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const createData = {};
      createData.name = name;
      createData.email = email;
      createData.employeeId = employeeId;
      createData.password = hashedPassword;
      if (avatar) createData.avatar = avatar;
      if (isManager) createData.isManager = isManager;
      if (pages && Array.isArray(pages)) createData.pages = pages;

      User.create(createData);

      res.status(201).json({
        message: "Usuário criado com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor " + e.message,
        status: false,
      });
    }
  }

  static async update(req, res) {
    try {
      const { userId } = req.params;
      const {
        employeeId,
        email,
        password,
        avatar,
        pages,
        isManager,
        isActive,
      } = req.body;

      if (
        !employeeId &&
        !email &&
        !password &&
        !avatar &&
        !pages &&
        isManager !== true &&
        isManager !== false &&
        isActive !== true &&
        isActive !== false
      ) {
        return res.status(400).json({
          message: "Nenhum dado para atualizar",
          status: false,
        });
      }

      let hashedPassword;
      if (password) hashedPassword = bcrypt.hashSync(password, 10);

      const updateData = {};
      if (employeeId) updateData.employeeId = employeeId;
      if (email) updateData.email = email;
      if (password) updateData.password = hashedPassword;
      if (avatar) updateData.avatar = avatar;
      if (isManager === true || isManager === false)
        updateData.isManager = isManager;
      if (isActive === true || isActive === false)
        updateData.isActive = isActive;
      if (pages && Array.isArray(pages)) updateData.pages = pages;

      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: updateData,
        },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getOne(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select("-password").exec();

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Usuário encontrado com sucesso",
        user,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const {
        page = 1,
        limit = 999,
        name,
        order = true,
        active = "true",
      } = req.query;

      let filter = name ? { name: { $regex: name, $options: "i" } } : {};

      filter = { ...filter, isActive: active === "true" };

      const sortOrder = order === "true" ? 1 : -1;

      const totalUsers = await User.countDocuments(filter);

      const users = await User.find(filter)
        .sort({ ["name"]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-password")
        .exec();

      res.status(200).json({
        message: "Usuários listados com sucesso",
        users,
        pagination: {
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
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

  static async delete(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId).exec();

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Usuário excluído com sucesso",
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

export default UserController;
