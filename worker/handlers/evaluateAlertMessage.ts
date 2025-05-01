import { Alert } from "../types/alert";
import { fetchWeatherByLatLon } from "../services/tomorrow";
import { redisClient } from "../services/redis";
import logger from "../lib/logger";
import { Pool } from "pg";

interface AlertMessage extends Alert {
  batchId: string;
}

interface WeatherData {
  temperature?: number;
  windSpeed?: number;
  humidity?: number;
  visibility?: number;
  precipitation?: number;
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "weather",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

export const evaluateAlertMessage = async (message: Buffer) => {
  try {
    const alert = JSON.parse(message.toString()) as AlertMessage;
    const { batchId } = alert;

    try {
      const weather = await fetchWeatherByLatLon(
        alert.latitude,
        alert.longitude
      );
      if (!weather) throw new Error("Weather fetch failed");

      const actual = weather[alert.parameter as keyof WeatherData];
      if (actual === undefined) {
        throw new Error(`Invalid weather parameter: ${alert.parameter}`);
      }

      const condition = alert.condition;
      const threshold = alert.threshold;

      const triggered =
        (condition === "greater_than" && actual > threshold) ||
        (condition === "less_than" && actual < threshold) ||
        (condition === "equal_to" && actual === threshold);

      const client = await pool.connect();
      try {
        await client.query(
          `UPDATE alerts 
           SET state = $1, 
               is_triggered = $2, 
               last_checked = NOW(),
               updated_at = NOW()
           WHERE id = $3`,
          [triggered ? "triggered" : "clear", triggered, alert.id]
        );
      } finally {
        client.release();
      }

      await redisClient.hincrby(`evaluation:batch:${batchId}`, "processed", 1);

      const status = await redisClient.hgetall(`evaluation:batch:${batchId}`);
      if (parseInt(status.processed) === parseInt(status.total)) {
        await redisClient.hset(`evaluation:batch:${batchId}`, "done", "true");
      }

      logger.info(
        `Evaluation done: ${
          alert.parameter
        } = ${actual}, threshold ${condition} ${threshold} → ${
          triggered ? "TRIGGERED" : "CLEAR"
        }`
      );
    } catch (err) {
      await redisClient.rpush(
        `evaluation:failed:${batchId}`,
        JSON.stringify(alert)
      );
      await redisClient.hincrby(`evaluation:batch:${batchId}`, "failed", 1);
      throw err;
    }
  } catch (err) {
    logger.error("Failed to evaluate alert", err);
    throw err;
  }
};
