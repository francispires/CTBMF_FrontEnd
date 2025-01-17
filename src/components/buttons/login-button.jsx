import { useAuth0} from "@auth0/auth0-react";
import React from "react";
import {Button} from "@nextui-org/react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
          <Button as={Button} onClick={handleLogin} color="primary" href="#" variant="flat">
              Login
          </Button>
  );
};
