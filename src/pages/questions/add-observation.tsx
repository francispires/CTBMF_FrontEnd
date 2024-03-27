import {
    Badge,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Textarea,
    useDisclosure,
} from "@nextui-org/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {
    ObservationRequestRequestDto, ObservationResponseDto, ObservationsRequestClient, ObservationType, PagedResult,
    QuestionResponseDto
} from "../../types_custom.ts";
import {useState} from "react";
import {get, post} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import {apiUrl} from "../../_helpers/utils.ts";
import {useQueryClient} from "@tanstack/react-query";

type Props = {
    question: QuestionResponseDto,
    observation?: string,
    type: number,
    onObservation: () => void
};

export const AddObservation = (props: Props) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [observation, setObservation] = useState<string>("");
    const [requestLength, setRequestLength] = useState<number>(props.question.observationRequests.filter(d=>d.type===props.type).length);
    const [requests,setRequests] =useState(props.question.observationRequests.filter(x => x.type === props.type));
    const typeStr = props.type === 0 ? "Ajuda" : "Reporte de Erro";
    const color = props.type === 0 ? "success" : "danger";
    const icon = props.type === 0 ? faQuestion : faFlag;
    const [sended, setSended] = useState(false);


    const addObservation = async () => {
        const url = `${apiUrl}/observations_request`;
        const o = new ObservationRequestRequestDto({
            questionId: props.question.id,
            text: observation,
            type: props.type as ObservationType
        });
        const result = await post<ObservationRequestRequestDto>(url, o);
        if (result) {
            toast.success("Solicitação enviada.");
            const obs = await get<PagedResponse<ObservationResponseDto>>(`${apiUrl}/observations_request/question/${props.question.id}`);
            setRequestLength(obs.queryable.filter(q=>q.type===props.type).length);
            setRequests(obs.queryable.filter(x => x.type === props.type));
            props.onObservation();
            setSended(true);
        } else {
            toast.error("Erro ao enviar solicitação.")
        }
    };

    return (
        <>
            <Badge content={requestLength} color={color} placement={"top-left"} size={"sm"}>
                <Button disabled={requests.length > 0} size={"sm"}
                        onPress={onOpen} color={color} title={typeStr} className={"w-8 h-8 mr-5"}>
                    <FontAwesomeIcon className={"text-white"}
                                     icon={icon}/>
                </Button>
            </Badge>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {props.type === 1 ? "" : "Solicitar observação para questão "}
                                {props.type === 0 ? "" : "Reportar erro na questão "}
                                Q{props.question.questionNumber}
                            </ModalHeader>
                            <ModalBody>
                                {(requests.length > 0 || sended) && (
                                    <Textarea disabled={true} value={requests[0].text} onValueChange={setObservation}
                                              label="Mensagem" variant="bordered"/>
                                )}
                                {requests.length > 0 || (
                                    <Textarea value={observation} onValueChange={setObservation} label="Mensagem"
                                              variant="bordered"/>
                                )}
                                {requests.length > 0 && requests[0].observations.length > 0 && (
                                <Textarea className={""} disabled={true} value={requests[0].observations[0].text} onValueChange={setObservation}
                                          label={"Mensagem do Professor " + requests[0].observations[0].user?.name} variant="faded" classNames={{input:"bg-danger-300",inputWrapper:"bg-danger-300"}}/>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={onClose}>
                                    Fechar
                                </Button>
                                {requests.length == 0 && !sended && (
                                    <Button onClick={addObservation} color="primary" onPress={onClose}>
                                        Salvar
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
