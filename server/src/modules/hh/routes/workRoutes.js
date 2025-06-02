import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import WorkController from "../controllers/workController.js";

const WorkRoutes = express.Router();

WorkRoutes.use(JWT.validateAccessToken);

WorkRoutes.get("/get-one/:workId", WorkController.getWork);
WorkRoutes.get("/get-user-works", WorkController.getUserWorks);
WorkRoutes.post("/create", WorkController.createWork);
WorkRoutes.get("/get-all", WorkController.getAllWorks);
WorkRoutes.put("/update/:workId", WorkController.updateWork);
WorkRoutes.delete("/delete/:workId", WorkController.deleteWork);

export default WorkRoutes;
