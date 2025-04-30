import { styled } from "styled-components";

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60px;
`;
export const StatusCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
`;

export const Section = styled.div`
  margin-top: 2rem;
`;

export const AlertsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

export const AlertCard = styled.div<{ type: "triggered" | "clear" }>`
  flex: 1 1 300px;
  border-left: 5px solid
    ${({ theme, type }) =>
      type === "triggered"
        ? theme.palette.error.main
        : theme.palette.success.main};
  background: #fff;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const Meta = styled.div`
  font-size: 0.875rem;
  color: #555;
  margin-top: 0.5rem;
`;
