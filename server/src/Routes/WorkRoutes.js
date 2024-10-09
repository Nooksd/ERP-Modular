import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import WorkController from "../Controllers/workController.js";

const WorkRoutes = express.Router();

WorkRoutes.get(
  "/get-one/:workId",
  JWT.validateAccessToken,
  WorkController.getWork
);
WorkRoutes.get(
  "/get-user-works",
  JWT.validateAccessToken,
  WorkController.getUserWorks
);
WorkRoutes.post(
  "/add-work",
  JWT.validateAccessToken,
  WorkController.createWork
);
WorkRoutes.get(
  "/get-all",
  JWT.validateAccessToken,
  WorkController.getAllWorks
);
WorkRoutes.put(
  "/update/:workId",
  JWT.validateAccessToken,
  WorkController.updateWork
);
WorkRoutes.delete(
  "/delete/:workId",
  JWT.validateAccessToken,
  WorkController.deleteWork
);

export default WorkRoutes;
