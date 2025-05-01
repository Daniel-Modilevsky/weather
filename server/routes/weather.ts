import { Router } from "express";
import { fetchWeatherByName } from "../services/tommorow";
import logger from "../lib/logger";
import { WeatherQuerySchema } from "../schemas/weatherSchema";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { location } = WeatherQuerySchema.parse(req.query);

    logger.info(`Fetching weather for location: ${location}`);
    const data = await fetchWeatherByName(location);

    const result = {
      temperature: data?.temperature,
      temperatureUnit: "°C",
      humidity: data?.humidity,
      windSpeed: data?.windSpeed,
      windSpeedUnit: "km/h",
      precipitationProbability: data?.precipitationProbability,
      visibility: data?.visibility,
      weatherCode: data?.weatherCode || "Unknown",
      lastChecked: new Date().toISOString(),
    };

    res.json(result);
  } catch (err) {
    logger.error("🌩️ Weather API error:", err);
    next(err);
  }
});

export default router;
