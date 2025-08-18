import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as HiringProcessController from "../controllers/hiringProcessController.js";

const hiringProcessRoutes = express.Router();

hiringProcessRoutes.use(JWT.validateAccessToken);
hiringProcessRoutes.use(checkModulePermission("rh", "viewer"));

hiringProcessRoutes.get("/get-one/:processId", HiringProcessController.getOne);
hiringProcessRoutes.get("/get-all", HiringProcessController.getAll);

hiringProcessRoutes.use(checkModulePermission("rh", "editor"));

hiringProcessRoutes.post(
  "/create/:candidateId",
  HiringProcessController.create
);
hiringProcessRoutes.patch(
  "/create-employee/:processId",
  HiringProcessController.createEmployee
);
hiringProcessRoutes.patch(
  "/check-documents/:processId",
  HiringProcessController.checkDocuments
);
hiringProcessRoutes.patch(
  "/send-esocial/:processId",
  HiringProcessController.sendESocial
);
hiringProcessRoutes.patch(
  "/complete-process/:processId",
  HiringProcessController.completeProcess
);
hiringProcessRoutes.put("/cancel/:processId", HiringProcessController.cancel);

export default hiringProcessRoutes;
