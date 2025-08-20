import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as HolidayController from "../controllers/holidayController.js";

const holidayRoutes = express.Router();

holidayRoutes.use(JWT.validateAccessToken);
holidayRoutes.use(checkModulePermission("rh", "viewer"));

holidayRoutes.get("/by-date-range", HolidayController.getByDateRange);
holidayRoutes.get("/check", HolidayController.checkHoliday);
holidayRoutes.get("/get-all", HolidayController.getAll);
holidayRoutes.get("/get-one/:holidayId", HolidayController.getOne);

holidayRoutes.use(checkModulePermission("rh", "editor"));

holidayRoutes.post("/create", HolidayController.create);
holidayRoutes.put("/update/:holidayId", HolidayController.update);
holidayRoutes.patch("/disable/:holidayId", HolidayController.disable);
holidayRoutes.patch("/enable/:holidayId", HolidayController.enable);

holidayRoutes.use(checkModulePermission("rh", "admin"));

holidayRoutes.delete("/delete/:holidayId", HolidayController.deleteOne);

export default holidayRoutes;
