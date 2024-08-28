import jwt from "jsonwebtoken";
import dotenv from "dotenv";	

dotenv.config();

class JWT {
  static validateToken(req, res, next) {
    const token = req.headers["authorization"];

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

  static generateToken(user) {
    return jwt.sign({ user }, process.env.JWT_KEY, {
      expiresIn: "5d",
    });
  }
}

export default JWT;
