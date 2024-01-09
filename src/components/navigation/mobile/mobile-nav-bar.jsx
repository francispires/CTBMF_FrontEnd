import React from "react";
import {
    Button,
    Navbar,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/react";
import {Link} from "react-router-dom";
import {NavBarBrand} from "../desktop/nav-bar-brand.jsx";
import {SignupButton} from "../../buttons/signup-button.jsx";
import {LoginButton} from "../../buttons/login-button.jsx";
export const MobileNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        {name:"Dashboard",url:"/dashboard"},
        {name:"Provas",url:"/assessments"},
        {name:"Relatorios",url:"/reports",children:[
                {name:"Progresso",url:"/progress"},
                {name:"Aproveitamento",url:"/performance"},
        ]},
        {name:"Sair",url:"/logout"}
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                    className="sm:hidden"
                />
                <NavBarBrand/>
            </NavbarContent>
            <NavbarContent>
                {menuItems.map((item, index) => <>
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
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
};
