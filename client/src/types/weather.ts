export interface Weather {
  temperature: number;
  temperatureUnit: string;
  temperatureApparent: number;
  humidity: number;
  windSpeed: number;
  windSpeedUnit: string;
  precipitationProbability: number;
  weatherCode: string;
  visibility: number;
  lastChecked: string;
  localTime: string;
}
