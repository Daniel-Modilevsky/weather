import { Alert } from "../types/alert";

export let alerts: Alert[] = [];

export function getAlerts() {
  return alerts;
}

export function addAlert(alert: Alert) {
  alerts.push(alert);
}

export function updateAlert(id: string, data: Partial<Alert>) {
  const index = alerts.findIndex((a) => a.id === id);
  if (index !== -1) {
    alerts[index] = {
      ...alerts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
}

export function deleteAlert(id: string) {
  alerts = alerts.filter((a) => a.id !== id);
}
