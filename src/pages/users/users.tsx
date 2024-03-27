import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
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
import {useState} from "react";
import {remove} from "../../_helpers/api.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import {toast} from "react-toastify";
import TTable from "../../components/table/table";
import {UserResponseDto} from "../../types_custom.ts";
import {RenderUserCell} from "./render-user-cell.tsx";
import {AddUser} from "./add-user.tsx";
export const element = "users";
export const Users = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [enrollIdToDelete, setEnrollIdToDelete] = useState<string | null>(null)

    const columns = [
        {name: 'Nome', uid: 'name', sortable: true, filterable: true},
        {name: 'Imagem', uid: 'image', sortable: true, filterable: true},
        {name: 'Id', uid: 'id', sortable: true, filterable: true},
        {name: 'Email', uid: 'email', sortable: true, filterable: true},
        {name: 'Matriculado', uid: 'enrollmentsCount', sortable: true, filterable: true},
        {name: 'Nascimento', uid: 'birthDay', sortable: true, filterable: true},
        {name: 'Endereço', uid: 'address', sortable: true, filterable: true},
        {name: 'Ações', uid: 'actions', sortable: true, filterable: true}
    ] as Column[];

    const initialVisibleColumns = ["image", "email", "enrollmentsCount", "actions"];

    const fetchData = async (userId: string | null) => {
        if (userId)
            return await remove<boolean>(`${apiUrl}/${element}`, userId)
    }

    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryUsers']});
            toast.success("Usuário removido com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a Usuário.")
        }
    })

    function goToEnrollDetailsPage(id: string) {
        navigate(`/view-user/${id}`)
    }

    function goToEditEnrollPage(id: string) {
        navigate(`/edit-user/${id}`)
    }

    function openRemoveEnrollModal(id: string) {
        setEnrollIdToDelete(id)
        onOpen()
    }

    async function handleRemoveEnroll() {
        mutation.mutate(enrollIdToDelete)
        setEnrollIdToDelete(null)
        onClose()
    }

    function handleOpenChange() {
        setEnrollIdToDelete(() => null)
        onOpenChange()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<UserResponseDto>
                what={"Usuários"}
                rowId={"Id"}
                RenderCell={RenderUserCell}
                Columns={columns}
                url={"users"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddUser/>}
                viewItem={goToEnrollDetailsPage}
                editItem={goToEditEnrollPage}
                confirmRemoval={openRemoveEnrollModal}
            >
            </TTable>

            <Modal
                isOpen={isOpen}
                onOpenChange={handleOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Remover Matrícula
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover a turma?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveEnroll}
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