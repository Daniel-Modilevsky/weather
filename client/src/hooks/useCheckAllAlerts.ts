import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";

export function useCheckAllAlerts(refetch: () => void) {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/alerts/check-all`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to check all alerts");
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });
}
