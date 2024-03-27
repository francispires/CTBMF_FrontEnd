import {Sidebar} from "./sidebar.styles";
import {Image} from "@nextui-org/react";
import {SidebarItem} from "./sidebar-item";
import {SidebarMenu} from "./sidebar-menu";
import {useSidebarContext} from "../layout/layout-context";
import {useAuth0} from "@auth0/auth0-react";
import {useLocation} from "react-router-dom";
import useDarkMode from "use-dark-mode";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBuilding,
    faCircleQuestion, faClipboardCheck, faDoorOpen, faGauge, faGear, faGraduationCap, faUser, faUsers
} from "@fortawesome/free-solid-svg-icons";

export const SidebarWrapper = () => {
    const {pathname} = useLocation()

    const {collapsed, setCollapsed, visible, setVisible, stage} = useSidebarContext();
    const {user} = useAuth0();
    const darkMode = useDarkMode(false);

    const iconClass = "max-w-1/4 text-gray-500";
    const iconSize = "1x";

    const isInRole = (role: string) => {
        return user && user.role && user.role.indexOf(role) > -1;
    }

    return (
        <aside className={"h-screen z-[202] sticky top-0 items-center " + (stage === 0 ? "hidden" : "")}>
            {collapsed ? (
                <div className={Sidebar.Overlay()} onClick={setCollapsed}/>
            ) : null}
            <div
                className={Sidebar({
                    collapsed: collapsed,
                    visible: visible,
                    stage: stage
                })}
            >
                <div className={Sidebar.Header()}>
                    <div className="flex items-center gap-2">
                        <Image src={darkMode.value ? "/img/LogoBlack.png" : "/img/LogoWhite.png"} width={40}
                               height={40}/>
                        {!collapsed || (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
                                    CTBMF
                                </h3>
                                <span className="text-xs font-medium text-default-500">
                Preparatório
              </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"flex flex-col justify-between " + (!collapsed ? " items-center" : "")}>
                    {/*{!collapsed && <BurguerButton/>}*/}
                    <div className={Sidebar.Body()}>
                        <SidebarItem
                            title="Agenda"
                            icon={<FontAwesomeIcon icon={faGauge} size={"1x"} title={"Agenda"}
                                                   className={"max-w-1/4 text-gray-500"}/>}
                            isActive={pathname === "/"}
                            href="/"
                        />
                        <SidebarMenu title={!collapsed ? "" : "Aluno"}>
                            <SidebarItem
                                isActive={pathname === "/dashboard"}
                                title="Minha Área"
                                icon={<FontAwesomeIcon icon={faUser} size={iconSize} title={"Minha Área"}
                                                       className={"max-w-1/4 text-gray-500"}/>}
                                href="dashboard"
                            />
                            <SidebarItem
                                isActive={pathname === "/simulados"}
                                href="simulados"
                                title="Simulados"
                                icon={<FontAwesomeIcon icon={faClipboardCheck} size={iconSize} title={"Simulados"}
                                                       className={"max-w-1/4 text-gray-500"}/>}
                            />
                            {/*<SidebarItem*/}
                            {/*  isActive={pathname === "/banco-de-questoes"}*/}
                            {/*  href="/banco-de-questoes"*/}
                            {/*  title="Flashcards "*/}
                            {/*  icon={<PaymentsIcon />}*/}
                            {/*/>*/}
                            <SidebarItem
                                isActive={pathname === "/questoes"}
                                href="/questoes"
                                title="Questões"
                                icon={<FontAwesomeIcon icon={faCircleQuestion} size={iconSize} title={"Questões"}
                                                       className={iconClass}/>}
                            />
                            {/*<SidebarItem*/}
                            {/*  isActive={pathname === "/flash-cards"}*/}
                            {/*  href="/flash-cards"*/}
                            {/*  title="Disciplinas "*/}
                            {/*  icon={<PaymentsIcon />}*/}
                            {/*/>*/}
                            {/*<CollapseItems*/}
                            {/*  icon={<ReportsIcon />}*/}
                            {/*  items={[*/}
                            {/*    new MenuItem(<BalanceIcon />, "Progresso"),*/}
                            {/*    new MenuItem(<BalanceIcon />, "Estudos")*/}
                            {/*  ]}*/}
                            {/*  title="Relatórios"*/}
                            {/*/>*/}
                        </SidebarMenu>

                        {isInRole("Teacher") && (
                            <SidebarMenu title={!collapsed ? "" : "Coordenador"}>
                                <SidebarItem
                                    isActive={pathname === "/quizzes"}
                                    href="quizzes"
                                    title="Simulados"
                                    icon={<FontAwesomeIcon icon={faClipboardCheck} size={iconSize} title={"Simulados"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/users"}
                                    href="users"
                                    title="Usuários"
                                    icon={<FontAwesomeIcon icon={faUser} size={iconSize} title={"Simulados"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/disciplines"}
                                    href="disciplines"
                                    title="Disciplinas"
                                    icon={<FontAwesomeIcon icon={faGraduationCap} size={iconSize} title={"Disciplinas"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/questions"}
                                    href="questions"
                                    title="Questões"
                                    icon={<FontAwesomeIcon icon={faCircleQuestion} size={iconSize} title={"Questões"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/institutions"}
                                    href="institutions"
                                    title="Instituições"
                                    icon={<FontAwesomeIcon icon={faBuilding} size={iconSize} title={"Instituições"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/crews"}
                                    href="crews"
                                    title="Turmas"
                                    icon={<FontAwesomeIcon icon={faUsers} size={iconSize} title={"Turmas"}
                                                           className={iconClass}/>}
                                />
                                <SidebarItem
                                    isActive={pathname === "/enrollments"}
                                    href="enrollments"
                                    title="Matrículas"
                                    icon={<FontAwesomeIcon icon={faDoorOpen} size={iconSize} title={"Matrículas"}
                                                           className={iconClass}/>}
                                />
                                {/*<SidebarItem*/}
                                {/*  isActive={pathname === "/question-banks"}*/}
                                {/*  href="question-banks"*/}
                                {/*  title="Banco de Questões"*/}
                                {/*  icon={<ReportsIcon />}*/}
                                {/*/>*/}
                                <SidebarItem
                                    isActive={pathname === "/settings"}
                                    href="settings"
                                    title="Configurações"
                                    icon={<FontAwesomeIcon icon={faGear} size={iconSize} title={"Configurações"}
                                                           className={iconClass}/>}
                                />
                            </SidebarMenu>
                        )}

                        {/*{isInRole("Admin") && (*/}
                        {/*  <SidebarMenu title="Administrador">*/}
                        {/*    <SidebarItem*/}
                        {/*      isActive={pathname === "/admin_settings"}*/}
                        {/*      title="Ajustes"*/}
                        {/*      icon={<FilterIcon />}*/}
                        {/*    />*/}
                        {/*  </SidebarMenu>*/}
                        {/*)}*/}
                    </div>
                    <div className={Sidebar.Footer()}>
                        {/*<Tooltip content={"Configurações"} color="primary">*/}
                        {/*  <div className="max-w-fit">*/}
                        {/*    <SettingsIcon />*/}
                        {/*  </div>*/}
                        {/*</Tooltip>*/}
                        {/*<Tooltip content={"Ajustes"} color="primary">*/}
                        {/*  <div className="max-w-fit">*/}
                        {/*    <FilterIcon />*/}
                        {/*  </div>*/}
                        {/*</Tooltip>*/}
                        {/*<Tooltip content={"Perfil"} color="primary">*/}
                        {/*  <Avatar*/}
                        {/*    src={user?.picture}*/}
                        {/*    size="sm"*/}
                        {/*  />*/}
                        {/*</Tooltip>*/}
                    </div>
                </div>
            </div>
        </aside>
    );
};
