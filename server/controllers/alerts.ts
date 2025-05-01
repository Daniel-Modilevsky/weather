import { v4 as uuidv4 } from "uuid";
import { Alert, AlertInput } from "../types/alert";

let alerts: Alert[] = [];

export const getAlerts = (): Alert[] => alerts;

export const createAlert = (input: AlertInput): Alert => {
  const newAlert: Alert = {
    id: uuidv4(),
    name: input.name,
    location: input.name,
    latitude: input.latitude,
    longitude: input.longitude,
    parameter: input.parameter,
    condition: input.condition,
    threshold: input.threshold,
    unit: getUnitForParameter(input.parameter),
    isTriggered: false,
    state: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clearedAt: null,
    lastChecked: new Date().toISOString(),
  };

  alerts.push(newAlert);
  return newAlert;
};

export const updateAlert = (
  id: string,
  updates: Partial<Alert>
): Alert | null => {
  const index = alerts.findIndex((a) => a.id === id);
  if (index === -1) return null;

  alerts[index] = {
    ...alerts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return alerts[index];
};

export const deleteAlert = (id: string): boolean => {
  const prevLength = alerts.length;
  alerts = alerts.filter((a) => a.id !== id);
  return alerts.length < prevLength;
};

export const loadMockAlerts = (mock: Alert[]) => {
  alerts = [...mock];
};

const getUnitForParameter = (param: string) => {
  return (
    {
      temperature: "°C",
      humidity: "%",
      windSpeed: "km/h",
      visibility: "km",
      precipitation: "mm",
    }[param] || ""
  );
};
