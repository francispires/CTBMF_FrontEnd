import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {PageLoader} from "./components/page-loader.jsx";
import {Route, Routes} from "react-router-dom";
import {HomePage} from "./pages/home-page.jsx";
import {Login} from "./login";
import {AuthenticationGuard} from "./components/authentication-guard.jsx";
import {ProfilePage} from "./pages/profile-page.jsx";
import {PublicPage} from "./pages/public-page.jsx";
import {ProtectedPage} from "./pages/protected-page.jsx";
import {AdminPage} from "./pages/admin-page.jsx";
import {CallbackPage} from "./pages/callback-page.jsx";
import {NotFoundPage} from "./pages/not-found-page.jsx";
import {Accounts} from "./components/accounts/accounts.tsx";
import {Disciplines} from "./components/disciplines";
import {DashBoard} from "./components/dashboard/dashBoard.tsx";
const App = () => {
    const { isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="page-layout">
                <PageLoader />
            </div>
        );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks


    return (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="dashboard" element={<DashBoard />} />
                <Route path="login" element={<Login />} />
                <Route path="users" element={<Accounts />} />
                <Route path="disciplines" element={<Disciplines />} />
                <Route
                    path="profile"
                    element={<AuthenticationGuard component={ProfilePage} />}
                />
                <Route path="public" element={<PublicPage />} />
                <Route
                    path="protected"
                    element={<AuthenticationGuard component={ProtectedPage} />}
                />
                <Route
                    path="admin"
                    element={<AuthenticationGuard component={AdminPage} />}
                />
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
    );
};
export default App;