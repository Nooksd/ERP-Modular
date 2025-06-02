import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import RoleController from "../controllers/roleControlller.js";

const RoleRoutes = express.Router();

RoleRoutes.use(JWT.validateAccessToken);

RoleRoutes.post("/create", RoleController.createRole);
RoleRoutes.get("/get-all-field-roles", RoleController.getAllFieldRoles);
RoleRoutes.get("/get-all", RoleController.getAllRoles);
RoleRoutes.get("/get-one/:roleId", RoleController.getRole);
RoleRoutes.put("/update/:roleId", RoleController.updateRole);
RoleRoutes.delete("/delete/:roleId", RoleController.deleteRole);

export default RoleRoutes;
