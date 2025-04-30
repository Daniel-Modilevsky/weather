export type AlertCondition = "greaterThan" | "lessThan" | "equals";

export type AlertParameter =
  | "temperature"
  | "precipitation"
  | "windSpeed"
  | "humidity"
  | "uvIndex"
  | "visibility";

export type AlertState =
  | "clear"
  | "triggered"
  | "cleared"
  | "disabled"
  | "active";

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
  unit: string;
  isTriggered: boolean;
  latitude?: number;
  longitude?: number;
};
