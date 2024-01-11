import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {loginAsync} from "./slices/auth";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = ()=>{
    const { isAuthenticated,loginWithRedirect,user } = useAuth0();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect({
                appState: {
                    returnTo: "/",
                },
                authorizationParams: {
                    prompt: "login",
                },
            }).then(r =>{
                const u  = user as AuthUser;
                console.log(r);
                dispatch(loginAsync(u))
            }
            ).catch(e =>{
                console.log(e);
            });
        }
    },[]);
    return isAuthenticated;
}
