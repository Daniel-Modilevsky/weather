import axios from "axios";
import { redisClient } from "./redis";
import logger from "../lib/logger";

const BASE_URL = "https://api.tomorrow.io/v4";
const REAL_TIME_URL = `${BASE_URL}/weather/realtime`;
const TIMELINE_URL = `${BASE_URL}/timelines`;

interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  visibility: number;
  precipitation: number;
  [key: string]: number;
}

interface WeatherResponse {
  data: {
    values: WeatherData;
  };
}

export async function fetchWeatherByName(
  locationName: string
): Promise<WeatherData> {
  const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
  if (!TOMORROW_API_KEY) {
    throw new Error("Tomorrow.io API key is not configured");
  }

  const cacheKey = `weather:name:${locationName}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    logger.info(`Cache hit for location: ${locationName}`);
    return JSON.parse(cached);
  }

  try {
    logger.info(`Fetching weather for location: ${locationName}`);
    const response = await axios.get<WeatherResponse>(REAL_TIME_URL, {
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
    throw new Error(`Failed to fetch weather for location: ${locationName}`);
  }
}

export async function fetchWeatherByLatLon(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
  if (!TOMORROW_API_KEY) {
    throw new Error("Tomorrow.io API key is not configured");
  }

  const cacheKey = `weather:latlon:${latitude},${longitude}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    logger.info(`Cache hit for coordinates: ${latitude},${longitude}`);
    return JSON.parse(cached);
  }

  try {
    logger.info(`Fetching weather for coordinates: ${latitude},${longitude}`);
    const response = await axios.get<WeatherResponse>(REAL_TIME_URL, {
      params: {
        location: `${latitude},${longitude}`,
        apikey: TOMORROW_API_KEY,
      },
    });

    const values = response.data.data.values;
    await redisClient.set(cacheKey, JSON.stringify(values), "EX", 60 * 5); // Cache 5 min

    return values;
  } catch (err) {
    logger.error("🌩️ Weather API error:", err);
    throw new Error(
      `Failed to fetch weather for coordinates: ${latitude},${longitude}`
    );
  }
}

export async function fetchWeatherTimeline(
  latitude: number,
  longitude: number,
  hours: number = 24
): Promise<WeatherData[]> {
  const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
  if (!TOMORROW_API_KEY) {
    throw new Error("Tomorrow.io API key is not configured");
  }

  const cacheKey = `weather:timeline:${latitude},${longitude}:${hours}h`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    logger.info(`Cache hit for timeline: ${latitude},${longitude}:${hours}h`);
    return JSON.parse(cached);
  }

  try {
    logger.info(
      `Fetching weather timeline for coordinates: ${latitude},${longitude}`
    );
    const response = await axios.get(`${TIMELINE_URL}`, {
      params: {
        location: `${latitude},${longitude}`,
        fields: [
          "temperature",
          "windSpeed",
          "humidity",
          "visibility",
          "precipitation",
        ],
        timesteps: "1h",
        startTime: "now",
        endTime: `nowPlus${hours}h`,
        apikey: TOMORROW_API_KEY,
      },
    });

    const timeline = response.data.data.timelines[0].intervals.map(
      (interval: any) => interval.values
    );
    await redisClient.set(cacheKey, JSON.stringify(timeline), "EX", 60 * 5); // Cache 5 min

    return timeline;
  } catch (err) {
    logger.error("🌩️ Weather Timeline API error:", err);
    throw new Error(
      `Failed to fetch weather timeline for coordinates: ${latitude},${longitude}`
    );
  }
}
