import axios from "axios";
import { redisClient } from "./redis";
import logger from "../lib/logger";

const BASE_URL = "https://api.tomorrow.io/v4";
const REAL_TIME_URL = `${BASE_URL}/weather/realtime`;

export async function fetchWeatherByName(locationName: string) {
  const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
  const cacheKey = `weather:name:${locationName}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await axios.get(REAL_TIME_URL, {
      params: {
        location: locationName,
        apikey: TOMORROW_API_KEY,
      },
    });

    const values = response.data.data.values;
    await redisClient.set(cacheKey, JSON.stringify(values), "EX", 60 * 5); // Cache 5 min

    return values;
  } catch (err) {
    logger.error("🌩️ Weather API error:", err);
    throw new Error("Failed to fetch weather by name");
  }
}
