import {HouseIcon} from "../icons/breadcrumb/house-icon.tsx";
import {Button, Input, Link} from "@nextui-org/react";
import {UsersIcon} from "../icons/breadcrumb/users-icon.tsx";
import {SettingsIcon} from "../icons/sidebar/settings-icon.tsx";
import {TrashIcon} from "../icons/accounts/trash-icon.tsx";
import {InfoIcon} from "../icons/accounts/info-icon.tsx";
import {DotsIcon} from "../icons/accounts/dots-icon.tsx";
import {AddUser} from "./add-user.tsx";
import {ExportIcon} from "../icons/accounts/export-icon.tsx";
import {TableWrapper} from "../table/table.tsx";
import {useEffect} from "react";
import { useAppSelector, useAppDispatch } from '../../_store/hooks'
import {userActions} from "../../_store/users.slice.js";

export const Accounts = () => {
    const dispatch = useAppDispatch()

    const { users } = useAppSelector(state => state.users);

    //const count = useAppSelector((state) => state.counter.value)

    const columns = [
        {name: 'NOME', uid: 'name'},
        {name: 'TIPO', uid: 'role'},
        {name: 'STATUS', uid: 'status'},
        {name: 'ACTIONS', uid: 'actions'},
    ];

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    return (
        <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <HouseIcon/>
                    <Link href={"/"}>
                        <span>Home</span>
                    </Link>
                    <span> / </span>{" "}
                </li>

                <li className="flex gap-2">
                    <UsersIcon/>
                    <span>Usuários</span>
                    <span> / </span>{" "}
                </li>
                <li className="flex gap-2">
                    <span>Lista</span>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Todos</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <Input
                        classNames={{
                            input: "w-full",
                            mainWrapper: "w-full",
                        }}
                        placeholder="Pesquisar"
                    />
                    <SettingsIcon/>
                    <TrashIcon/>
                    <InfoIcon/>
                    <DotsIcon/>
                </div>
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <AddUser/>
                    <Button color="primary" startContent={<ExportIcon/>}>
                        Exportar
                    </Button>
                </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <TableWrapper/>
            </div>
        </div>
    );
};