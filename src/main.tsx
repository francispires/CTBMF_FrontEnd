import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate.jsx";
import { Provider } from "react-redux";
import { store } from './app/store'
import { Layout } from "./components/layout/layout.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { ToastContainer } from 'react-toastify';

import './index.css'
import 'react-toastify/dist/ReactToastify.css';

//export default MyApp;
// eslint-disable-next-line react-hooks/rules-of-hooks
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>

        <Provider store={store}>
            <BrowserRouter>
                <Auth0ProviderWithNavigate>
                    <NextUIProvider>
                        <Layout>
                            {/*<ErrorBoundary>*/}
                                <App />
                                <ToastContainer
                                    pauseOnHover
                                    closeOnClick
                                    theme='colored'
                                />
                            {/*</ErrorBoundary>*/}
                        </Layout>
                    </NextUIProvider>
                </Auth0ProviderWithNavigate>
            </BrowserRouter>
        </Provider>

    </React.StrictMode>,
)
