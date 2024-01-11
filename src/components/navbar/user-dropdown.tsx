import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import { DarkModeSwitch } from "./darkmodeswitch";
import {useAuth0} from "@auth0/auth0-react";
import {useAppDispatch} from "../../app/hooks.ts";
import {loginAsync, logoutAsync} from "../../app/slices/auth";

export const UserDropdown = () => {
  const { isAuthenticated,logout,loginWithRedirect,user } = useAuth0();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    dispatch(logoutAsync());
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/callback",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
    dispatch(loginAsync(user as AuthUser));
  };
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>zoey@example.com</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem onClick={handleLogout} key="logout" color="danger" className={!isAuthenticated?"text-danger hidden":"text-danger"}>
          Sair
        </DropdownItem>
        <DropdownItem onClick={handleLogin} key="Login" color="danger" className={isAuthenticated?"text-danger hidden":"text-danger"}>
          Entrar
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
