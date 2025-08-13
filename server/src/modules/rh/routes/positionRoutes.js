import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as PositionController from "../controllers/positionController.js";

const router = express.Router();

router.use(JWT.validateAccessToken);
router.use(checkModulePermission("rh", "viewer"));

router.get("/get-all", PositionController.getAll);
router.get("/get-one/:positionId", PositionController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post("/create", PositionController.create);
router.put("/update/:positionId", PositionController.update);
router.put("/disable/:positionId", PositionController.disable);
router.put("/enable/:positionId", PositionController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete("/delete/:positionId", PositionController.deleteOne);

export default router;
