import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import WorkController from "../controllers/workController.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";

const WorkRoutes = express.Router();

WorkRoutes.use(JWT.validateAccessToken);

WorkRoutes.use(checkModulePermission("hh", "viewer"));

WorkRoutes.get("/get-user-works", WorkController.getUserWorks);

WorkRoutes.use(checkModulePermission("hh", "admin"));

WorkRoutes.get("/get-one/:workId", WorkController.getWork);
WorkRoutes.post("/create", WorkController.createWork);
WorkRoutes.get("/get-all", WorkController.getAllWorks);
WorkRoutes.put("/update/:workId", WorkController.updateWork);
WorkRoutes.delete("/delete/:workId", WorkController.deleteWork);

export default WorkRoutes;
