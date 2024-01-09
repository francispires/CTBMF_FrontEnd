import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { NavBarTab } from "./nav-bar-tab.jsx";
import {Button, Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import {Link} from "react-router-dom";

export const NavBarTabs = () => {
  const { isAuthenticated } = useAuth0();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        {name:"Dashboard",url:"/dashboard",requireLogin:true},
        {name:"Provas",url:"/assessments",requireLogin:true},
        {name:"Relatorios",url:"/reports",requireLogin:true, children:[
                {name:"Progresso",url:"/progress"},
                {name:"Aproveitamento",url:"/performance"},
            ]},
        {name:"Sair",url:"/logout",requireLogin:true}

    ];
  return (
    // <div className="nav-bar__tabs">
    //   <NavBarTab path="/profile" label="Profile" />
    //   <NavBarTab path="/public" label="Public" />
    //   {isAuthenticated && (
    //     <>
    //       <NavBarTab path="/protected" label="Protected" />
    //       <NavBarTab path="/admin" label="Admin" />
    //     </>
    //   )}
    // </div>
      <>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
              {menuItems.filter(m=>!m.requireLogin || m.requireLogin===isAuthenticated).map((item, index) => <>
                  <NavbarItem key={`${item}-${index}`}>
                      <Link color="foreground" href={item.url}>
                          {item.name}
                      </Link>
                  </NavbarItem>
              </>)}
          </NavbarContent>
          <NavbarMenu>
              {menuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                      <Link
                          color={
                              index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                          }
                          className="w-full"
                          href="#"
                          size="lg"
                      >{item}
                      </Link>
                  </NavbarMenuItem>
              ))}
          </NavbarMenu>
      </>
  );
};
