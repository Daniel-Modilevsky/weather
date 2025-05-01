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

export type CurrentWeather = {
  temperature: number;
  temperatureUnit: string;
  humidity: number;
  windSpeed: number;
  windSpeedUnit: string;
  precipitationProbability: number;
  visibility: number;
  weatherCode: number;
  lastChecked?: string;
};
