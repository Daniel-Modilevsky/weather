import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import CloudIcon from "@mui/icons-material/Cloud";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LogoSection>
            <CloudIcon />
            Weather Alert
          </LogoSection>

          <Navigation>
            <NavItem to="/" $active={location.pathname === "/"}>
              <HomeIcon />
              Dashboard
            </NavItem>
            <NavItem to="/alerts" $active={location.pathname === "/alerts"}>
              <NotificationsIcon />
              Alerts
            </NavItem>
            <NavItem to="/status" $active={location.pathname === "/status"}>
              <LightbulbIcon />
              Status
            </NavItem>
          </Navigation>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        </HeaderContainer>

        {isMobileMenuOpen && (
          <MobileNavigation>
            <NavItem
              to="/"
              onClick={closeMobileMenu}
              $active={location.pathname === "/"}
            >
              <HomeIcon />
              Dashboard
            </NavItem>
            <NavItem
              to="/alerts"
              onClick={closeMobileMenu}
              $active={location.pathname === "/alerts"}
            >
              <NotificationsIcon />
              Alerts
            </NavItem>
            <NavItem
              to="/status"
              onClick={closeMobileMenu}
              $active={location.pathname === "/status"}
            >
              <LightbulbIcon />
              Status
            </NavItem>
          </MobileNavigation>
        )}
      </HeaderWrapper>

      <MainContent>{children}</MainContent>
    </>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const HeaderContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
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

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  display: none;

  @media (max-width: 768px) {
    display: block;
    cursor: pointer;
  }
`;

const MobileNavigation = styled.div`
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

const MainContent = styled.main`
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: calc(100vh - 64px);
  padding: 2rem 1rem;
`;
