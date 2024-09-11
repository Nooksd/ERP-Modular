import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import ActivityController from "../Controllers/activityController.js";

const ActivityRoutes = express.Router();

ActivityRoutes.get(
  "/get-all-activities",
  JWT.validateAccessToken,
  ActivityController.getAllActivities
);
ActivityRoutes.post(
  "/create-activity",
  JWT.validateAccessToken,
  ActivityController.createActivity
);

export default ActivityRoutes;
