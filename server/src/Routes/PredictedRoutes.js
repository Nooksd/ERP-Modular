import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import PredictedController from "../Controllers/predictedController.js";
import multer from "multer";

const PredictedRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

PredictedRoutes.post(
  "/send/:workId",
  JWT.validateAccessToken,
  upload.single("data"),
  PredictedController.sendPredicted
);

PredictedRoutes.get(
  "/:workId",
  JWT.validateAccessToken,
  PredictedController.getPredicted
);

PredictedRoutes.delete(
  "/delete/:predictedId",
  JWT.validateAccessToken,
  PredictedController.deletePredicted
);

export default PredictedRoutes;
