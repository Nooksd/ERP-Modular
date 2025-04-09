import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import EmployeeController from "../Controllers/employeeController.js";

const EmployeeRoutes = express.Router();

EmployeeRoutes.get(
  "/get-one/:employeeId",
  JWT.validateAccessToken,
  EmployeeController.getEmployee
);
EmployeeRoutes.post(
  "/create",
  JWT.validateAccessToken,
  EmployeeController.createEmployee
);
EmployeeRoutes.get(
  "/get-all",
  JWT.validateAccessToken,
  EmployeeController.getAllEmployees
);
EmployeeRoutes.put(
  "/update/:employeeId",
  JWT.validateAccessToken,
  EmployeeController.updateEmployee
);
EmployeeRoutes.delete("/delete/:employeeId", JWT.validateAccessToken, EmployeeController.deleteEmployee)

export default EmployeeRoutes;
