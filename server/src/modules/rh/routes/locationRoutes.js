import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as LocationController from "../controllers/locationController.js";

const router = express.Router();

router.use(JWT.validateAccessToken);
router.use(checkModulePermission("rh", "viewer"));

router.get("/get-all", LocationController.getAll);
router.get("/get-one/:locationId", LocationController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post("/create", LocationController.create);
router.put("/update/:locationId", LocationController.update);
router.patch("/disable/:locationId", LocationController.disable);
router.patch("/enable/:locationId", LocationController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete("/delete/:locationId", LocationController.deleteOne);

export default router;
