import TTable from "../../components/table/table";
import {AddQuizAttemptConfiguration} from "./add-quiz-attempt-configuration.tsx";
import {RenderQuizConfigCell} from "./render-quiz_config-cell.tsx";
import {useNavigate} from "react-router-dom";
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
import {QuizAttemptConfigurationResponseDto} from "../../types_custom.ts";
import {remove} from "../../_helpers/api.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";


export const QuizAttemptConfiguration = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [quizIdToDelete, setQuizIdToDelete] = useState<string | null>(null);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const columns = [
        {name: 'name', uid: 'name',sortable:true},
        {name: 'Questões', uid: 'questionsCount',sortable:true},
        {name: 'description', uid: 'description',sortable:true},
        {name: 'institution', uid: 'institution',sortable:true},
        {name: 'Ações', uid: 'actions'},
    ] as Column[];

    const initialVisibleColumns = ["name","questionsCount","description","actions"];


    const fetchData = async (quizId: string | null) => {
        if (quizId)
            return await remove<boolean>(`${apiUrl}/quiz_attempt_configs`,quizId)
    }

    const mutation = useMutation({
        mutationFn: fetchData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Simulado removido com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a Simulado.")
        }
    })

    function goToQuizDetailsPage(id: string) {
        navigate(`/view-quiz/${id}`)
    }

    function goToEditQuizPage(id: string) {
        navigate(`/edit-quiz/${id}`)
    }
    function openRemoveQuizModal(id: string) {
        setQuizIdToDelete(id)
        onOpen()
    }
    async function handleRemoveEnroll() {
        mutation.mutate(quizIdToDelete)
        setQuizIdToDelete(null)
        onClose()
    }
    function handleOpenChange() {
        setQuizIdToDelete(() => null)
        onOpenChange()
    }
    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<QuizAttemptConfigurationResponseDto>
                what={"Simulados"}
                rowId={"Id"}
                RenderCell={RenderQuizConfigCell}
                Columns={columns}
                url={"quiz_attempt_configs"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddQuizAttemptConfiguration/>}
                viewItem={goToQuizDetailsPage}
                editItem={goToEditQuizPage}
                confirmRemoval={openRemoveQuizModal}
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
                                Remover Simulado
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover o Simulado?</span>
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
