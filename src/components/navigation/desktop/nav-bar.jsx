import React from "react";
import { NavBarBrand } from "./nav-bar-brand.jsx";
import { NavBarButtons } from "./nav-bar-buttons.jsx";
import { NavBarTabs } from "./nav-bar-tabs.jsx";
import {Navbar} from "@nextui-org/react";

export const NavBar = () => {
  return (
      <Navbar>
          <NavBarBrand />
          <NavBarTabs />
          <NavBarButtons />
      </Navbar>
  );
};
