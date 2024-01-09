import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@nextui-org/react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
      <Button as={Button} onClick={handleSignUp} color="primary" href="#" variant="flat">
        Cadastrar
      </Button>
  );
};
