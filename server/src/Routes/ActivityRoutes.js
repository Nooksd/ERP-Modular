import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import ActivityController from "../Controllers/activityController.js";

const ActivityRoutes = express.Router();

ActivityRoutes.get(
  "/get-all",
  JWT.validateAccessToken,
  ActivityController.getAllActivities
);
ActivityRoutes.post(
  "/create-activity",
  JWT.validateAccessToken,
  ActivityController.createActivity
);
ActivityRoutes.put(
  "/update/:activityId",
  JWT.validateAccessToken,
  ActivityController.updateActivity
);
ActivityRoutes.delete(
  "/delete/:activityId",
  JWT.validateAccessToken,
  ActivityController.deleteActivity
);

export default ActivityRoutes;
