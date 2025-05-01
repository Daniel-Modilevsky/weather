import { styled } from "styled-components";
import { Paper } from "@mui/material";

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const SummaryBar = styled(Paper)`
  && {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const StatusCard = styled(Paper)`
  && {
    padding: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    background-color: ${({ theme }) => theme.palette.background.paper};
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Section = styled.div`
  margin-top: 2rem;
`;

export const AlertsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const AlertCard = styled(Paper)<{ type: "triggered" | "clear" }>`
  && {
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid
      ${({ theme, type }) =>
        type === "triggered"
          ? theme.palette.error.main
          : theme.palette.success.main};
    background-color: ${({ theme, type }) =>
      type === "triggered"
        ? theme.palette.error.light + "10"
        : theme.palette.success.light + "10"};

    svg {
      color: ${({ theme, type }) =>
        type === "triggered"
          ? theme.palette.error.main
          : theme.palette.success.main};
    }
  }
`;

export const Meta = styled.p`
  margin: 0.5rem 0;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.875rem;
`;

export const AlertMessage = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.palette.error.light + "20"};
  color: ${({ theme }) => theme.palette.error.main};
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
`;
