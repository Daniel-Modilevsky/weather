import { useAlerts } from "../hooks/useAlerts";
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
import { useState } from "react";
import AlertForm from "../components/alerts/AlertForm";
import { useSnackbar } from "../hooks/useSnackBar";
import { Alert } from "../types/alert";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { PageWrapper, SectionHeader } from "./styles/Alert.styles";

export function AlertsPage() {
  const { alerts, removeAlert, editAlert } = useAlerts();
  const [showModal, setShowModal] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  const handleAlertCreated = () => {
    setShowModal(false);
    showSnackbar({
      message: "Alert created successfully!",
      severity: "success",
    });
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
            {alerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No alerts found. Create your first weather alert.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
                    <IconButton
                      size="small"
                      onClick={() => setAlertToDelete(alert)}
                    >
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
      <ConfirmDialog
        open={!!alertToDelete}
        message={`Are you sure you want to delete the alert "${alertToDelete?.name}"?`}
        onCancel={() => setAlertToDelete(null)}
        onConfirm={() => {
          if (alertToDelete) {
            removeAlert(alertToDelete.id);
            showSnackbar({
              message: "Alert deleted successfully",
              severity: "success",
            });
            setAlertToDelete(null);
          }
        }}
      />
    </PageWrapper>
  );
}
