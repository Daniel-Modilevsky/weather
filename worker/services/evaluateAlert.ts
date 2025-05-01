export async function evaluateAlert(alertId: string) {
  // In-memory mock for now (will use DB later)
  console.log(`📦 Evaluating alert: ${alertId}`);

  // Here you'd:
  // - Fetch the alert (for now: log the id)
  // - Fetch current weather from Tomorrow.io using lat/lon
  // - Compare against threshold
  // - Update state (for now, just log result)

  // Simulate some logic
  const mockTriggered = Math.random() > 0.5;
  console.log(
    `🧠 Alert ${alertId} evaluated. Result: ${
      mockTriggered ? "TRIGGERED" : "NOT TRIGGERED"
    }`
  );
}
