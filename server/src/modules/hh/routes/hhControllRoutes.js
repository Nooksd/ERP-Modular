import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import HHControllController from "../controllers/hhControllController.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";

const HHControllerRoutes = express.Router();

HHControllerRoutes.use(JWT.validateAccessToken);

HHControllerRoutes.get(
  "/get-statistics/:projectId",
  checkModulePermission("hh", "viewer"),
  HHControllController.getStatistics
);

HHControllerRoutes.use(checkModulePermission("hh", "editor"));

HHControllerRoutes.post("/sendHH", HHControllController.sendHH);
HHControllerRoutes.get(
  "/get-record/:recordId",
  HHControllController.getHHRecord
);
HHControllerRoutes.get(
  "/get-last-record/:projectId",
  HHControllController.getLastHHRecord
);
HHControllerRoutes.get(
  "/get-history/:projectId",
  HHControllController.getHHRecordsByProject
);
HHControllerRoutes.put("/update/:recordId", HHControllController.updateRecord);
HHControllerRoutes.delete(
  "/delete/:recordId",
  HHControllController.deleteRecord
);
HHControllerRoutes.get("/get-pdf-base", HHControllController.getPdf);

export default HHControllerRoutes;
