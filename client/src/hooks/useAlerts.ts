import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertFormParameters } from "../types/alert";
import { v4 as uuidv4 } from "uuid";
import { mockAlerts } from "../mocks/alerts";

let alerts: Alert[] = [...mockAlerts];

export function useAlerts() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const {
    data: alertsData = [],
    isLoading,
    error,
  } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: () => Promise.resolve([...alerts]),
  });

  const createAlert = useMutation({
    mutationFn: (data: AlertFormParameters) => {
      const unit =
        {
          temperature: "°C",
          humidity: "%",
          windSpeed: "km/h",
          visibility: "km",
        }[data.parameter] || "";

      const newAlert: Alert = {
        id: uuidv4(),
        ...data,
        unit,
        latitude: 0,
        longitude: 0,
        isTriggered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clearedAt: null,
        state: "active",
        lastChecked: new Date().toISOString(),
      };

      alerts.push(newAlert);
      return Promise.resolve(newAlert);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const updateAlert = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Alert> }) => {
      const index = alerts.findIndex((a) => a.id === id);
      if (index === -1) return Promise.resolve(null);

      alerts[index] = {
        ...alerts[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return Promise.resolve(alerts[index]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const deleteAlert = useMutation({
    mutationFn: (id: string) => {
      const prevLength = alerts.length;
      alerts = alerts.filter((a) => a.id !== id);
      return Promise.resolve(alerts.length < prevLength);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  return {
    alerts: alertsData,
    isLoading,
    error,
    selectedAlert,
    setSelectedAlert,
    addAlert: createAlert.mutate,
    editAlert: updateAlert.mutate,
    removeAlert: deleteAlert.mutate,
  };
}
