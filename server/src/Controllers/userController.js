// User Controller file

import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import JWT from "../Middlewares/jsonwebtoken.js";

class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.user._id;

      const user = await User.findById(userId).select("-password").exec();

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado",
          status: false,
        });
      }

      res.status(200).json({
        message: "Perfil do usuário encontrado com sucesso",
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

  static async Login(req, res) {
    try {
      const { email, password, keepConnection } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const user = await User.findByEmail(email);
      const isPasswordCorrect = await User.comparePassword(
        password,
        user.password
      );

      if (!user || !isPasswordCorrect) {
        return res.status(401).json({
          message: "Email ou senha inválidos",
          status: false,
        });
      }

      const userObject = user.toObject();
      delete userObject.password;

      const accessToken = JWT.generateAccessToken(user);
      const refreshToken = JWT.generateRefreshToken(user, keepConnection);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.status(200).json({
        message: "Autenticado com sucesso",
        user: userObject,
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static logout(req, res) {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({
        message: "Sessão encerrada com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;

      if (!token) {
        return res.status(401).json({
          message: "Não Autorizado",
          status: false,
        });
      }

      const user = await JWT.validateRefreshToken(token);

      if (!user) {
        return res.status(403).json({
          message: "Token inválido",
          status: false,
        });
      }

      const newAccessToken = JWT.generateAccessToken(user);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.status(200).json({
        message: "Token atualizado com sucesso",
        status: true,
      });
    } catch (e) {
      res.status(500).json({
        message: "Erro interno do servidor",
        status: false,
      });
    }
  }

  static async createUser(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
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

      User.create({
        name,
        email,
        password: hashedPassword,
      });

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

  static async updateUser(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const { userId } = req.params;
      const {
        employeeId,
        email,
        password,
        avatar,
        pages,
        isManager,
        allowedProjects,
      } = req.body;

      if (
        !employeeId &&
        !email &&
        !password &&
        !avatar &&
        !pages &&
        isManager !== true &&
        isManager !== false &&
        !allowedProjects
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

  static async getUserById(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

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

  static async getAllUsers(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

      const {
        page = 1,
        limit = 10,
        name,
        order = true,
        active = true,
      } = req.query;

      let filter = name ? { name: { $regex: name, $options: "i" } } : {};

      filter = { ...filter, isActive: active === "true" };

      const sortOrder = order === "true" ? 1 : -1;

      const totalUsers = await User.countDocuments(filter);

      const users = await User.find(filter)
        .sort({ ["name"]: sortOrder })
        .limit(limit * 1)
        .skip((page - 1) * limit)
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

  static async deleteUser(req, res) {
    try {
      if (!req.user.user.isManager) {
        return res.status(403).json({
          message: "Sem permissão",
          status: false,
        });
      }

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
