import { useAlerts } from "../hooks/useAlerts";
import { Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useMemo } from "react";
import {
  AlertCard,
  AlertsContainer,
  HeaderContainer,
  Meta,
  PageWrapper,
  Section,
  StatusCard,
} from "./styles/Status.styles";

export function AlertStatusPage() {
  const { alerts } = useAlerts();

  const triggered = useMemo(
    () => alerts.filter((a) => a.state === "triggered"),
    [alerts]
  );
  const clear = useMemo(
    () => alerts.filter((a) => a.state === "clear"),
    [alerts]
  );

  const lastUpdated = useMemo(() => {
    const timestamps = alerts.map((a) => new Date(a.lastChecked).getTime());
    const max = Math.max(...timestamps);
    return new Date(max).toLocaleTimeString();
  }, [alerts]);

  return (
    <PageWrapper>
      <HeaderContainer>
        <div>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Alert Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor all your alert conditions
          </Typography>
        </div>
        <Button
          variant="outlined"
          size="small"
          style={{ height: 30, alignSelf: "center" }}
        >
          Check Now
        </Button>
      </HeaderContainer>

      <StatusCard>
        <WarningAmberIcon fontSize="large" color="error" />
        <Typography variant="h6" fontWeight={600} mt={1}>
          {triggered.length > 0
            ? `${triggered.length} Alerts Triggered`
            : "All Clear"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {triggered.length > 0
            ? `Some of your weather alerts have been triggered.`
            : `No alerts are currently triggered.`}
        </Typography>
        <Typography mt={2} variant="caption" color="text.secondary">
          Last updated: {lastUpdated} • Checking every 10 minutes
        </Typography>
      </StatusCard>

      {triggered.length > 0 && (
        <Section>
          <Typography variant="subtitle1" fontWeight={600} color="error">
            Triggered Alerts
          </Typography>
          <AlertsContainer>
            {triggered.map((alert) => (
              <AlertCard key={alert.id} type="triggered">
                <Typography fontWeight={600}>{alert.name}</Typography>
                <Meta>{alert.location}</Meta>
                <Meta>
                  {alert.parameter} is {alert.condition} {alert.threshold}
                  {alert.unit}
                </Meta>
                <Meta>
                  Checked: {new Date(alert.lastChecked).toLocaleTimeString()}
                </Meta>
              </AlertCard>
            ))}
          </AlertsContainer>
        </Section>
      )}

      {clear.length > 0 && (
        <Section>
          <Typography variant="subtitle1" fontWeight={600} color="success.main">
            Clear Alerts
          </Typography>
          <AlertsContainer>
            {clear.map((alert) => (
              <AlertCard key={alert.id} type="clear">
                <Typography fontWeight={600}>{alert.name}</Typography>
                <Meta>{alert.location}</Meta>
                <Meta>
                  {alert.parameter} is {alert.condition} {alert.threshold}
                  {alert.unit}
                </Meta>
                <Meta>
                  Checked: {new Date(alert.lastChecked).toLocaleTimeString()}
                </Meta>
              </AlertCard>
            ))}
          </AlertsContainer>
        </Section>
      )}
    </PageWrapper>
  );
}
