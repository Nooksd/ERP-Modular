import express from "express";
import JWT from "../../../core/middlewares/jsonwebtoken.js";
import SliderController from "../controllers/sliderController.js";
import multer from "multer";

const SliderRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

SliderRoutes.use(JWT.validateAccessToken);

SliderRoutes.post("/create", SliderController.createSlider);
SliderRoutes.get("/", SliderController.getSlider);
SliderRoutes.put("/update", SliderController.updateSlider);
SliderRoutes.post(
  "/send-image",
  upload.single("image"),
  SliderController.sendImage
);
SliderRoutes.get("/get-image/:link", SliderController.getImage);

export default SliderRoutes;
