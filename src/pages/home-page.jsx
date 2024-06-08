import React from "react";
import { PageLayout } from "../components/page-layout.jsx";
import {Home} from "../components/home/home";
import {useAuth0} from "@auth0/auth0-react";
import {PublicPage} from "./public-page.jsx";

export const HomePage = () => {
    const { isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <PublicPage />;
    }

 return (
        <PageLayout>
            <Home />
        </PageLayout>
 );
}
