import { Alert } from "../types/alert";
import { fetchWeatherByLatLon } from "../services/tomorrow";
import logger from "../lib/logger";

export async function evaluateAlertMessage(raw: Buffer): Promise<void> {
  try {
    const alert: Alert = JSON.parse(raw.toString());
    logger.info(`Evaluating alert: ${alert.name} (${alert.id})`);

    const weather = await fetchWeatherByLatLon(alert.latitude, alert.longitude);
    if (!weather) throw new Error("Weather fetch failed");

    const actual = weather[alert.parameter as keyof typeof weather];
    const condition = alert.condition;
    const threshold = alert.threshold;

    const triggered =
      (condition === "greater_than" && actual > threshold) ||
      (condition === "less_than" && actual < threshold) ||
      (condition === "equal_to" && actual === threshold);

    logger.info(
      `Evaluation done: ${
        alert.parameter
      } = ${actual}, threshold ${condition} ${threshold} → ${
        triggered ? "TRIGGERED" : "CLEAR"
      }`
    );
  } catch (err) {
    logger.error(" Evaluation failed:", err);
  }
}
