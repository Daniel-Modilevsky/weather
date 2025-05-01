import express from "express";
import cors from "cors";
import alertsRoutes from "./routes/alerts";
import weatherRoutes from "./routes/weather";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/alerts", alertsRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/weather", weatherRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
