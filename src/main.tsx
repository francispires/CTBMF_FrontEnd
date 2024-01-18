import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import { HashRouter} from "react-router-dom";
import {Auth0ProviderWithNavigate} from "./auth0-provider-with-navigate.jsx";
import {Provider} from "react-redux";
import {store} from './app/store'
import {Layout} from "./components/layout/layout.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
//export default MyApp;
// eslint-disable-next-line react-hooks/rules-of-hooks
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>

        <Provider store={store}>
            <HashRouter>
                <Auth0ProviderWithNavigate>
                        <NextUIProvider>
                            <Layout>
                                <ErrorBoundary>
                                <App />
                                </ErrorBoundary>
                            </Layout>
                        </NextUIProvider>
                </Auth0ProviderWithNavigate>
            </HashRouter>
        </Provider>

    </React.StrictMode>,
)
