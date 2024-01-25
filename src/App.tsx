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
import {Questions} from "./components/questions";
import {Institutions} from "./components/institutions";
const App = () => {
    const { isLoading } = useAuth0();
    if (isLoading) {
        return (
            <div className="page-layout">
                <PageLoader />
            </div>
        );
    }
    return (
            <Routes>
                {/*Public*/}
                <Route path="/" element={<HomePage />} />
                <Route path="/public" element={<PublicPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/banco-de-questoes" element={<Login />} />
                {/*System*/}
                <Route path="/callback" element={<CallbackPage />} />
                <Route path="*" element={<NotFoundPage />} />

                {/*Authorize*/}
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/profile" element={<AuthenticationGuard component={ProfilePage} />} />
                {/*Teacher*/}
                <Route path="/users" element={<AuthenticationGuard component={Accounts} />} />
                <Route path="/disciplines" element={<AuthenticationGuard component={Disciplines} />} />
                <Route path="/questions" element={<AuthenticationGuard component={Questions} />} />
                <Route path="/institutions" element={<AuthenticationGuard component={Institutions} />} />
                {/*Admin*/}
                <Route path="/protected" element={<AuthenticationGuard component={ProtectedPage} />} />
                <Route path="/admin" element={<AuthenticationGuard component={AdminPage} />}/>
            </Routes>
    );
};
export default App;