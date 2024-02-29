import {useNavigate} from "react-router-dom";
import TTable from "../../components/table/table";
import {AddCrew} from "./add-crew.tsx";
import {RenderCrewCell} from "./render-crew-cell.tsx";
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
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {apiUrl} from "../../_helpers/utils.ts";
import t from "../../_helpers/Translations.ts";

export const Crews = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [disciplineIdToDelete, setDisciplineIdToDelete] = useState<string | null>(null)

    const columns = [
        { name: t['name'], uid: 'name', sortable: true,filterable:true },
        { name: t['description'], uid: 'description', sortable: true,filterable:true },
        { name: 'Ações', uid: 'actions' },
    ] as Column[];

    const initialVisibleColumns = ["name", "description", "actions"];

    const fetchData = async (crewId: string | null) => {
        if (!crewId) return

        const url = `${apiUrl}/crews`

        return await remove<boolean>(url, crewId)
    }
    
    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryCrews']});
            toast.success("Turma removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a Turma.")
        }
    })

    function goToCrewDetailsPage(id: string) {
        navigate(`/view-crew/${id}`)
    }

    function goToEditCrewPage(id: string) {
        navigate(`/edit-crew/${id}`)
    }

    function openRemoveCrewModal(id: string) {
        setDisciplineIdToDelete(id)
        onOpen()
    }

    async function handleRemoveCrew() {
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
                what={"Turmas"}
                rowId={"Id"}
                RenderCell={RenderCrewCell}
                Columns={columns}
                url={"crews"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddCrew />}
                viewItem={goToCrewDetailsPage}
                editItem={goToEditCrewPage}
                confirmRemoval={openRemoveCrewModal}
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
                                Remover Turma
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover a turma?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveCrew}
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
