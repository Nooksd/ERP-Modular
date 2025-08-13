import express from "express";
import * as DepartmentController from "../controllers/departmentController.js";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";

const departmentRoutes = express.Router();

departmentRoutes.use(JWT.validateAccessToken);
departmentRoutes.use(checkModulePermission("rh", "viewer"));

departmentRoutes.get("/get-all", DepartmentController.getAll);
departmentRoutes.get("/get-one/:departmentId", DepartmentController.getOne);

departmentRoutes.use(checkModulePermission("rh", "editor"));

departmentRoutes.post("/create", DepartmentController.create);
departmentRoutes.put("/update/:departmentId", DepartmentController.update);
departmentRoutes.put("/disable/:departmentId", DepartmentController.disable);
departmentRoutes.put("/enable/:departmentId", DepartmentController.enable);

departmentRoutes.use(checkModulePermission("rh", "admin"));

departmentRoutes.delete(
  "/delete/:departmentId",
  DepartmentController.deleteOne
);

export default departmentRoutes;
