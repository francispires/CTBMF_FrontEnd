import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner, Textarea,
    useDisclosure
} from "@nextui-org/react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {get, post, remove} from "../../_helpers/api.ts";
import {PageLoader} from "../../components/page-loader.tsx";
import {FaArrowLeft} from "react-icons/fa";
import {MyCard} from "../../components/layout/MyCard.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {formatDate} from "../../utils/date.ts";
import {apiUrl, htmlText} from "../../_helpers/utils.ts";
import TTable from "../../components/table/table";
import {
    ObservationRequestDto,
    ObservationRequestResponseDto,
    ObservationResponseDto,
    QuestionResponseDto
} from "../../types_custom.ts";
import t from "../../_helpers/Translations.ts";
import {RenderObservationRequestCell} from "./render-observation-request-cell.tsx";
import {useState} from "react";
import {toast} from "react-toastify";

export default function ViewQuestion() {
    const {id} = useParams();
    const navigation = useNavigate()
    const IMAGE_PLACEHOLDER = 'https://placehold.co/600x400.jpg?text=Sem+imagem'
    const queryClient = useQueryClient();
    const {
        isOpen: isOpenRemove,
        onOpen: onOpenRemove,
        onOpenChange: onOpenChangeRemove,
        onClose: onCloseRemove
    } = useDisclosure();
    const {
        isOpen: isOpenAnswer,
        onOpen: onOpenAnswer,
        onOpenChange: onOpenChangeAnswer,
        onClose: onCloseAnswer
    } = useDisclosure();
    const [observationRequestIdToDelete, setObservationRequestIdToDelete] = useState<string | null>(null)
    const [answer, setAnswer] = useState<string | null>(null)
    const [observationSelected, setObservationSelected] = useState<ObservationRequestResponseDto | null>(null)

    const allColumns = Object.keys(new ObservationResponseDto())
        .filter((key) => typeof new ObservationResponseDto()[key as keyof ObservationResponseDto] !== 'object')
        .map((key) => {
            return {name: t[key as keyof t] || key, uid: key, sortable: true, filterable: true};
        }) as Column[];
    allColumns.push({name: 'Observações', uid: 'observationsCount'});
    allColumns.push({name: 'Resolvido', uid: 'resolved'});
    allColumns.push({name: 'Ações', uid: 'actions'});


    const initialVisibleColumns = allColumns
        .filter((c) => c.uid !== 'id' && !c.uid.endsWith("Id"))
        .map((c) => c.uid);

    const fetchData = async () => {
        const url = `${apiUrl}/questions/${id}`
        return await get<QuestionResponseDto>(url)
    }

    const removeObservation = async (observationRequestId: string | null) => {
        if (!observationRequestId) return
        const url = `${apiUrl}/observations_request`
        return await remove<boolean>(url, observationRequestId)
    }

    const answerObservation = async () => {
        if (!answer) return;
        const selected = question?.observationRequests.find((o) => o.id === observationRequestIdToDelete) || null;

        const req = new ObservationRequestDto();
        req.text = answer;
        req.questionId = id;
        req.user = selected?.user?.sid ?? "";
        const url = `${apiUrl}/observations_request/answer/${selected?.id}`
        return await post<ObservationRequestDto>(url, req)
    }

    const {isLoading, isError, data: question} = useQuery({
        queryKey: [`viewQuestion-{${id}}`],
        queryFn: fetchData,
    })

    const handleBackToQuestions = () => {
        navigation('/questions')
    }

    const mutationRemove = useMutation({
        mutationFn: removeObservation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [`viewQuestion-{${id}}`]});
            toast.success("Observação removida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao remover a Observação.")
        }
    });

    const mutationAnswer = useMutation({
        mutationFn: answerObservation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [`viewQuestion-{${id}}`]});
            toast.success("Observação respondida com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao responder a observação.")
        }
    });

    if (isLoading) {
        return (
            <PageLoader/>
        )
    }

    if (isError || !question) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-red-400">Ocorreu um erro ao buscar dados da questão.</span>
            </div>
        )
    }

    async function handleRemoveObservation() {
        mutationRemove.mutate(observationRequestIdToDelete)
        //setObservationRequestIdToDelete(null)
        onCloseRemove()
    }

    async function handleAnswerObservation() {
        mutationAnswer.mutate(observationRequestIdToDelete)
        // setObservationRequestIdToDelete(null)
        // setObservationSelected(null);
        onCloseAnswer()
    }

    function openRemoveObservationModal(id: string) {
        setObservationRequestIdToDelete(id)
        onOpenRemove()
    }

    function openAnswerObservationModal(obid: string) {
        setObservationRequestIdToDelete(obid);
        const selected = question?.observationRequests.find((o) => o.id === obid) || null;
        setObservationSelected(selected);
        onOpenAnswer();
    }

    function handleOpenChangeRemove() {
        setObservationRequestIdToDelete(() => null)
        onOpenChangeRemove()
    }

    function handleOpenChangeAnswer() {
        setObservationRequestIdToDelete(() => null)
        onOpenChangeAnswer()
    }

    function onChangeAnswer(e: any) {
        setAnswer(e.target.value);
    }

    return (
        <div>
            <Button variant="ghost" className="mb-6" onClick={handleBackToQuestions}><FaArrowLeft/> Voltar</Button>

            <span className="block mb-6 text-sm">Questão: {question.questionNumber}</span>

            <div className="w-full gap-6">
                <div className="gap-3 grid grid-cols-3">
                    <MyCard className="flex flex-col gap-3 text-sm h-full">
                        <img
                            src={question.image ? question.image : IMAGE_PLACEHOLDER}
                            alt="Questão"
                            className="rounded-xl w-full"
                            draggable={false}
                        />

                        <div className="flex">
                            <strong className="block">Banca:&nbsp;</strong>
                            <span className="block">{question.board}</span>
                        </div>
                        <div className="flex">
                            <strong className="block">Ano:&nbsp;</strong>
                            <span className="block">{question.year}</span>
                        </div>
                        <div className="flex">
                            <strong className="block">Criada em:&nbsp;</strong>
                            <span className="block">{formatDate(String(question.createdAt))}</span>
                        </div>
                        <div className="flex ml-auto rounded-xl bg-success/20 p-2">
                            <span className="block text-success font-semibold">{question.score} pontos</span>
                        </div>
                    </MyCard>
                    <MyCard className="flex-1 text-sm col-span-2 h-full">
                        <strong className="block">Descrição</strong>
                        <p dangerouslySetInnerHTML={htmlText(question.text)}></p>

                        <strong className="block mt-3">Alternativas</strong>
                        {question.alternatives.length ? (
                            <>
                                {question.alternatives.map((alternative) => (
                                    <div key={alternative.id}>
                                        {alternative.correct ? (
                                            <div className="flex gap-2 items-center rounded-xl p-2 bg-success/20">
                                                <FontAwesomeIcon className={"text-success"} icon={faCheck}/>
                                                <span dangerouslySetInnerHTML={htmlText(alternative.text)}></span>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 items-center rounded-xl p-2 bg-danger/20">
                                                <FontAwesomeIcon className={"text-danger"} icon={faCircleXmark}/>
                                                <span dangerouslySetInnerHTML={htmlText(alternative.text)}></span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <span>Sem alternativas</span>
                        )}
                    </MyCard>
                </div>
                <div className="grid grid-cols-1 mt-5">
                    <h3 className={"text-lg font-bold text-center mb-6"}>Observações solicitadas</h3>
                    <MyCard className="flex flex-col gap-3 text-sm w-full">
                        <TTable<ObservationRequestResponseDto>
                            what={"Solicitações de observação"}
                            rowId={"Id"}
                            RenderCell={RenderObservationRequestCell}
                            Columns={allColumns}
                            url={`observations_request/question/${id}`}
                            initialVisibleColumns={initialVisibleColumns}
                            viewItem={openAnswerObservationModal}
                            editItem={openAnswerObservationModal}
                            confirmRemoval={openRemoveObservationModal}
                        >
                        </TTable>
                    </MyCard>

                    <Modal
                        isOpen={isOpenRemove}
                        onOpenChange={handleOpenChangeRemove}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Remover observação
                                    </ModalHeader>
                                    <ModalBody>
                                        <span>Tem certeza que deseja remover a observação?</span>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            onClick={handleRemoveObservation}
                                            disabled={mutationRemove.isPending}
                                            className="disabled:cursor-not-allowed"
                                        >
                                            {mutationRemove.isPending ? (
                                                <Spinner size="sm"/>
                                            ) : (
                                                <span>Remover</span>
                                            )}
                                        </Button>
                                        <Button
                                            color="default"
                                            onClick={onCloseRemove}
                                            disabled={mutationRemove.isPending}
                                            className="disabled:cursor-not-allowed"
                                        >
                                            Cancelar
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal
                        isOpen={isOpenAnswer}
                        onOpenChange={handleOpenChangeAnswer}
                        placement="top-center"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Responder
                                    </ModalHeader>
                                    <ModalBody>
                                        <span>{observationSelected?.text}</span>
                                        <span>Escreva sua resposta</span>
                                        <Textarea onChange={onChangeAnswer}
                                                  label="Resposta" variant="bordered"></Textarea>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            onClick={handleAnswerObservation}
                                            disabled={mutationAnswer.isPending}
                                            className="disabled:cursor-not-allowed"
                                        >
                                            {mutationAnswer.isPending ? (
                                                <Spinner size="sm"/>
                                            ) : (
                                                <span>Responder</span>
                                            )}
                                        </Button>
                                        <Button
                                            color="default"
                                            onClick={onCloseAnswer}
                                            disabled={mutationAnswer.isPending}
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
            </div>
        </div>
    )
}
