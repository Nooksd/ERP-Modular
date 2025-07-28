import express from "express";
import UserController from "../controllers/userController.js";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";
import {
  userLoginCheck,
  userValidator,
} from "../middlewares/validateCredentials.js";

const UserRoutes = express.Router();

UserRoutes.post("/login", userLoginCheck, userValidator, UserController.Login);
UserRoutes.get("/refresh-token", UserController.refreshToken);

UserRoutes.use(JWT.validateAccessToken);

UserRoutes.post("/logout", UserController.logout);
UserRoutes.get("/profile", UserController.getProfile);

UserRoutes.use(checkModulePermission("ti", "admin"));

UserRoutes.post("/create", UserController.createUser);
UserRoutes.get("/get-all", UserController.getAllUsers);
UserRoutes.get("/get-managers", UserController.getManagers);
UserRoutes.get("/get-one/:userId", UserController.getUserById);
UserRoutes.put("/update/:userId", UserController.updateUser);
UserRoutes.delete("/delete/:userId", UserController.deleteUser);

export default UserRoutes;
