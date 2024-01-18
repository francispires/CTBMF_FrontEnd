import {RenderUserCell} from "../table/render-user-cell.tsx";
import TTable from "../table/table";
import {AddUser} from "./add-user.tsx";
import React from "react";
export const Accounts = () => {

    const columns = [
        {name: 'userName', uid: 'userName',sortable:true},
        {name: 'Usuário', uid: 'nickName',sortable:true},
        {name: 'firstName', uid: 'firstName',sortable:true},
        {name: 'lastName', uid: 'lastName',sortable:true},
        {name: 'fullName', uid: 'fullName',sortable:true},
        {name: 'picture', uid: 'picture'},
        {name: 'status', uid: 'status',sortable:true},
        {name: 'createdAt', uid: 'createdAt',sortable:true},
        {name: 'lastIpAddress', uid: 'lastIpAddress',sortable:true},
        {name: 'lastLogin', uid: 'lastLogin',sortable:true},
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
            <TTable<AuthUser>
                key={"user_id"}
                rowId={"user_id"}
                RenderCell={RenderUserCell}
                Columns={columns}
                url={"users/all"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddUser />}>
            </TTable>
        </div>
    );
};
