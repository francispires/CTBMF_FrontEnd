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
import {QuestionResponseDto} from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";
import {remove} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import TTable from "../../components/table/table";
import {RenderQuestionCell} from "./render-question-cell.tsx";
import {AddQuestion} from "./add-question.tsx";
import {apiUrl} from "../../_helpers/utils.ts";

export const Questions = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [questionIdToDelete, setQuestionIdToDelete] = useState<string | null>(null)

    const allColumns = Object.keys(new QuestionResponseDto())
        .filter((key) => typeof new QuestionResponseDto()[key as keyof QuestionResponseDto] !== 'object')
        .map((key) => {
            return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
        }) as Column[];
    allColumns.push({name: 'Ações', uid: 'actions'});

    const initialVisibleColumns = allColumns
        .filter((c) => c.uid !== 'id' && !c.uid.endsWith("Id"))
        .map((c) => c.uid);

    const removeQuestion = async (questionId: string | null) => {
        if (!questionId) return
        const url = `${apiUrl}/questions`
        return await remove<boolean>(url, questionId)
    }

    const mutation = useMutation({
        mutationFn: removeQuestion,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            toast.success("Questão removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a questão.")
        }
    })

    function goToQuestionDetailsPage(id: string) {
        navigate(`/view-question/${id}`)
    }

    function goToEditQuestionPage(id: string) {
        navigate(`/edit-question/${id}`)
    }

    function openRemoveQuestionModal(id: string) {
        setQuestionIdToDelete(id)
        onOpen()
    }

    async function handleRemoveQuestion() {
        mutation.mutate(questionIdToDelete)
        setQuestionIdToDelete(null)
        onClose()
    }

    function handleOpenChange() {
        setQuestionIdToDelete(() => null)
        onOpenChange()
    }

    return (
        <div className="my-5 max-w-[99rem] mx-auto w-full flex flex-col gap-10">
            <TTable<QuestionResponseDto>
                what={"Questões"}
                rowId={"Id"}
                RenderCell={RenderQuestionCell}
                Columns={allColumns}
                url={"questions"}
                initialVisibleColumns={initialVisibleColumns}
                addNew={<AddQuestion/>}
                viewItem={goToQuestionDetailsPage}
                editItem={goToEditQuestionPage}
                confirmRemoval={openRemoveQuestionModal}
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
                                Remover questão
                            </ModalHeader>
                            <ModalBody>
                                <span>Tem certeza que deseja remover a questão?</span>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onClick={handleRemoveQuestion}
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