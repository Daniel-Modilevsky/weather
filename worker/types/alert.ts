export type AlertState = "active" | "triggered" | "disabled";

export type Alert = {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  parameter: string;
  condition: string;
  threshold: number;
  unit: string;
  isTriggered: boolean;
  state: AlertState;
  createdAt: string;
  updatedAt: string;
  clearedAt: string | null;
  lastChecked: string;
};
