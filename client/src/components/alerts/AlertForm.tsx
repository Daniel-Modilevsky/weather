import { useState, useEffect } from "react";
import { CardHeader, TextField, Button, MenuItem, Slider } from "@mui/material";
import { AlertFormErrors, Alert, AlertFormParameters } from "../../types/alert";
import {
  FormCard,
  FormFooter,
  FormRow,
  FormWrapper,
  SliderLabel,
} from "./AlertForm.styles";

const PARAMETERS = [
  { value: "temperature", label: "Temperature", unit: "°C", min: -30, max: 50 },
  { value: "humidity", label: "Humidity", unit: "%", min: 0, max: 100 },
  { value: "windSpeed", label: "Wind Speed", unit: "km/h", min: 0, max: 200 },
  { value: "visibility", label: "Visibility", unit: "km", min: 0, max: 50 },
];

const CONDITIONS = [
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "equals", label: "Equals" },
];

type AlertFormProps = {
  onSuccess: (formData: AlertFormParameters) => void;
  onCancel: () => void;
  initialData?: Alert;
};

export default function AlertForm({
  onSuccess,
  onCancel,
  initialData,
}: AlertFormProps) {
  const [formData, setFormData] = useState<AlertFormParameters>({
    name: "",
    location: "",
    parameter: "",
    condition: "greaterThan",
    threshold: 20,
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState<AlertFormErrors>({});

  const selectedParam = PARAMETERS.find((p) => p.value === formData.parameter);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        location: initialData.location,
        parameter: initialData.parameter,
        condition: initialData.condition,
        threshold: initialData.threshold,
        latitude: 0,
        longitude: 0,
      });
    }
  }, [initialData]);

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const errs: AlertFormErrors = {};
    if (!formData.name) errs.name = "Alert name required";
    if (!formData.location) errs.location = "Location required";
    if (!formData.parameter) errs.parameter = "Parameter required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSuccess(formData);
  };

  return (
    <FormWrapper>
      <FormCard>
        <CardHeader
          title={initialData ? "Edit Alert" : "Create New Weather Alert"}
          sx={{
            background: "linear-gradient(to right, #e0ecff, #f1f5ff)",
            paddingBottom: 2,
            marginBottom: 2,
          }}
        />
        <form onSubmit={handleSubmit}>
          <FormRow>
            <TextField
              fullWidth
              label="Alert Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </FormRow>

          <FormRow>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
            />
          </FormRow>

          <FormRow style={{ display: "flex", gap: "1rem" }}>
            <TextField
              select
              label="Weather Parameter"
              value={formData.parameter}
              onChange={(e) => {
                const param = PARAMETERS.find(
                  (p) => p.value === e.target.value
                );
                handleChange("parameter", e.target.value);
                handleChange(
                  "threshold",
                  param ? (param.min + param.max) / 2 : 0
                );
              }}
              fullWidth
              error={!!errors.parameter}
            >
              {PARAMETERS.map((param) => (
                <MenuItem key={param.value} value={param.value}>
                  {param.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Condition"
              value={formData.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
              fullWidth
            >
              {CONDITIONS.map((cond) => (
                <MenuItem key={cond.value} value={cond.value}>
                  {cond.label}
                </MenuItem>
              ))}
            </TextField>
          </FormRow>

          {formData.parameter && (
            <FormRow>
              <SliderLabel>
                Threshold Value:{" "}
                <strong>
                  {formData.threshold}
                  {selectedParam?.unit}
                </strong>
              </SliderLabel>
              <Slider
                value={formData.threshold}
                min={selectedParam?.min ?? 0}
                max={selectedParam?.max ?? 100}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  handleChange("threshold", value as number)
                }
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <span>
                  {selectedParam?.min}
                  {selectedParam?.unit}
                </span>
                <span>
                  {selectedParam?.max}
                  {selectedParam?.unit}
                </span>
              </div>
            </FormRow>
          )}

          <FormFooter>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {initialData ? "Update Alert" : "Create Alert"}
            </Button>
          </FormFooter>
        </form>
      </FormCard>
    </FormWrapper>
  );
}
