import {RenderUserCell} from "../../components/table/render-user-cell.tsx";
import TTable from "../../components/table/table";
import {AddUser} from "./add-user.tsx";
import {UserResponseDto} from "../../types_custom.ts";
import {useState} from "react";
import {useDisclosure} from "@nextui-org/react";
export const Accounts = () => {

    const columns = [
        {name: 'Nome', uid: 'name',sortable:true,filterable:true},
        {name: 'Imagem', uid: 'image',sortable:true,filterable:true},
        {name: 'Id', uid: 'id',sortable:true,filterable:true},
        {name: 'Email', uid: 'email',sortable:true,filterable:true},
        {name: 'Matriculado', uid: 'enrollmentsCount',sortable:true,filterable:true},
        {name: 'Nascimento', uid: 'birthDay',sortable:true,filterable:true},
        {name: 'Endereço', uid: 'address',sortable:true,filterable:true},
        {name: 'Ações', uid: 'actions',sortable:true,filterable:true}
    ] as Column[];

    const initialVisibleColumns = ["image", "email",  "enrollmentsCount", "actions"];
    const { isOpen:isOpenRemove, onOpen:onOpenRemove, onOpenChange, onClose } = useDisclosure();

    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)
    function openRemoveUserModal(id: string) {
        setUserIdToDelete(id)
        onOpenRemove()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<UserResponseDto>
                luceneFilter={true}
                what={"Usuários"}
                key={"user_id"}
                rowId={"user_id"}
                RenderCell={RenderUserCell}
                Columns={columns}
                url={"users"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddUser />}>
            </TTable>
        </div>
    );
};
