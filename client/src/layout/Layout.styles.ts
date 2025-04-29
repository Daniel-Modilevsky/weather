import { Link } from "react-router-dom";
import { css, styled } from "styled-components";

export const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.palette.text.primary};

  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.palette.primary.main};
    `}

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const MobileMenuButton = styled.button`
  background: none;
  border: none;
  display: none;

  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
  }
`;

export const MobileNavigation = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MainContent = styled.main`
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: calc(100vh - 64px);
  padding: 2rem 1rem;
`;
