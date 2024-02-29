import {useNavigate} from "react-router-dom";
import TTable from "../../components/table/table";
import {AddConfig} from "./add-config.tsx";
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
import {RenderConfigCell} from "./render-config-cell.tsx";
import {ConfigResponseDto} from "../../types_custom.ts";

export const Configs = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [disciplineIdToDelete, setConfigIdToDelete] = useState<string | null>(null)

    const columns = [
        { name: t['name'], uid: 'key', sortable: true,filterable:true },
        { name: t['value'], uid: 'value', sortable: true,filterable:true },
        { name: 'Ações', uid: 'actions' },
    ] as Column[];

    const initialVisibleColumns = ["key", "value","actions"];

    const deleteConfig = async (id:string) => {
        const url = `${apiUrl}/configs`
        return await remove<boolean>(url, id)
    }
    
    const mutation = useMutation({
        mutationFn: deleteConfig,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryConfigs']});
            toast.success("Configuração removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a configuração.")
        }
    })

    function viewConfigPage(id: string) {
        navigate(`/view-config/${id}`)
    }

    function editConfigPage(id: string) {
        navigate(`/edit-config/${id}`)
    }

    function openRemoveModal(id: string) {
        setConfigIdToDelete(id)
        onOpen()
    }

    async function handleRemoveConfig() {
        disciplineIdToDelete && mutation.mutate(disciplineIdToDelete)
        setConfigIdToDelete(null)
        onClose()
    }

    function handleOpenChange() {
        setConfigIdToDelete(() => null)
        onOpenChange()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<ConfigResponseDto>
                what={"Configurações"}
                rowId={"Id"}
                RenderCell={RenderConfigCell}
                Columns={columns}
                url={"configs"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddConfig />}
                viewItem={viewConfigPage}
                editItem={editConfigPage}
                confirmRemoval={openRemoveModal}
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
                                <span>Tem certeza que deseja remover a configuração?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveConfig}
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
