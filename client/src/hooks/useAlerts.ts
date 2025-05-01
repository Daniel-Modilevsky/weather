import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertFormParameters } from "../types/alert";
import { toast } from "react-toastify";

export function useAlerts() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const {
    data: alerts = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/alerts");
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return res.json();
    },
  });

  const createAlert = useMutation({
    mutationFn: async (data: AlertFormParameters) => {
      const res = await fetch("http://localhost:3001/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create alert");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert created successfully");
    },
    onError: () => {
      toast.error("Failed to create alert");
    },
  });

  const updateAlert = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Alert> }) => {
      const res = await fetch(`http://localhost:3001/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update alert");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert updated successfully");
    },
    onError: () => {
      toast.error("Failed to update alert");
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3001/api/alerts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete alert");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete alert");
    },
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
    refetch,
  };
}
