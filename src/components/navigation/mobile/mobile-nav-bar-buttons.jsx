import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { LoginButton } from "../../buttons/login-button.jsx";
import { LogoutButton } from "../../buttons/logout-button.jsx";
import { SignupButton } from "../../buttons/signup-button.jsx";

export const MobileNavBarButtons = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="mobile-nav-bar__buttons">
      {!isAuthenticated && (
        <>
          <SignupButton />
          <LoginButton />
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
