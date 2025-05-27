import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import SliderController from "../Controllers/sliderController.js";

const SliderRoutes = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

SliderRoutes.post(
  "/create",
  JWT.validateAccessToken,
  SliderController.createSlider
);
SliderRoutes.get("/get", JWT.validateAccessToken, SliderController.getSlider);
SliderRoutes.put(
  "/update",
  JWT.validateAccessToken,
  SliderController.updateSlider
);
SliderRoutes.post(
  "/send-image",
  JWT.validateAccessToken,
  upload.single("image"),
  SliderController.sendImage
);
SliderRoutes.post(
  "/get-image",
  JWT.validateAccessToken,
  SliderController.getImage
);

export default SliderRoutes;
