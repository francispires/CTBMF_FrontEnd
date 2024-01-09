import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "use-dark-mode";


export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_REACT_APP_AUTH0_AUDIENCE;
  const darkMode = useDarkMode(false);
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!(domain && clientId && redirectUri && audience)) {
    return null;
  }

  return (
      <main className={`${darkMode.value ? 'dark' : ''} text-foreground bg-background`}>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
              audience: audience,
              redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
          {children}
        </Auth0Provider>
      </main>

  );
};
