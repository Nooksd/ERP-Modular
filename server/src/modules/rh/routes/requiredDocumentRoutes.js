import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as RequiredDocumentController from "../controllers/requiredDocumentController.js";

const router = express.Router();

router.use(JWT.validateAccessToken);
router.use(checkModulePermission("rh", "viewer"));

router.get("/get-all", RequiredDocumentController.getAll);
router.get("/get-one/:requiredDocumentId", RequiredDocumentController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post("/create", RequiredDocumentController.create);
router.put("/update/:requiredDocumentId", RequiredDocumentController.update);
router.put("/disable/:requiredDocumentId", RequiredDocumentController.disable);
router.put("/enable/:requiredDocumentId", RequiredDocumentController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete(
  "/delete/:requiredDocumentId",
  RequiredDocumentController.deleteOne
);

export default router;
