import { useAuth0 } from "@auth0/auth0-react";
import React, {useEffect} from "react";
import { PageLayout } from "../components/page-layout.jsx";
import {useAppDispatch} from "../app/hooks.ts";
import {loginAsync} from "../app/slices/auth/index.ts";
import {useNavigate} from "react-router-dom";

export const CallbackPage = () => {
    const { error,user,isAuthenticated,getAccessTokenSilently } = useAuth0();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchToken() {
            const token = await getAccessTokenSilently();
            dispatch(loginAsync({...user, token: token}));
        }
        fetchToken().then(() => {
            navigate("/");
        });
    }, [error,user,isAuthenticated]);

  if (error) {
    return (
      <PageLayout>
        <div className="content-layout">
          <h1 id="page-title" className="content__title">
            Error
          </h1>
          <div className="content__body">
            <p id="page-description">
              <span>{error.message}</span>
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }
    navigate("/");
  return (<> </>)
};
