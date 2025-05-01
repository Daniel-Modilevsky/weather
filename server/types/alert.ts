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

export type AlertInput = {
  title: string;
  metric:
    | "temperature"
    | "humidity"
    | "windSpeed"
    | "precipitationProbability"
    | "visibility";
  condition: "greater_than" | "less_than" | "equal_to";
  threshold: number;
  name: string;
  latitude: number;
  longitude: number;
  parameter: string;
};
