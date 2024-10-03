import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import RoleController from "../Controllers/roleControlller.js";

const RoleRoutes = express.Router();

RoleRoutes.post(
  "/create-role",
  JWT.validateAccessToken,
  RoleController.createRole
);
RoleRoutes.get(
  "/get-all-field-roles",
  JWT.validateAccessToken,
  RoleController.getAllFieldRoles
);
RoleRoutes.get("/get-all", JWT.validateAccessToken, RoleController.getAllRoles)

export default RoleRoutes;
