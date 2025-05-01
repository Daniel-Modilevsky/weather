import express from "express";
import cors from "cors";
import alertsRoutes from "./routes/alerts";
import weatherRoutes from "./routes/weather";
import dotenv from "dotenv";
import logger from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { initAlertProducer } from "./queues/alertProducer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(cors());
  app.use(express.json());

  app.use("/api/alerts", alertsRoutes);
  app.use("/api/weather", weatherRoutes);
  app.get("/health", (_, res) => {
    res.json({ status: "ok" });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  await initAlertProducer();

  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server", err);
});
