import express from "express";
import UserController from "../controllers/userController.js";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";

const UserRoutes = express.Router();

UserRoutes.use(JWT.validateAccessToken);

UserRoutes.use(checkModulePermission("ti", "admin"));

UserRoutes.post("/create", UserController.create);
UserRoutes.get("/get-all", UserController.getAll);
UserRoutes.get("/get-one/:userId", UserController.getOne);
UserRoutes.put("/update/:userId", UserController.update);
UserRoutes.delete("/delete/:userId", UserController.delete);

export default UserRoutes;
