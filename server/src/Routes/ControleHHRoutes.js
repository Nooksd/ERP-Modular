import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import HHControllController from "../Controllers/hhControllController.js";

const HHControllerRoutes = express.Router();

HHControllerRoutes.post(
  "/sendHH",
  JWT.validateAccessToken,
  HHControllController.sendHH
);
HHControllerRoutes.get(
  "/get-record/:recordId",
  JWT.validateAccessToken,
  HHControllController.getHHRecord
);
HHControllerRoutes.get(
  "/get-last-record/:projectId",
  JWT.validateAccessToken,
  HHControllController.getLastHHRecord
);
HHControllerRoutes.get(
  "/get-history/:projectId",
  JWT.validateAccessToken,
  HHControllController.getHHRecordsByProject
);
HHControllerRoutes.put(
  "/update/:recordId",
  JWT.validateAccessToken,
  HHControllController.updateRecord
);
HHControllerRoutes.delete(
  "/delete/:recordId",
  JWT.validateAccessToken,
  HHControllController.deleteRecord
);

HHControllerRoutes.get(
  "/get-statistics/:projectId",
  JWT.validateAccessToken,
  HHControllController.getStatistics
);

HHControllerRoutes.get(
  "/get-pdf-base",
  JWT.validateAccessToken,
  HHControllController.getPdf
);

export default HHControllerRoutes;
