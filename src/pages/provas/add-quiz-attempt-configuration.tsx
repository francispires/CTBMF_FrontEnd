import {
  Button, Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Selection,
  useDisclosure,
} from "@nextui-org/react";
import {Controller, useForm} from "react-hook-form";
import {QuestionBankRequestDto, QuizAttemptConfigurationRequestDto} from "../../types_custom.ts";
import {object} from "yup";
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {post} from "../../_helpers/api.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import ImageUpload from "../../components/image-upload";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import {QuestionPicker} from "../questions/question-picker.tsx";

const createSchema = object().shape({
});

export const AddQuizAttemptConfiguration = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [boards, setBoards] = useState([""]);
  const [description, setDescription] = useState("");
  const [institutionIds, setInstitutionIds] = useState([""]);
  const [isActive, setIsActive] = useState(true);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const handleSetActive = (checked: boolean) => {
    setIsActive(checked);
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<QuizAttemptConfigurationRequestDto>({
    resolver: yupResolver(createSchema)
  });
  const onSubmit = async (data: QuizAttemptConfigurationRequestDto) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    data.questionsIds = Array.from(selectedKeys).join(",");
    data.userIds = "";
    data.crewsIds = "";
    data.image = imageUrl;
    await post<QuizAttemptConfigurationRequestDto>(`${apiUrl}/quiz_attempt_configs`, data as QuizAttemptConfigurationRequestDto, file);
    setFile(undefined);
    await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
    onClose();
  };
  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Nova Prova
        </Button>
        <Modal
            size={"4xl"}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Nova Prova
                </ModalHeader>
                <ModalBody>
                  <ImageUpload setFile={setFile} setImageUrl={setImageUrl} folderName={"quiz-attempt-configs"}
                  />
                  <Input {...register("name")} label="Nome"
                         variant="bordered"
                  />
                  <Controller
                      name="description"
                      control={control}
                      rules={{
                        required: "Defina uma descrição",
                      }}
                      render={({ field }) => (
                          <ReactQuill
                              theme="snow"
                              {...field}
                              placeholder={"Descrição"}
                              onChange={(text) => {
                                field.onChange(text);
                              }}
                              style={{minHeight: '100px'}}
                          />
                      )}
                  />
                  {errors.description && <cite className={"text-danger"}>{errors.description.message}</cite>}
                  <Checkbox checked={true} isSelected={true} onValueChange={handleSetActive}>
                    Ativo
                  </Checkbox>
                  <QuestionPicker setSelectedKeys={setSelectedKeys} />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Fechar
                  </Button>
                  <Button type={"submit"} onSubmit={handleSubmit(onSubmit)}
                          color="primary">
                    Salvar
                  </Button>
                </ModalFooter>
              </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
