import {useEffect} from "react";
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts'
import {fetchAllUsersAsync, userActions} from "../../app/slices/user";
import {RenderUserCell} from "../table/render-user-cell.tsx";
import AsyncTable from "../table/async-table.tsx";
import {decrement} from "../../features/counter/counterSlice.ts";

export const Accounts = () => {
    const dispatch = useAppDispatch()

    const { users,paging,isLoading } = useAppSelector(state => state.users);

    const columns = [
        {name: 'userName', uid: 'userName'},
        {name: 'Usuário', uid: 'nickName'},
        {name: 'firstName', uid: 'firstName'},
        {name: 'lastName', uid: 'lastName'},
        {name: 'fullName', uid: 'fullName'},
        {name: 'picture', uid: 'picture'},
        {name: 'status', uid: 'status'},
        {name: 'createdAt', uid: 'createdAt'},
        {name: 'lastIpAddress', uid: 'lastIpAddress'},
        {name: 'lastLogin', uid: 'lastLogin'},
        {name: 'lastPasswordReset', uid: 'lastPasswordReset'},
        {name: 'loginsCount', uid: 'loginsCount'},
        {name: 'updatedAt', uid: 'updatedAt'},
        {name: 'Id', uid: 'userId'},
        {name: 'email', uid: 'email'},
        {name: 'Ativo', uid: 'emailVerified'},
        {name: 'phoneNumber', uid: 'phoneNumber'},
        {name: 'phoneVerified', uid: 'phoneVerified'},
        {name: 'blocked', uid: 'blocked'},
        {name: 'Ações', uid: 'actions'},

    ] as Column[];

    const initialVisibleColumns = ["nickName","email", "userId",  "emailVerified", "actions"];

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <AsyncTable<AuthUser>
                paging={paging}
                fetchData={fetchAllUsersAsync}
                goto={(n:number) => dispatch(userActions.gotoPage(n))}
                onRowsPerPageChange={(n:number) => dispatch(userActions.setPageSize(n))}
                isLoading={isLoading}
                Columns={columns}
                Data={users}
                RenderCell={RenderUserCell}
                rowId={"userId"}
                initialVisibleColumns={initialVisibleColumns}
            ></AsyncTable>
        </div>
    );
};