import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {Button} from "@nextui-org/react";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
      <Button as={Button} onClick={handleLogout} color="primary" href="#" variant="flat">
        Sair
      </Button>
  );
};
