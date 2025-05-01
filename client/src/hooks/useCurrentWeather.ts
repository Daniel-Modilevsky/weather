import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";

export function useCurrentWeather(locationName: string) {
  const weatherQuery = useQuery({
    queryKey: ["current-weather", locationName],
    enabled: !!locationName,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/weather?location=${encodeURIComponent(
          locationName
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
  });

  return weatherQuery;
}
