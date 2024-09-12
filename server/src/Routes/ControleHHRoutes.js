import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import HHControllController from "../Controllers/hhControllController.js";

const HHControllerRoutes = express.Router();

HHControllerRoutes.get("/sendHH", HHControllController.sendHH);

export default HHControllerRoutes;
