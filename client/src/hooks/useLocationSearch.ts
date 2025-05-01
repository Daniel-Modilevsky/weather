import { useQuery } from "@tanstack/react-query";
import { LocationResult } from "../types/location";

export const useLocationSearch = (query: string) => {
  return useQuery<LocationResult[]>({
    queryKey: ["locationSearch", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await fetch(`/api/weather/locations?q=${query}`);
      const data = await res.json();
      return data?.locations || [];
    },
    enabled: !!query,
  });
};
