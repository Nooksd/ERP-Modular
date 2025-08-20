import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as PunchClockController from "../controllers/punchClockController.js";

const punchClockRoutes = express.Router();

punchClockRoutes.use(JWT.validateAccessToken);
punchClockRoutes.use(checkModulePermission("rh", "viewer"));

punchClockRoutes.get("/get-all", PunchClockController.getAll);
punchClockRoutes.get("/get-one/:equipmentId", PunchClockController.getOne);

punchClockRoutes.use(checkModulePermission("rh", "editor"));

punchClockRoutes.post("/create", PunchClockController.create);
punchClockRoutes.put("/update/:equipmentId", PunchClockController.update);
punchClockRoutes.get(
  "/test-connection/:equipmentId",
  PunchClockController.testConnection
);

punchClockRoutes.use(checkModulePermission("rh", "admin"));

punchClockRoutes.delete("/delete/:equipmentId", PunchClockController.deleteOne);

export default punchClockRoutes;
