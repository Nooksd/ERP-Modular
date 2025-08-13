import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as HolidayController from "../controllers/holidayController.js";

const router = express.Router();

router.use(JWT.validateAccessToken);
router.use(checkModulePermission("rh", "viewer"));

router.get("/by-date-range", HolidayController.getByDateRange);
router.get("/check", HolidayController.checkHoliday);
router.get("/get-all", HolidayController.getAll);
router.get("/get-one/:holidayId", HolidayController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post("/create", HolidayController.create);
router.put("/update/:holidayId", HolidayController.update);
router.put("/disable/:holidayId", HolidayController.disable);
router.put("/enable/:holidayId", HolidayController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete("/delete/:holidayId", HolidayController.deleteOne);

export default router;
