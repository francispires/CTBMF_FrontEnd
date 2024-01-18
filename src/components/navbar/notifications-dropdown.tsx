import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import { NotificationIcon } from "../icons/navbar/notificationicon";

export const NotificationsDropdown = () => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notificações">
          <DropdownItem
            classNames={{
              base: "py-2",
              title: "text-base font-semibold",
            }}
            key="1"
            description="Aproveite e comece seus estudos com um sparring feito especialmente para você."
          >
            📣 O sparring está disponível!
          </DropdownItem>
          <DropdownItem
            key="2"
            classNames={{
              base: "py-2",
              title: "text-base font-semibold",
            }}
            description="Com um plano de estudo customizado você vai conseguir alcançar seus objetivos mais rápido."
          >
            🚀 Monte seu plano de estudos!
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
