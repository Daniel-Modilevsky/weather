import styled, { keyframes } from "styled-components";

export const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
`;

export const AnimatedWarningIcon = styled.div`
  color: ${({ theme }) => theme.palette.error.main};
  animation: ${pulse} 1.5s infinite;
`;

export const LoaderContainer = styled.div`
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
