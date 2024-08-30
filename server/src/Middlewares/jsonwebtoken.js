// jsonwebtoken.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";	

dotenv.config();

class JWT {
  static validateAccessToken(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(403).json({
        status: false,
        message: "Token inválido",
      });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: false,
          message: "Token inválido",
        });
      }
      req.user = user;
      next();
    });
  }

  static generateAccessToken(user) {
    return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "15m" });
  }

  static generateRefreshToken(user, longLife = false) {
    const expiresIn = longLife ? "10d" : "1d";
    return jwt.sign({ user }, process.env.JWT_REFRESH_KEY, { expiresIn });
  }

  static async validateRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
      return decoded.user;
    } catch (err) {
      throw new Error("Token de refresh inválido");
    }
  }
}

export default JWT;
