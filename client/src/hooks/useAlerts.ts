import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as AlertService from "../services/alert";
import { useState } from "react";
import { Alert, AlertFormParameters } from "../types/alert";

export function useAlerts() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const {
    data: alerts = [],
    isLoading,
    error,
  } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: AlertService.getAlerts,
  });

  const createAlert = useMutation({
    mutationFn: (data: AlertFormParameters) => AlertService.createAlert(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const updateAlert = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Alert> }) =>
      AlertService.updateAlert(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const deleteAlert = useMutation({
    mutationFn: AlertService.deleteAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });

  return {
    alerts,
    isLoading,
    error,
    selectedAlert,
    setSelectedAlert,
    addAlert: createAlert.mutate,
    editAlert: updateAlert.mutate,
    removeAlert: deleteAlert.mutate,
  };
}
