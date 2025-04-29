import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMockWeather } from "../hooks/useMockWeather";
import { useMockAlerts } from "../hooks/useMockAlerts";
import {
  PageContainer,
  SectionHeader,
  AnimatedWarningIcon,
  LoaderContainer,
} from "./Home.styles";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudIcon from "@mui/icons-material/Cloud";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WarningIcon from "@mui/icons-material/Warning";

export function HomePage() {
  const { data: weather, isLoading: isWeatherLoading } = useMockWeather();
  const { data: alerts, isLoading: isAlertsLoading } = useMockAlerts();

  if (isWeatherLoading || isAlertsLoading) {
    return (
      <LoaderContainer>
        <CircularProgress color="primary" />
      </LoaderContainer>
    );
  }

  const triggeredAlerts = alerts?.filter((a) => a.state === "triggered") ?? [];
  const disabledAlerts = alerts?.filter((a) => a.state === "disabled") ?? [];
  const activeAlerts = alerts?.length ?? 0;

  const getWeatherIcon = (code: string) => {
    const lower = code.toLowerCase();
    if (lower.includes("sun") || lower.includes("clear"))
      return <WbSunnyIcon sx={{ color: "#fbbf24", fontSize: 40 }} />;
    if (lower.includes("rain") || lower.includes("drizzle"))
      return <CloudIcon sx={{ color: "#3b82f6", fontSize: 40 }} />;
    if (lower.includes("thunder"))
      return <ThunderstormIcon sx={{ color: "#7c3aed", fontSize: 40 }} />;
    if (lower.includes("snow"))
      return <AcUnitIcon sx={{ color: "#93c5fd", fontSize: 40 }} />;
    return <CloudIcon sx={{ color: "#9ca3af", fontSize: 40 }} />;
  };

  const getLastUpdatedText = (timestamp: string | undefined) => {
    if (!timestamp) return "Unknown time";
    const minutesAgo = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 60000
    );
    if (minutesAgo <= 1) return "Just now";
    return `${minutesAgo} minutes ago`;
  };

  return (
    <PageContainer>
      {/* Weather Section */}
      <SectionHeader>
        <Typography variant="h5" fontWeight={600}>
          Current Weather
        </Typography>
        <Button variant="outlined" size="small">
          Refresh
        </Button>
      </SectionHeader>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            {weather?.weatherCode && getWeatherIcon(weather.weatherCode)}
            <Typography variant="h6" gutterBottom>
              {weather?.temperature} {weather?.temperatureUnit}
            </Typography>
          </Box>

          <Typography color="text.secondary" gutterBottom>
            {weather?.weatherCode}
          </Typography>

          {/* Last updated info */}
          <Typography variant="caption" color="text.secondary">
            Last updated: {getLastUpdatedText(weather?.lastChecked)}
          </Typography>

          <Box display="flex" flexWrap="wrap" mt={2} gap={4}>
            <Box width={{ xs: "45%", md: "22%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Humidity
              </Typography>
              <Typography variant="body1">{weather?.humidity}%</Typography>
            </Box>

            <Box width={{ xs: "45%", md: "22%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Wind
              </Typography>
              <Typography variant="body1">
                {weather?.windSpeed} {weather?.windSpeedUnit}
              </Typography>
            </Box>

            <Box width={{ xs: "45%", md: "22%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Precipitation
              </Typography>
              <Typography variant="body1">
                {weather?.precipitationProbability}%
              </Typography>
            </Box>

            <Box width={{ xs: "45%", md: "22%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Visibility
              </Typography>
              <Typography variant="body1">{weather?.visibility} km</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alerts Section */}
      <SectionHeader style={{ marginTop: "2rem" }}>
        <Typography variant="h5" fontWeight={600}>
          Your Alerts
        </Typography>
        <Button variant="contained" size="small" color="primary">
          Manage Alerts
        </Button>
      </SectionHeader>

      <Card>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={4}>
            <Box width={{ xs: "100%", sm: "30%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Alerts
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon color="primary" />
                <Typography variant="h6">{activeAlerts}</Typography>
              </Box>
            </Box>

            <Box width={{ xs: "100%", sm: "30%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Triggered Alerts
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {triggeredAlerts.length > 0 ? (
                  <AnimatedWarningIcon />
                ) : (
                  <WarningIcon sx={{ color: "error.main" }} />
                )}
                <Typography variant="h6" color="error">
                  {triggeredAlerts.length}
                </Typography>
              </Box>
            </Box>

            <Box width={{ xs: "100%", sm: "30%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Disabled Alerts
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon sx={{ color: "text.secondary" }} />
                <Typography variant="h6" color="text.secondary">
                  {disabledAlerts.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
