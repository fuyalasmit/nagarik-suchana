import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './user/modules/auth/auth.routes'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes)
app.get("/", (_req, res) => {
  res.send("server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});