import Redis from "ioredis";
import logger from "../lib/logger";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    logger.info(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
});

redisClient.on("error", (err: Error) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("ready", () => {
  logger.info("Redis client is ready");
});

redisClient.on("close", () => {
  logger.warn("Redis connection closed");
});

export { redisClient };
