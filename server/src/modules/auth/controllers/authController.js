import User from "../../ti/models/userModel.js";
import JWT from "../../../middlewares/jsonwebtoken.js";

class AuthController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.user._id;

      const user = await User.findById(userId)
        .populate({
          path: "employeeId",
          select: "name cpf role",
        })
        .select("-password")
        .exec();

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
        user?.password ?? ""
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
        sameSite: "None",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
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
        secure: true,
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
}

export default AuthController;
