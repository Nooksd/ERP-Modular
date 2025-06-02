import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loadModuleRoutes } from "./moduleLoader.js";
import "./src/core/db/database.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: ["Access-Control-Allow-Credentials"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

loadModuleRoutes(app).then(() => {
  app.use("/*", (req, res) => {
    res.status(404).json({
      message: "Endpoint não encontrado",
      status: false,
    });
  });

  app.use((err, req, res, next) => {
    if (err instanceof mongoose.Error && err.name === "MongooseError") {
      return res
        .status(500)
        .json({ status: false, message: "Erro interno do servidor" });
    }
    next(err);
  });

  app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
  });
});
