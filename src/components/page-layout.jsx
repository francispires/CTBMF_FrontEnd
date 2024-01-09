import React from "react";
import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar.jsx";
import { PageFooter } from "./page-footer.jsx";
import {NavBar} from "./navigation/desktop/nav-bar.jsx";

export const PageLayout = ({ children }) => {
  return (
    <div className="">
      <div className="">{children}</div>
      <PageFooter />
    </div>
  );
};
