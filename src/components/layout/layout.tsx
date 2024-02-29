import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useWindowSize from "../hooks/useWindowSize";

interface Props {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const Layout = ({ children }: Props) => {
  const { width } = useWindowSize()

  const [sidebarOpen, setSidebarOpen] = React.useState(width > 768 ? true : false);
  const [_, setLocked] = useLockedBody(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarContext.Provider
        value={{
          collapsed: sidebarOpen,
          setCollapsed: handleToggleSidebar,
        }}
      >
        <section className="flex">
          <SidebarWrapper />
          <NavbarWrapper>
            {children}
          </NavbarWrapper>
        </section>
      </SidebarContext.Provider>
      {/*<ReactQueryDevtools initialIsOpen={true} />*/}
    </QueryClientProvider>
  );
};
