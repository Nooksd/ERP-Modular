import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import RoleController from "../Controllers/roleControlller.js";

const RoleRoutes = express.Router();

RoleRoutes.post("/create", JWT.validateAccessToken, RoleController.createRole);
RoleRoutes.get(
  "/get-all-field-roles",
  JWT.validateAccessToken,
  RoleController.getAllFieldRoles
);
RoleRoutes.get("/get-all", JWT.validateAccessToken, RoleController.getAllRoles);
RoleRoutes.get(
  "/get-one/:roleId",
  JWT.validateAccessToken,
  RoleController.getRole
);
RoleRoutes.put(
  "/update/:roleId",
  JWT.validateAccessToken,
  RoleController.updateRole
);
RoleRoutes.delete(
  "/delete/:roleId",
  JWT.validateAccessToken,
  RoleController.deleteRole
);

export default RoleRoutes;
