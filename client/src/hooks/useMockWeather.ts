import { useQuery } from "@tanstack/react-query";
import { mockWeather } from "../mocks/weather";

export const useMockWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1200));
      return mockWeather;
    },
  });
};
