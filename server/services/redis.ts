import Redis from "ioredis";
import logger from "../lib/logger";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    logger.info(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

export { redisClient };
