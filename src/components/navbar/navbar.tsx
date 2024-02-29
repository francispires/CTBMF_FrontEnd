import { Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import { DarkModeSwitch } from "./darkmodeswitch.tsx";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent>
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          {/*<Input*/}
          {/*  startContent={null}*/}
          {/*  isClearable*/}
          {/*  className="w-full"*/}
          {/*  classNames={{*/}
          {/*    input: "w-full",*/}
          {/*    mainWrapper: "w-full",*/}
          {/*  }}*/}
          {/*  placeholder="Pesquisar..."*/}
          {/*/>*/}
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <div className="flex items-center gap-2 max-md:hidden">
            <DarkModeSwitch />
          </div>

          {/*<NotificationsDropdown />*/}
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <div className="overflow-y-auto max-h-[calc(100vh-65px)] p-6">
        {children}
      </div>
    </div>
  );
};
