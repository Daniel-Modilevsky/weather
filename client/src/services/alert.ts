// import { v4 as uuidv4 } from "uuid";
// import { Alert, AlertFormParameters } from "../types/alert";
// import { mockAlerts } from "../mcoks/alerts";

// let alerts: Alert[] = [...mockAlerts];

// export function createAlert(data: AlertFormParameters): Promise<Alert> {
//   if (data.latitude === undefined || data.longitude === undefined) {
//     throw new Error("Latitude and longitude are required to create an alert.");
//   }

//   const newAlert: Alert = {
//     id: uuidv4(),
//     ...data,
//     latitude: data.latitude,
//     longitude: data.longitude,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     clearedAt: null,
//     state: "active",
//     lastChecked: new Date().toISOString(),
//   };

//   alerts.push(newAlert);
//   return Promise.resolve(newAlert);
// }

// export function updateAlert(
//   id: string,
//   data: Partial<Alert>
// ): Promise<Alert | null> {
//   const index = alerts.findIndex((a) => a.id === id);
//   if (index === -1) return Promise.resolve(null);

//   alerts[index] = {
//     ...alerts[index],
//     ...data,
//     updatedAt: new Date().toISOString(),
//   };

//   return Promise.resolve(alerts[index]);
// }

// export function deleteAlert(id: string): Promise<boolean> {
//   const prevLength = alerts.length;
//   alerts = alerts.filter((a) => a.id !== id);
//   return Promise.resolve(alerts.length < prevLength);
// }

// export function getAlerts(): Promise<Alert[]> {
//   return Promise.resolve([...alerts]);
// }
