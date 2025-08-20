import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as LocationController from "../controllers/locationController.js";

const locationRoutes = express.Router();

locationRoutes.use(JWT.validateAccessToken);
locationRoutes.use(checkModulePermission("rh", "viewer"));

locationRoutes.get("/get-all", LocationController.getAll);
locationRoutes.get("/get-one/:locationId", LocationController.getOne);

locationRoutes.use(checkModulePermission("rh", "editor"));

locationRoutes.post("/create", LocationController.create);
locationRoutes.put("/update/:locationId", LocationController.update);
locationRoutes.patch("/disable/:locationId", LocationController.disable);
locationRoutes.patch("/enable/:locationId", LocationController.enable);

locationRoutes.use(checkModulePermission("rh", "admin"));

locationRoutes.delete("/delete/:locationId", LocationController.deleteOne);

export default locationRoutes;
