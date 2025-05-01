import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../config/api";
import { useState, useEffect } from "react";

interface EvaluationStatus {
  total: number;
  processed: number;
  failed: number;
  done: string;
  startedAt: string;
  failedAlerts?: Array<{
    id: string;
    name: string;
    error: string;
  }>;
}

export function useCheckAllAlerts() {
  const queryClient = useQueryClient();
  const [evaluationStatus, setEvaluationStatus] =
    useState<EvaluationStatus | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/alerts/check-all`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to check all alerts");
      return res.json();
    },
    onSuccess: (data) => {
      // Start polling for evaluation status
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/alerts/evaluation/${data.batchId}`
          );
          if (!res.ok) throw new Error("Failed to fetch evaluation status");
          const status = await res.json();
          setEvaluationStatus(status);

          // If evaluation is complete, stop polling and refetch alerts
          if (status.done === "true") {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
          }
        } catch (error) {
          console.error("Failed to fetch evaluation status:", error);
        }
      }, 1000); // Poll every second

      setPollingInterval(interval);
    },
  });

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return {
    checkAll: mutation.mutate,
    isChecking: mutation.isPending,
    error: mutation.error,
    evaluationStatus,
  };
}
