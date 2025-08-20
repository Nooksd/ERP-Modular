import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as PositionController from "../controllers/positionController.js";

const positionRoutes = express.Router();

positionRoutes.use(JWT.validateAccessToken);
positionRoutes.use(checkModulePermission("rh", "viewer"));

positionRoutes.get("/get-all", PositionController.getAll);
positionRoutes.get("/get-one/:positionId", PositionController.getOne);

positionRoutes.use(checkModulePermission("rh", "editor"));

positionRoutes.post("/create", PositionController.create);
positionRoutes.put("/update/:positionId", PositionController.update);
positionRoutes.patch("/disable/:positionId", PositionController.disable);
positionRoutes.patch("/enable/:positionId", PositionController.enable);

positionRoutes.use(checkModulePermission("rh", "admin"));

positionRoutes.delete("/delete/:positionId", PositionController.deleteOne);

export default positionRoutes;
