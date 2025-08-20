import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as TeamController from "../controllers/teamController.js";

const teamRoutes = express.Router();

teamRoutes.use(JWT.validateAccessToken);
teamRoutes.use(checkModulePermission("rh", "viewer"));

teamRoutes.get("/get-all", TeamController.getAll);
teamRoutes.get("/get-one/:teamId", TeamController.getOne);

teamRoutes.use(checkModulePermission("rh", "editor"));

teamRoutes.post("/create", TeamController.create);
teamRoutes.put("/update/:teamId", TeamController.update);
teamRoutes.patch("/add-employee/:teamId", TeamController.addEmployee);
teamRoutes.patch("/remove-one/:teamId", TeamController.remove);
teamRoutes.patch("/promote-to-manager/:teamId", TeamController.promote);
teamRoutes.patch("/demote-to-employee/:teamId", TeamController.demote);

teamRoutes.patch("/disable/:teamId", TeamController.disable);
teamRoutes.patch("/enable/:teamId", TeamController.enable);

teamRoutes.use(checkModulePermission("rh", "admin"));

teamRoutes.delete("/delete/:teamId", TeamController.deleteOne);

export default teamRoutes;
