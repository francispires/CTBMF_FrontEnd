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
import t from "../../_helpers/Translations.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import {remove} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import TTable from "../../components/table/table";
import {RenderDisciplineCell} from "./render-discipline-cell.tsx";
import {AddDiscipline} from "./add-discipline.tsx";

export const Disciplines = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [disciplineIdToDelete, setDisciplineIdToDelete] = useState<string | null>(null)

    const columns = [
        {name: t['name'], uid: 'name', sortable: true, filterable: true},
        {name: t['description'], uid: 'description', sortable: true, filterable: true},
        {name: t['image'], uid: 'image', sortable: true},
        {name: t['parentId'], uid: 'parentId', sortable: true},
        {name: t['parentName'], uid: 'parentName', sortable: true, filterable: true},
        {name: t['childsCount'], uid: 'childsCount', sortable: true},
        {name: 'Ações', uid: 'actions'},
    ] as Column[];

    const initialVisibleColumns = ["name", "description", "parentName", "childsCount", "actions"];

    const fetchData = async (disciplineId: string | null) => {
        if (!disciplineId) return

        return await remove<boolean>(`${apiUrl}/disciplines`, disciplineId)
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
                addNew={<AddDiscipline/>}
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