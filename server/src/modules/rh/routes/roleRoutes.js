import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import RoleController from "../controllers/roleControlller.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";

const RoleRoutes = express.Router();

RoleRoutes.use(JWT.validateAccessToken);

RoleRoutes.get("/get-all-field-roles", RoleController.getAllFieldRoles);

RoleRoutes.use(checkModulePermission("rh", "viewer"));

RoleRoutes.get("/get-all", RoleController.getAllRoles);
RoleRoutes.get("/get-one/:roleId", RoleController.getRole);

RoleRoutes.use(checkModulePermission("rh", "admin"));

RoleRoutes.post("/create", RoleController.createRole);
RoleRoutes.put("/update/:roleId", RoleController.updateRole);
RoleRoutes.delete("/delete/:roleId", RoleController.deleteRole);

export default RoleRoutes;
