import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import HHControllController from "../Controllers/hhControllController.js";

const hhControllerRoutes = express.Router();

hhControllerRoutes.get("/teste", HHControllController.teste);

export default hhControllerRoutes;
