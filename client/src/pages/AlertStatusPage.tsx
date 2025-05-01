import { useAlerts } from "../hooks/useAlerts";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
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
  SummaryBar,
  AlertMessage,
} from "./styles/Status.styles";
import { useCheckAllAlerts } from "../hooks/useCheckAllAlerts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VisibilityIcon from "@mui/icons-material/Visibility";

const getAlertIcon = (parameter: string) => {
  switch (parameter.toLowerCase()) {
    case "temperature":
      return <WbSunnyIcon />;
    case "windspeed":
      return <AirIcon />;
    case "precipitation":
      return <WaterDropIcon />;
    case "visibility":
      return <VisibilityIcon />;
    default:
      return <WarningAmberIcon />;
  }
};

export function AlertStatusPage() {
  const { alerts } = useAlerts();
  const { checkAll, isChecking, evaluationStatus } = useCheckAllAlerts();

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
          variant="contained"
          size="small"
          color="primary"
          onClick={() => checkAll()}
          disabled={isChecking}
          startIcon={isChecking ? <CircularProgress size={16} /> : null}
        >
          Check Now
        </Button>
      </HeaderContainer>

      <SummaryBar>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1" color="error.main">
            {triggered.length} Triggered
          </Typography>
          <Typography variant="body1" color="text.secondary">
            |
          </Typography>
          <Typography variant="body1" color="success.main">
            {clear.length} Clear
          </Typography>
        </Box>
      </SummaryBar>

      <StatusCard>
        <WarningAmberIcon
          fontSize="large"
          color={triggered.length > 0 ? "error" : "success"}
        />
        <Typography variant="h6" fontWeight={600} mt={1}>
          {triggered.length > 0
            ? `${triggered.length} Alert${
                triggered.length > 1 ? "s" : ""
              } Triggered`
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

      {evaluationStatus && (
        <StatusCard>
          <CheckCircleIcon
            color={evaluationStatus.done === "true" ? "success" : "info"}
            fontSize="large"
          />
          <Typography variant="h6" fontWeight={600} mt={1}>
            {evaluationStatus.done === "true"
              ? "Alerts Checked"
              : "Checking Alerts..."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {evaluationStatus.processed}/{evaluationStatus.total} processed
          </Typography>
          {evaluationStatus.failed > 0 && (
            <Typography color="error" mt={1}>
              ⚠ {evaluationStatus.failed} failed
            </Typography>
          )}
          {evaluationStatus.failedAlerts?.map((alert) => (
            <Typography
              key={alert.id}
              variant="caption"
              color="error.light"
              mt={0.5}
            >
              {alert.name}: {alert.error}
            </Typography>
          ))}
        </StatusCard>
      )}

      {triggered.length > 0 && (
        <Section>
          <Typography variant="subtitle1" fontWeight={600} color="error">
            Triggered Alerts
          </Typography>
          <AlertsContainer>
            {triggered.map((alert) => (
              <AlertCard key={alert.id} type="triggered">
                <Box display="flex" alignItems="center" gap={1}>
                  {getAlertIcon(alert.parameter)}
                  <Typography fontWeight={600}>{alert.name}</Typography>
                </Box>
                <Meta>{alert.location}</Meta>
                <Meta>
                  {alert.parameter} is {alert.condition} {alert.threshold}
                  {alert.unit}
                </Meta>
                <Meta>
                  Checked: {new Date(alert.lastChecked).toLocaleTimeString()}
                </Meta>
                <AlertMessage>Alert condition has been triggered!</AlertMessage>
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
                <Box display="flex" alignItems="center" gap={1}>
                  {getAlertIcon(alert.parameter)}
                  <Typography fontWeight={600}>{alert.name}</Typography>
                </Box>
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
