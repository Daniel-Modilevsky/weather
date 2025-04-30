import { Weather } from "../types/weather";

export const mockWeather: Weather = {
  temperature: 31,
  temperatureUnit: "°C",
  temperatureApparent: 34,
  humidity: 58,
  windSpeed: 4.3,
  windSpeedUnit: "m/s",
  precipitationProbability: 12,
  weatherCode: "clear",
  visibility: 9.5,
  lastChecked: new Date().toISOString(),
  localTime: new Date().toISOString(),
};
