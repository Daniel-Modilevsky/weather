import { useMockAlerts } from "../hooks/useMockAlerts";
import {
  TableContainer,
  StyledTableCell,
  StateChip,
  ActionButtonContainer,
} from "../components/alerts/AlertsTable.styles";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";
import { useState } from "react";
import AlertForm from "../components/alerts/AlertForm";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../hooks/useSnackBar";
import { AlertFormParameters } from "../types/alert";

const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export function AlertsPage() {
  const { data: alerts = [] } = useMockAlerts();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const handleAlertCreated = (formData: AlertFormParameters) => {
    console.log(formData);
    setShowModal(false);
    showSnackbar({
      message: "Alert created successfully!",
      severity: "success",
    });
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
  };

  return (
    <PageWrapper>
      <SectionHeader>
        <Typography variant="h5" fontWeight={600}>
          Alerts
        </Typography>
        <Button variant="contained" onClick={() => setShowModal(true)}>
          Create Alert
        </Button>
      </SectionHeader>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Location</StyledTableCell>
              <StyledTableCell>Parameter</StyledTableCell>
              <StyledTableCell>Condition</StyledTableCell>
              <StyledTableCell>Threshold</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>{alert.name}</TableCell>
                <TableCell>{alert.location}</TableCell>
                <TableCell>{alert.parameter}</TableCell>
                <TableCell>{alert.condition}</TableCell>
                <TableCell>
                  {alert.threshold}
                  {alert.unit}
                </TableCell>
                <TableCell>
                  <StateChip
                    label={alert.state}
                    status={alert.state}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <ActionButtonContainer>
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ActionButtonContainer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating alert */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New Weather Alert</DialogTitle>
        <DialogContent>
          <AlertForm
            onSuccess={handleAlertCreated}
            onCancel={() => setShowModal(false)}
          />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
