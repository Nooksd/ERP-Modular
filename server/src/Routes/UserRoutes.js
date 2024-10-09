import express from "express";
import UserController from "../Controllers/userController.js";
import JWT from "../Middlewares/jsonwebtoken.js";
import {
  userLoginCheck,
  userValidator,
} from "../Middlewares/validateCredentials.js";

const UserRoutes = express.Router();

UserRoutes.post("/login", userLoginCheck, userValidator, UserController.Login);
UserRoutes.post("/logout", JWT.validateAccessToken, UserController.logout);
UserRoutes.get("/refresh-token", UserController.refreshToken);
UserRoutes.get("/profile", JWT.validateAccessToken, UserController.getProfile);
UserRoutes.post(
  "/create",
  JWT.validateAccessToken,
  UserController.createUser
);
UserRoutes.get(
  "/get-all",
  JWT.validateAccessToken,
  UserController.getAllUsers
);
UserRoutes.get("/get-managers", JWT.validateAccessToken, UserController.getManagers)
UserRoutes.get("/get-one/:userId", JWT.validateAccessToken, UserController.getUserById);
UserRoutes.put("/update/:userId", JWT.validateAccessToken, UserController.updateUser);
UserRoutes.delete("/delete/:userId", JWT.validateAccessToken, UserController.deleteUser);

export default UserRoutes;
