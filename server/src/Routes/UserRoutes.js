import express from "express";
import UserController from "../Controllers/userController.js";
import JWT from "../Middlewares/jsonwebtoken.js";
import {
  userLoginCheck,
  userValidator,
} from "../Middlewares/validateCredentials.js";

const userRoutes = express.Router();

userRoutes.post("/login", userLoginCheck, userValidator, UserController.Login);
userRoutes.post("/logout", JWT.validateAccessToken, UserController.logout);
userRoutes.get("/refresh-token", UserController.refreshToken);
userRoutes.get("/profile", JWT.validateAccessToken, UserController.getProfile);
userRoutes.post(
  "/create-user",
  JWT.validateAccessToken,
  UserController.createUser
);
userRoutes.get(
  "/get-all-users",
  JWT.validateAccessToken,
  UserController.getAllUsers
);
userRoutes.get("/:userId", JWT.validateAccessToken, UserController.getUserById);
userRoutes.put("/:userId", JWT.validateAccessToken, UserController.updateUser);

export default userRoutes;
