// src/components/alerts/AlertsTable.styles.ts
import styled from "styled-components";
import { TableCell, Chip } from "@mui/material";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const StyledTableCell = styled(TableCell)`
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const StateChip = styled(Chip)<{ status: string }>`
  && {
    background-color: ${({ theme, status }) => {
      switch (status) {
        case "triggered":
          return theme.palette.error.light;
        case "active":
          return theme.palette.success.light;
        case "disabled":
          return theme.palette.grey[300];
        default:
          return theme.palette.grey[200];
      }
    }};
    color: ${({ theme, status }) => {
      switch (status) {
        case "triggered":
          return theme.palette.error.dark;
        case "active":
          return theme.palette.success.dark;
        case "disabled":
          return theme.palette.text.secondary;
        default:
          return theme.palette.text.primary;
      }
    }};
    font-weight: 600;
    text-transform: capitalize;
  }
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;
