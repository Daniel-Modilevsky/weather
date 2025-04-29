// src/hooks/useMockAlerts.ts
import { useQuery } from "@tanstack/react-query";
import { Alert } from "../types/alert";
import { mockAlerts } from "../mcoks/alerts";

export function getMockAlerts(): Alert[] {
  return mockAlerts;
}

export function useMockAlerts() {
  return useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getMockAlerts();
    },
  });
}
