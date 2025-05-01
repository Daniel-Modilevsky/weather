import express from "express";
import cors from "cors";
import alertsRoutes from "./routes/alerts";
import weatherRoutes from "./routes/weather";
import dotenv from "dotenv";
import logger from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { initAlertProducer } from "./queues/alertProducer";
import cron from "node-cron";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/alerts", alertsRoutes);
app.use("/api/weather", weatherRoutes);

// Initialize RabbitMQ producer
initAlertProducer().catch((err: Error) => {
  logger.error("Failed to initialize RabbitMQ producer", err);
  process.exit(1);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.ENABLE_CRON === "true") {
  cron.schedule("*/10 * * * *", async () => {
    logger.info("⏰ Running scheduled alert check (every 10 min)");
    try {
      const res = await axios.post(
        `http://localhost:${port}/api/alerts/check-all`
      );
      logger.info(
        `Alert check completed: ${res.data.published}/${res.data.total} published`
      );
    } catch (err) {
      logger.error("Failed to run scheduled alert check", err);
    }
  });
}

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
