import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as AgreementController from "../controllers/agreementController.js";
import multer from "multer";

const agreementRoutes = express.Router();
const upload = multer();

agreementRoutes.use(JWT.validateAccessToken);

agreementRoutes.get("/document/:filename", AgreementController.getDocument);

agreementRoutes.use(checkModulePermission("rh", "viewer"));

agreementRoutes.get("/get-all", AgreementController.getAll);
agreementRoutes.get("/get-one/:agreementId", AgreementController.getOne);

agreementRoutes.use(checkModulePermission("rh", "editor"));

agreementRoutes.post(
  "/upload",
  upload.single("document"),
  AgreementController.uploadDocument
);
agreementRoutes.post("/create", AgreementController.createAgreement);
agreementRoutes.put("/update/:agreementId", AgreementController.update);
agreementRoutes.patch("/disable/:agreementId", AgreementController.disable);
agreementRoutes.patch("/enable/:agreementId", AgreementController.enable);

agreementRoutes.use(checkModulePermission("rh", "admin"));

agreementRoutes.delete("/delete/:agreementId", AgreementController.deleteOne);

export default agreementRoutes;
