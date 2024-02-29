import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import {useAuth0} from "@auth0/auth0-react";
import {useAppDispatch} from "../../app/hooks.ts";
import {loginAsync, logoutAsync} from "../../app/slices/auth";
import {useEffect, useState} from "react";

export const UserDropdown = () => {
  const { isAuthenticated,logout,loginWithRedirect,user } = useAuth0();
  const [disabledKeys, setDisabledKeys] = useState<string[]>(["profile","settings","team_settings","analytics","system","configurations","logout"]);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    dispatch(logoutAsync());
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/callback",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
    dispatch(loginAsync(user as AuthUser));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setDisabledKeys(["login"]);
    } else {
      setDisabledKeys(["profile","settings","team_settings","analytics","system","configurations","logout"]);
    }
  }, [isAuthenticated]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src={user?.picture}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
          disabledKeys={disabledKeys}
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem onClick={handleLogout} key="logout" color="danger" className={!isAuthenticated?"text-danger hidden":"text-danger"}>
          Sair
        </DropdownItem>
        <DropdownItem onClick={handleLogin} key="Login" color="danger" className={isAuthenticated?"text-danger hidden":"text-danger"}>
          Entrar
        </DropdownItem>
        {/*<DropdownItem*/}
        {/*  key="profile"*/}
        {/*  className="flex flex-col justify-start w-full items-start"*/}
        {/*>*/}
        {/*  <p>Entrou como</p>*/}
        {/*  <p>{user?.email}</p>*/}
        {/*</DropdownItem>*/}
        <DropdownItem key="settings">Meu Perfil</DropdownItem>
        {/*<DropdownItem key="team_settings">Minha Turma</DropdownItem>*/}
        {/*<DropdownItem key="analytics">Estatísticas</DropdownItem>*/}
        {/*<DropdownItem key="system">Sistema</DropdownItem>*/}
        {/*<DropdownItem key="configurations">Configurations</DropdownItem>*/}
        <DropdownItem key="help_and_feedback">Ajuda & Feedback</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
