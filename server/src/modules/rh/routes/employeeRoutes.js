import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import * as EmployeeController from "../controllers/employeeController.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";

const router = express.Router();

router.use(JWT.validateAccessToken);

router.use(checkModulePermission("rh", "viewer"));
router.use(checkModulePermission("rh", "editor"));
router.use(checkModulePermission("rh", "admin"));

export default router;
