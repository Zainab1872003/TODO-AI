import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error.middleware.js';



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes

app.use(errorHandler);
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

export default app;