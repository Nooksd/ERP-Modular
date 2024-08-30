// User Controller file

import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import JWT from "../Middlewares/jsonwebtoken.js";

class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

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
        secure: true,
        sameSite: "Strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
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

  static async refreshToken(req, res) {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({
          message: "Não Autorizado",
          status: false,
        });
      }

      const user = await JWT.validateRefreshToken(token);

      if (!user) {
        return res.status(403).json({
          message: "RefreshToken inválido",
          status: false,
        });
      }

      const newAccessToken = JWT.generateAccessToken(user);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
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

      const { name, cpf, email, password } = req.body;

      if (!name || !cpf || !email || !password) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios",
          status: false,
        });
      }

      const isUnique = await User.isUnique(cpf, email);

      if (!isUnique) {
        return res.status(409).json({
          message: "Usuário já cadastrados",
          status: false,
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      User.create({
        name,
        cpf,
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
      const { name, cpf, email, password, avatar } = req.body;

      if (!name && !cpf && !email && !password && !avatar) {
        return res.status(400).json({
          message: "Nenhum dado para atualizar",
          status: false,
        });
      }

      let hashedPassword;
      if (password) hashedPassword = bcrypt.hashSync(password, 10);

      const updateData = {};
      if (name) updateData.name = name;
      if (cpf) updateData.cpf = cpf;
      if (email) updateData.email = email;
      if (password) updateData.password = hashedPassword;
      if (avatar) updateData.avatar;

      const user = await User.findByIdAndUpdate(userId, {
        $set: updateData,
      }).exec();

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

      const { page = 1, limit = 10 } = req.query;

      const users = await User.find()
        .select("name avatar")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      res.status(200).json({
        message: "Usuários listados com sucesso",
        users,
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
