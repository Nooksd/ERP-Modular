import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import EmployeeController from "../controllers/employeeController.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";

const EmployeeRoutes = express.Router();

EmployeeRoutes.use(JWT.validateAccessToken);

EmployeeRoutes.use(checkModulePermission("rh", "viewer"));

EmployeeRoutes.get("/get-one/:employeeId", EmployeeController.getEmployee);
EmployeeRoutes.get("/get-all", EmployeeController.getAllEmployees);

EmployeeRoutes.use(checkModulePermission("rh", "admin"));

EmployeeRoutes.post("/create", EmployeeController.createEmployee);
EmployeeRoutes.put("/update/:employeeId", EmployeeController.updateEmployee);
EmployeeRoutes.delete("/delete/:employeeId", EmployeeController.deleteEmployee);

export default EmployeeRoutes;
