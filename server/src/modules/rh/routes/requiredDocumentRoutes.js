import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as RequiredDocumentController from "../controllers/requiredDocumentController.js";

const requiredDocumentRoutes = express.Router();

requiredDocumentRoutes.use(JWT.validateAccessToken);
requiredDocumentRoutes.use(checkModulePermission("rh", "viewer"));

requiredDocumentRoutes.get("/get-all", RequiredDocumentController.getAll);
requiredDocumentRoutes.get(
  "/get-one/:requiredDocumentId",
  RequiredDocumentController.getOne
);

requiredDocumentRoutes.use(checkModulePermission("rh", "editor"));

requiredDocumentRoutes.post("/create", RequiredDocumentController.create);
requiredDocumentRoutes.put(
  "/update/:requiredDocumentId",
  RequiredDocumentController.update
);
requiredDocumentRoutes.patch(
  "/disable/:requiredDocumentId",
  RequiredDocumentController.disable
);
requiredDocumentRoutes.patch(
  "/enable/:requiredDocumentId",
  RequiredDocumentController.enable
);

requiredDocumentRoutes.use(checkModulePermission("rh", "admin"));

requiredDocumentRoutes.delete(
  "/delete/:requiredDocumentId",
  RequiredDocumentController.deleteOne
);

export default requiredDocumentRoutes;
