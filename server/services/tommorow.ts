import axios from "axios";
import { redis } from "./redis";

const BASE_URL = "https://api.tomorrow.io/v4";
const REAL_TIME_URL = `${BASE_URL}/weather/realtime`;

export async function fetchWeatherByName(locationName: string) {
  const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
  const cacheKey = `weather:name:${locationName}`;
  const cached = await redis.get(cacheKey);

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
    await redis.set(cacheKey, JSON.stringify(values), "EX", 60 * 5); // Cache 5 min

    return values;
  } catch (err) {
    console.error("🌩️ Weather API error:", err);
    throw new Error("Failed to fetch weather by name");
  }
}
