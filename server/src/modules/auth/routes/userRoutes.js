import express from "express";
import AuthController from "../controllers/authController.js";
import JWT from "../../../middlewares/jsonwebtoken.js";
import {
  userLoginCheck,
  userValidator,
} from "../middlewares/validateCredentials.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/login", userLoginCheck, userValidator, AuthController.Login);
AuthRoutes.get("/refresh-token", AuthController.refreshToken);

AuthRoutes.use(JWT.validateAccessToken);

AuthRoutes.post("/logout", AuthController.logout);
AuthRoutes.get("/profile", AuthController.getProfile);

export default AuthRoutes;
