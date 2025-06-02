import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import ActivityController from "../controllers/activityController.js";

const ActivityRoutes = express.Router();

ActivityRoutes.get(
  "/get-all",
  JWT.validateAccessToken,
  ActivityController.getAllActivities
);

ActivityRoutes.get(
  "/get-one/:activityId",
  JWT.validateAccessToken,
  ActivityController.getActivity
);
ActivityRoutes.post(
  "/create",
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
