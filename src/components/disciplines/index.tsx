import { useNavigate } from "react-router-dom";
import TTable from "../table/table";
import { AddDiscipline } from "./add-discipline.tsx";
import { RenderDisciplineCell } from "./render-discipline-cell.tsx";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { remove } from "../../_helpers/api.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const Disciplines = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [disciplineIdToDelete, setDisciplineIdToDelete] = useState<string | null>(null)

    const columns = [
        { name: 'name', uid: 'name', sortable: true },
        { name: 'description', uid: 'description', sortable: true },
        { name: 'image', uid: 'image', sortable: true },
        { name: 'parentId', uid: 'parentId', sortable: true },
        { name: 'parentName', uid: 'parentName', sortable: true },
        { name: 'childsCount', uid: 'childsCount', sortable: true },
        { name: 'Ações', uid: 'actions' },
    ] as Column[];

    const initialVisibleColumns = ["name", "description", "parentName", "childsCount", "actions"];

    const fetchData = async (disciplineId: string | null) => {
        if (!disciplineId) return

        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
        const url = `${apiUrl}/disciplines`

        const res = await remove<boolean>(url, disciplineId)
        
        return res
    }
    
    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Disciplina removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a disciplina.")
        }
    })

    function goToDisciplineDetailsPage(id: string) {
        navigate(`/view-discipline/${id}`)
    }

    function goToEditDisciplinePage(id: string) {
        navigate(`/edit-discipline/${id}`)
    }

    function openRemoveDisciplineModal(id: string) {
        setDisciplineIdToDelete(id)
        onOpen()
    }

    async function handleRemoveDiscipline() {
        mutation.mutate(disciplineIdToDelete)
        setDisciplineIdToDelete(null)
        onClose()
    }

    function handleOpenChange() {
        setDisciplineIdToDelete(() => null)
        onOpenChange()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<Discipline>
                what={"Disciplinas"}
                rowId={"Id"}
                RenderCell={RenderDisciplineCell}
                Columns={columns}
                url={"disciplines"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddDiscipline />}
                viewItem={goToDisciplineDetailsPage}
                editItem={goToEditDisciplinePage}
                confirmRemoval={openRemoveDisciplineModal}
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
                                Remover disciplina
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover a disciplina?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveDiscipline}
                                    disabled={mutation.isPending}
                                    className="disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <Spinner size="sm" />
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
