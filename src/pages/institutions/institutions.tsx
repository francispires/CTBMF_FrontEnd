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
import {InstitutionResponseDto} from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";
import {remove} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import TTable from "../../components/table/table";
import {RenderInstitutionCell} from "./render-institution-cell.tsx";
import {AddInstitution} from "./add-institution.tsx";

export const Institutions = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [institutionIdToDelete, setInstitutionIdToDelete] = useState<string | null>(null)

    const allColumns = Object.keys(new InstitutionResponseDto())
        .filter((key) => typeof new InstitutionResponseDto()[key as keyof InstitutionResponseDto] !== 'object')
        .map((key) => {
            return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
        }) as Column[];
    allColumns.push({name: 'Ações', uid: 'actions'});

    const initialVisibleColumns = allColumns.map((c) => c.uid).filter(value => value !== "id");
    //const initialVisibleColumns = Utils.GetInitialVisibleColumns(InstitutionResponseDto);/

    const fetchData = async (institutionId: string | null) => {
        if (!institutionId) return

        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
        const url = `${apiUrl}/institutions`

        const res = await remove<boolean>(url, institutionId)

        return res
    }

    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Instituição removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a instituição.")
        }
    })

    function goToInstitutionDetailsPage(id: string) {
        navigate(`/view-institution/${id}`)
    }

    function goToEditInstitutionPage(id: string) {
        navigate(`/edit-institution/${id}`)
    }

    function openRemoveInstitutionModal(id: string) {
        setInstitutionIdToDelete(id)
        onOpen()
    }

    async function handleRemoveInstitution() {
        try {
            await mutation.mutateAsync(institutionIdToDelete)
            setInstitutionIdToDelete(null)
        } catch (error) {
            console.error(error)
        } finally {
            onClose()
        }
    }

    function handleOpenChange() {
        setInstitutionIdToDelete(() => null)
        onOpenChange()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<InstitutionResponseDto>
                what={"Instituições"}
                rowId={"Id"}
                RenderCell={RenderInstitutionCell}
                Columns={allColumns}
                url={"institutions"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddInstitution/>}
                viewItem={goToInstitutionDetailsPage}
                editItem={goToEditInstitutionPage}
                confirmRemoval={openRemoveInstitutionModal}
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
                                Remover instituição
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover a instituição?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveInstitution}
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