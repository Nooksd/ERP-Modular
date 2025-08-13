import express from "express";
import JWT from "../../../middlewares/jsonwebtoken.js";
import * as JobController from "../controllers/jobController.js";
import checkModulePermission from "../../../middlewares/checkModulePermission.js";

const JobRoutes = express.Router();

JobRoutes.get("/search", JobController.search);
JobRoutes.get("/get-details/:jobId", JobController.getJobDetails);
JobRoutes.post("/apply/:jobId", JobController.apply);

JobRoutes.use(JWT.validateAccessToken);

JobRoutes.use(checkModulePermission("rh", "viewer"));

JobRoutes.get("/get-all", JobController.getAllJobs);
JobRoutes.get("/get-one/:jobId", JobController.getJob);
JobRoutes.get("/get-candidate/:candidateId", JobController.getCandidate);

JobRoutes.use(checkModulePermission("rh", "editor"));

JobRoutes.post("/create", JobController.createJob);
JobRoutes.put("/update/:jobId", JobController.updateJob);
JobRoutes.put("/disable/:jobId", JobController.disableJob);
JobRoutes.put("/enable/:jobId", JobController.enableJob);
JobRoutes.put(
  "/candidate/update/:jobId/:candidateId",
  JobController.updateCandidate
);

JobRoutes.use(checkModulePermission("rh", "admin"));

JobRoutes.delete("/delete/:jobId", JobController.deleteJob);

export default JobRoutes;
