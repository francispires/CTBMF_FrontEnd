import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import TTable from "../../components/table/table";
import {AddUser} from "./add-user.tsx";
import {UserResponseDto} from "../../types_custom.ts";
import {useState} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    useDisclosure
} from "@nextui-org/react";
import {toast} from "react-toastify";
import {remove} from "../../_helpers/api.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import {RenderUserCell} from "../../components/table/render-user-cell.tsx";
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
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const initialVisibleColumns = ["image", "email",  "enrollmentsCount", "actions"];
    const { isOpen:isOpenRemove, onOpen:onOpenRemove, onOpenChange, onClose } = useDisclosure();

    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null)

    const fetchData = async (userId: string | null) => {
        if (!userId) return

        return await remove<boolean>(`${apiUrl}/users`, userId)
    }
    
    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Usuário removido com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a usuário.")
        }
    })
    function goToUserDetailsPage(id: string) {
        navigate(`/view-user/${id}`)
    }

    function goToEditUserPage(id: string) {
        navigate(`/edit-user/${id}`)
    }

    function openRemoveUserModal(id: string) {
        setUserIdToDelete(id)
        onOpenRemove()
    }

    async function handleRemoveUser() {
        mutation.mutate(userIdToDelete)
        setUserIdToDelete(null)
        onClose()
    }

    function handleOpenChange() {
        setUserIdToDelete(() => null)
        onOpenChange()
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
                addNew={<AddUser />}
                viewItem={goToUserDetailsPage}
                editItem={goToEditUserPage}
                confirmRemoval={openRemoveUserModal}
                
            >
            </TTable>
            <Modal
                isOpen={isOpenRemove}
                onOpenChange={handleOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Remover usuário
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover o usuário?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveUser}
                                    disabled={mutation.isPending}
                                    className="disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <Spinner size="sm"/>
                                    ) : (
                                        <span>Remover</span>
                                    )}
                                </Button>
                                <Button
                                    color="default"
                                    onClick={onClose}
                                    disabled={mutation.isPending}
                                    className="disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};
