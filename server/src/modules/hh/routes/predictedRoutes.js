import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import PredictedController from "../controllers/predictedController.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import multer from "multer";

const PredictedRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

PredictedRoutes.use(JWT.validateAccessToken);

PredictedRoutes.use(checkModulePermission("hh", "admin"));

PredictedRoutes.post(
  "/send/:workId",
  upload.single("data"),
  PredictedController.sendPredicted
);
PredictedRoutes.get("/:workId", PredictedController.getPredicted);
PredictedRoutes.delete(
  "/delete/:predictedId",
  PredictedController.deletePredicted
);

export default PredictedRoutes;
