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
  ObservationRequestRequestDto,
  QuestionResponseDto
} from "../../types_custom.ts";
import {useState} from "react";
import {post} from "../../_helpers/api.ts";
import {toast} from "react-toastify";

type Props = {
    question: QuestionResponseDto,
    observation?: string,
    observationRequests: ObservationRequestRequestDto[],
    type: number
};

export const AddObservation = (props:Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [observation, setObservation] = useState<string>("");

  const requests = props.observationRequests.filter(x => x.type === props.type);
  const qty = requests.length;
  const typeStr = props.type===0?"Ajuda":"Reporte de Erro";
  const color = props.type===0?"success":"danger";
  const icon = props.type===0?faQuestion:faFlag;


  const addObservation = async ()=> {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    const url = `${apiUrl}/observations_request`;
    const o = new ObservationRequestRequestDto({
      questionId : props.question.id,
      text: observation,
      type: 0
    });
    const result = await post<ObservationRequestRequestDto>(url,o);
    if (result) {
      toast.success("Solicitação enviada.");
    } else {
      toast.error("Erro ao enviar solicitação.")
    }
  };

  return (
      <>
        <Badge content={props.observationRequests.length} color={color} placement={"top-left"}>
          <Button disabled={qty>0}
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
                  {props.type===1?"":"Solicitar observação para questão "}
                  {props.type===0?"":"Reportar erro na questão "}
                  Q{props.question.questionNumber}
                </ModalHeader>
                <ModalBody>
                  {qty>0 && (
                    <Textarea disabled={true} value={requests[0].text} onValueChange={setObservation} label="Mensagem" variant="bordered" />
                  )}
                  {qty>0 || (
                    <Textarea value={observation} onValueChange={setObservation} label="Mensagem" variant="bordered" />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Fechar
                  </Button>
                  {qty==0 && (
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
