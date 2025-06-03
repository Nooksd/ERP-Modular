import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URL_PROD
      : process.env.MONGODB_URL_DEV,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB conectado com sucesso");
  })
  .catch(() => {
    console.log("Erro ao conectar ao MongoDB");
  });
