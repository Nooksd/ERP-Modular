import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import ActivityController from "../controllers/activityController.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";

const ActivityRoutes = express.Router();

ActivityRoutes.use(JWT.validateAccessToken);

ActivityRoutes.use(checkModulePermission("hh", "viewer"));

ActivityRoutes.get("/get-all", ActivityController.getAllActivities);

ActivityRoutes.use(checkModulePermission("hh", "admin"));

ActivityRoutes.get("/get-one/:activityId", ActivityController.getActivity);
ActivityRoutes.post("/create", ActivityController.createActivity);
ActivityRoutes.put("/update/:activityId", ActivityController.updateActivity);
ActivityRoutes.delete("/delete/:activityId", ActivityController.deleteActivity);

export default ActivityRoutes;
