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
  "/get-last-record/:projectId",
  JWT.validateAccessToken,
  HHControllController.getLastHHRecord
);

export default HHControllerRoutes;
