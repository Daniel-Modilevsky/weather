import axios from "axios";

const BASE_URL = "https://api.tomorrow.io/v4";

const tomorrowClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    apikey: process.env.TOMORROW_API_KEY,
  },
});

export default tomorrowClient;
