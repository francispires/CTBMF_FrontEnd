import React from "react";
import {useLockedBody} from "../hooks/useBodyLock";
import {NavbarWrapper} from "../navbar/navbar";
import {SidebarWrapper} from "../sidebar/sidebar";
import {SidebarContext} from "./layout-context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import useWindowSize from "../hooks/useWindowSize";

interface Props {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

export const Layout = ({children}: Props) => {
    const {width} = useWindowSize()

    const [sidebarOpen, setSidebarOpen] = React.useState(width > 768);
    const [sidebarVisible, setSidebarVisible] = React.useState(width < 500);
    const [sidebarStage, setSideBarStage] = React.useState((width < 500 ? 0 : width > 768 ? 2 : 1));
    const [_, setLocked] = useLockedBody(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setSidebarVisible(!sidebarVisible)
        setLocked(!sidebarOpen);
        if (sidebarStage==2) return setSideBarStage(1);
        if (sidebarStage==1) return setSideBarStage(0);
        if (sidebarStage==0) return setSideBarStage(2);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <SidebarContext.Provider
                value={{
                    stage: sidebarStage,
                    collapsed: sidebarOpen,
                    setCollapsed: handleToggleSidebar,
                    visible: sidebarVisible,
                    setVisible: () => setSidebarVisible(!sidebarVisible),

                }}
            >
                <section className="flex">
                    <SidebarWrapper/>
                    <NavbarWrapper>
                        {children}
                    </NavbarWrapper>
                </section>
            </SidebarContext.Provider>
            {/*<ReactQueryDevtools initialIsOpen={true} />*/}
        </QueryClientProvider>
    );
};
