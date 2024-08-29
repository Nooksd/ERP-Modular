import express from 'express';
import userRoutes from './src/Routes/UserRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

import './db/database.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/user', userRoutes);

app.use('/*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint não encontrado',
    status: false,
  })
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
  console.log(`Servidor no link -> http://localhost:${port}`);
});

