import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";
import * as TeamController from "../controllers/teamController.js";

const router = express.Router();

router.use(JWT.validateAccessToken);
router.use(checkModulePermission("rh", "viewer"));

router.get("/get-all", TeamController.getAll);
router.get("/get-one/:teamId", TeamController.getOne);

router.use(checkModulePermission("rh", "editor"));

router.post("/create", TeamController.create);
router.put("/update/:teamId", TeamController.update);
router.patch("/add-employee/:teamId", TeamController.addEmployee);
router.patch("/remove-one/:teamId", TeamController.remove);
router.patch("/promote-to-manager/:teamId", TeamController.promote);
router.patch("/demote-to-employee/:teamId", TeamController.demote);

router.patch("/disable/:teamId", TeamController.disable);
router.patch("/enable/:teamId", TeamController.enable);

router.use(checkModulePermission("rh", "admin"));

router.delete("/delete/:teamId", TeamController.deleteOne);

export default router;
