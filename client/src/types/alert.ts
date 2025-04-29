export type AlertCondition = "greaterThan" | "lessThan" | "equals";

export type AlertParameter =
  | "temperature"
  | "precipitation"
  | "windSpeed"
  | "humidity"
  | "uvIndex"
  | "visibility";

export type AlertState = "clear" | "triggered" | "cleared" | "disabled";

export interface Alert {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  parameter: AlertParameter;
  condition: AlertCondition;
  threshold: number;
  unit: string;

  state: AlertState;
  isTriggered: boolean;

  createdAt: string;
  triggeredAt?: string;
  clearedAt?: string;
  lastChecked: string;
}

export type AlertFormErrors = {
  name?: string;
  location?: string;
  parameter?: string;
  condition?: string;
  threshold?: string;
};

export type AlertFormParameters = {
  name: string;
  location: string;
  parameter: string;
  condition: string;
  threshold: number;
};
