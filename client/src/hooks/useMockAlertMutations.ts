import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "../types/alert";

let mockAlerts: Alert[] = [];

export function setMockAlertsData(newData: Alert[]) {
  mockAlerts = newData;
}

export const useMockAlertMutations = () => {
  const queryClient = useQueryClient();

  const createAlert = useMutation({
    mutationFn: async (newAlert: Alert) => {
      mockAlerts.push(newAlert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const updateAlert = useMutation({
    mutationFn: async (updatedAlert: Alert) => {
      mockAlerts = mockAlerts.map((alert) =>
        alert.id === updatedAlert.id ? updatedAlert : alert
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      mockAlerts = mockAlerts.filter((alert) => alert.id !== alertId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return { createAlert, updateAlert, deleteAlert };
};
