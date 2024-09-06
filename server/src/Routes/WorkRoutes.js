import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import WorkController from "../Controllers/workController.js";

const WorkRoutes = express.Router();

WorkRoutes.get("/teste", WorkController.teste);

export default WorkRoutes;
