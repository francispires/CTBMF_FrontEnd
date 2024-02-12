import { Sidebar } from "./sidebar.styles";
import {Avatar, Tooltip} from "@nextui-org/react";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {AcmeIcon} from "../icons/acme-icon.tsx";

class MenuItem {
  constructor(icon: React.JSX.Element, title: string) {
    this.icon = icon;
    this.title = title || "";
  }

  icon: React.ReactNode;
  title: string | undefined;
}

export const SidebarWrapper = () => {
  function useRouter() {
    return {
      pathname: window.location.pathname,
    };
  }
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();
  const { user} = useAuth0();

  const isInRole = (role: string) => {
    return user && user.role && user.role.indexOf(role) > -1;
  }

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <div className="flex items-center gap-2">
            <AcmeIcon />
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
                CTBMF
              </h3>
              <span className="text-xs font-medium text-default-500">
              Preparatório
            </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Minha Área"
              icon={<HomeIcon />}
              isActive={router.pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Aluno">
              <SidebarItem
                isActive={router.pathname === "/dashboard"}
                title="Dashboard"
                icon={<AccountsIcon />}
                href="dashboard"
              />
              <SidebarItem
                isActive={router.pathname === "/banco-de-questoes"}
                href="/banco-de-questoes"
                title="Banco de Questões"
                icon={<PaymentsIcon />}
              />
              <SidebarItem
                  isActive={router.pathname === "/questoes"}
                  href="/questoes"
                  title="questoes"
                  icon={<PaymentsIcon />}
              />
              <CollapseItems
                icon={<ReportsIcon />}
                items={[
                    new MenuItem(<BalanceIcon />,"Progresso"),
                    new MenuItem(<BalanceIcon />,"Estudos")
                ]}
                title="Relatórios"
              />
            </SidebarMenu>

            {isInRole("Teacher") && (
                <SidebarMenu title="Coordenador">
                  <SidebarItem
                      isActive={router.pathname === "/users"}
                      href="users"
                      title="Usuários"
                      icon={<CustomersIcon />}
                  />
                  <SidebarItem
                      isActive={router.pathname === "/disciplines"}
                      href="disciplines"
                      title="Disciplinas"
                      icon={<ReportsIcon />}
                  />
                  <SidebarItem
                      isActive={router.pathname === "/questions"}
                      href="questions"
                      title="Questões"
                      icon={<ReportsIcon />}
                  />
                  <SidebarItem
                      isActive={router.pathname === "/institutions"}
                      href="institutions"
                      title="Instiuições"
                      icon={<ReportsIcon />}
                  />
                  <SidebarItem
                      isActive={router.pathname === "/question-banks"}
                      href="question-banks"
                      title="Banco de Questões"
                      icon={<ReportsIcon />}
                  />
                  <SidebarItem
                      isActive={router.pathname === "/settings"}
                      title="Configrações"
                      icon={<SettingsIcon />}
                  />
                </SidebarMenu>
            )}

            {isInRole("Admin") && (
              <SidebarMenu title="Administrador">
              <SidebarItem
                isActive={router.pathname === "/admin_settings"}
                title="Ajustes"
                icon={<FilterIcon />}
              />
            </SidebarMenu>
            )}
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Configurações"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Ajustes"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Perfil"} color="primary">
              <Avatar
                src={user?.picture}
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
