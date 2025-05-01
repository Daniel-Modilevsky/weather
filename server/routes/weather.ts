import { Router } from "express";
import { fetchWeatherByName } from "../services/tommorow";
import axios from "axios";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Missing location query param" });
  }

  try {
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
    console.error("🌩️ Weather API error:", err);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

export default router;
