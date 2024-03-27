import {createContext, useContext} from 'react';

interface SidebarContext {
    collapsed: boolean;
    setCollapsed: () => void;
    visible: boolean;
    setVisible: () => void;
    stage:number;
}

export const SidebarContext = createContext<SidebarContext>({
    collapsed: false,
    setCollapsed: () => {
    },
    visible: true,
    setVisible: () => {
    },
    stage:2
});

export const useSidebarContext = () => {
    return useContext(SidebarContext);
};
