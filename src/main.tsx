import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {BrowserRouter} from "react-router-dom";
import {Auth0ProviderWithNavigate} from "./auth0-provider-with-navigate.jsx";
import {Provider} from "react-redux";
import store from './_store/store'
import {Layout} from "./components/layout/layout.tsx";
//export default MyApp;

// eslint-disable-next-line react-hooks/rules-of-hooks
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Auth0ProviderWithNavigate>
                        <NextUIProvider>
                            <Layout>
                                <App />
                            </Layout>
                        </NextUIProvider>
                </Auth0ProviderWithNavigate>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
