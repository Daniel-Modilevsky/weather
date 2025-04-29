import { useState } from "react";
import { useLocation } from "react-router-dom";
import CloudIcon from "@mui/icons-material/Cloud";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  HeaderContainer,
  HeaderWrapper,
  LogoSection,
  MainContent,
  MobileMenuButton,
  MobileNavigation,
  Navigation,
  NavItem,
} from "./Layout.styles";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { label: "Dashboard", path: "/", Icon: HomeIcon },
  { label: "Alerts", path: "/alerts", Icon: NotificationsIcon },
  { label: "Status", path: "/status", Icon: LightbulbIcon },
];

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
            {menuItems.map(({ label, path, Icon }) => (
              <NavItem
                key={path}
                to={path}
                $active={location.pathname === path}
              >
                <Icon fontSize="small" />
                {label}
              </NavItem>
            ))}
          </Navigation>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>
        </HeaderContainer>

        {isMobileMenuOpen && (
          <MobileNavigation>
            {menuItems.map(({ label, path, Icon }) => (
              <NavItem
                key={path}
                to={path}
                $active={location.pathname === path}
                onClick={closeMobileMenu}
              >
                <Icon fontSize="small" />
                {label}
              </NavItem>
            ))}
          </MobileNavigation>
        )}
      </HeaderWrapper>

      <MainContent>{children}</MainContent>
    </>
  );
}
