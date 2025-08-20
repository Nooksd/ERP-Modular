import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as DocumentController from "../controllers/documentController.js";
import multer from "multer";

const documentRoutes = express.Router();
const upload = multer();

documentRoutes.use(JWT.validateAccessToken);

documentRoutes.post(
  "/send-requested-file/:documentId",
  upload.single("file"),
  DocumentController.sendRequestedFile
);

documentRoutes.use(checkModulePermission("rh", "viewer"));

documentRoutes.get("/file/:filename", DocumentController.getDocument);
documentRoutes.get("/get-all", DocumentController.getAll);

documentRoutes.use(checkModulePermission("rh", "editor"));

documentRoutes.post(
  "/upload",
  upload.single("file"),
  DocumentController.uploadDocumentFile
);
documentRoutes.post(
  "/create-or-update",
  DocumentController.createOrUpdateDocument
);
documentRoutes.post("/request-file", DocumentController.requestFile);

documentRoutes.use(checkModulePermission("rh", "admin"));

documentRoutes.delete("/delete/:documentId", DocumentController.deleteDocument);

export default documentRoutes;
