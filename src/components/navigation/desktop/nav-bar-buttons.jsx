import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { LoginButton } from "../../buttons/login-button.jsx";
import { LogoutButton } from "../../buttons/logout-button.jsx";
import { SignupButton } from "../../buttons/signup-button.jsx";

export const NavBarButtons = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__buttons">
      {!isAuthenticated && (
        <>
          <LoginButton />
          <SignupButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <LogoutButton />
        </>
      )}
    </div>
  );
};
