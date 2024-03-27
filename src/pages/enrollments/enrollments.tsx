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
import {EnrollmentResponseDto} from "../../types_custom.ts";
import {RenderEnrollCell} from "./render-enroll-cell.tsx";
import {AddEnroll} from "./add-enroll.tsx";

export const element = "enrollments";
export const Enrollments = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [enrollIdToDelete, setEnrollIdToDelete] = useState<string | null>(null)

    const columns = [
        {name: t['student'], uid: 'studentName', sortable: true, filterable: true},
        {name: t['crew'], uid: 'crewName', sortable: true, filterable: true},
        {name: t['startDate'], uid: 'startDate', sortable: true, filterable: true},
        {name: t['endDate'], uid: 'endDate', sortable: true, filterable: true},
        {name: 'Ações', uid: 'actions'},
    ] as Column[];

    const initialVisibleColumns = ["studentName", "crewName", "startDate", "endDate", "actions"];

    const fetchData = async (enrollId: string | null) => {
        if (!enrollId) return

        const url = `${apiUrl}/enrollments`

        return await remove<boolean>(url, enrollId)
    }

    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Matrícula removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a Matrícula.")
        }
    })

    function goToEnrollDetailsPage(id: string) {
        navigate(`/view-enroll/${id}`)
    }

    function goToEditEnrollPage(id: string) {
        navigate(`/edit-enroll/${id}`)
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
            <TTable<EnrollmentResponseDto>
                what={"Matrículas"}
                rowId={"Id"}
                RenderCell={RenderEnrollCell}
                Columns={columns}
                url={"enrollments"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddEnroll/>}
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