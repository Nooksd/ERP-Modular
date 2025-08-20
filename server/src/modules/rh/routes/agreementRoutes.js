import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as AgreementController from "../controllers/agreementController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.use(JWT.validateAccessToken);

router.get("/document/:filename", AgreementController.getDocument);

router.use(checkModulePermission("rh", "viewer"));

router.get("/get-all", AgreementController.getAll);
router.get("/get-one/:agreementId", AgreementController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post(
  "/upload",
  upload.single("document"),
  AgreementController.uploadDocument
);
router.post("/create", AgreementController.createAgreement);
router.put("/update/:agreementId", AgreementController.update);
router.patch("/disable/:agreementId", AgreementController.disable);
router.patch("/enable/:agreementId", AgreementController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete("/delete/:agreementId", AgreementController.deleteOne);

export default router;
