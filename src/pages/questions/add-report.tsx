import {
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
import React, {useState} from "react";
import {post} from "../../_helpers/api.ts";
import {toast} from "react-toastify";

type Props = {
    question: QuestionResponseDto,
    disabled: boolean,
    observation?: string,
};

export const AddReport = (props:Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [observation, setObservation] = useState<string>("");

  const addObservation = async ()=> {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    const url = `${apiUrl}/observations_request`;
    const o = new ObservationRequestRequestDto({
      questionId : props.question.id,
      text: observation,
      type: 1
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
        <Button disabled={props.disabled}
                onPress={onOpen} color={"danger"} title={"Reportar Erro"} className={"w-8 h-8 mr-5"}>
          <FontAwesomeIcon className={"text-white"}
                           icon={faFlag}/>
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Nova solicitação de ajuda para questão Q{props.question.questionNumber}
                </ModalHeader>
                <ModalBody>
                  {props.disabled && (
                    <Textarea disabled={true} value={props.question.observationRequests[0].text} onValueChange={setObservation} label="Mensagem" variant="bordered" />
                  )}
                  {props.disabled || (
                    <Textarea value={observation} onValueChange={setObservation} label="Mensagem" variant="bordered" />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Fechar
                  </Button>
                  {!props.disabled && (
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
