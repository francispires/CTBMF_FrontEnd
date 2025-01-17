import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '../_helpers';
import {authActions, logoutAsync} from '../app/slices/auth/index.ts';
import {useAuth0} from "@auth0/auth0-react";
import {Await, useNavigate} from "react-router-dom";

export { Logout };

function Logout() {
    const {isAuthenticated,logout,loginWithRedirect } = useAuth0();
    const {navigate} = useNavigate();
    
    const handleLogout = async () => {
        await logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };
    useEffect(() => {
        handleLogout().then(s => {
            console.log(s);
            navigate('/');
        });
        loginWithRedirect();
    }, [isAuthenticated]);
    
    
    return (<></>)
}
