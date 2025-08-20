import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as TerminationProcessController from "../controllers/terminationProcessController.js";

const terminationProcessRoutes = express.Router();

terminationProcessRoutes.use(JWT.validateAccessToken);
terminationProcessRoutes.use(checkModulePermission("rh", "viewer"));

terminationProcessRoutes.get("/get-all", TerminationProcessController.getAll);
terminationProcessRoutes.get(
  "/get-one/:terminationProcessId",
  TerminationProcessController.getOne
);

terminationProcessRoutes.use(checkModulePermission("rh", "editor"));

terminationProcessRoutes.post("/create", TerminationProcessController.create);
terminationProcessRoutes.post(
  "/complete-step",
  TerminationProcessController.completeStep
);

terminationProcessRoutes.use(checkModulePermission("rh", "admin"));

terminationProcessRoutes.post(
  "/cancel/:terminationProcessId",
  TerminationProcessController.cancel
);

export default terminationProcessRoutes;
