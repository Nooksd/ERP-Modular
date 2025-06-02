import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import EmployeeController from "../controllers/employeeController.js";

const EmployeeRoutes = express.Router();

EmployeeRoutes.use(JWT.validateAccessToken);

EmployeeRoutes.get("/get-one/:employeeId", EmployeeController.getEmployee);
EmployeeRoutes.post("/create", EmployeeController.createEmployee);
EmployeeRoutes.get("/get-all", EmployeeController.getAllEmployees);
EmployeeRoutes.put("/update/:employeeId", EmployeeController.updateEmployee);
EmployeeRoutes.delete("/delete/:employeeId", EmployeeController.deleteEmployee);

export default EmployeeRoutes;
