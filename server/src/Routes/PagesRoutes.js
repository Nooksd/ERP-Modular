import express from "express";
import JWT from "../Middlewares/jsonwebtoken.js";
import PageController from "../Controllers/pageController.js";

const PageRoutes = express.Router();

PageRoutes.post(
  "/add-page",
  JWT.validateAccessToken,
  PageController.createPage
);
PageRoutes.get("/get-all", JWT.validateAccessToken, PageController.getAll);

export default PageRoutes;
