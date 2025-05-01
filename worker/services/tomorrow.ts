import axios from "axios";

export async function fetchWeatherByLatLon(lat: number, lon: number) {
  const apiKey = process.env.TOMORROW_API_KEY;
  const url = `https://api.tomorrow.io/v4/weather/realtime`;

  const response = await axios.get(url, {
    params: {
      location: `${lat},${lon}`,
      apikey: apiKey,
    },
  });

  return response.data.data.values;
}
