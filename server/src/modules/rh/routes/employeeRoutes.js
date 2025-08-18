import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as EmployeeController from "../controllers/employeeController.js";

const employeeRoutes = express.Router();

employeeRoutes.use(JWT.validateAccessToken);
employeeRoutes.use(checkModulePermission("rh", "viewer"));

employeeRoutes.get("/get-all", EmployeeController.getAll);
employeeRoutes.get("/get-one/:employeeId", EmployeeController.getOne);

employeeRoutes.use(checkModulePermission("rh", "editor"));

employeeRoutes.patch(
  "/update-allocation/:employeeId",
  EmployeeController.updateAllocation
);

employeeRoutes.use(checkModulePermission("rh", "admin"));

employeeRoutes.post("/create", EmployeeController.create);
employeeRoutes.put("/update/:employeeId", EmployeeController.update);

export default employeeRoutes;
