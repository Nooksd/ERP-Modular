import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import SliderController from "../controllers/sliderController.js";
import checkModulePermission from "../../../core/middlewares/checkModulePermission.js";
import multer from "multer";

const SliderRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

SliderRoutes.use(JWT.validateAccessToken);

SliderRoutes.use(checkModulePermission("hh", "viewer"));

SliderRoutes.post("/create", SliderController.createSlider);
SliderRoutes.get("/get-image/:link", SliderController.getImage);
SliderRoutes.get("/", SliderController.getSlider);

SliderRoutes.use(checkModulePermission("hh", "admin"));

SliderRoutes.put("/update", SliderController.updateSlider);
SliderRoutes.post(
  "/send-image",
  upload.single("image"),
  SliderController.sendImage
);

export default SliderRoutes;
