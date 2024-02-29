import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import {useQueryClient} from "@tanstack/react-query";
import {post} from "../../_helpers/api.ts";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {string,object} from "yup";
import { toast } from "react-toastify";
import {apiUrl} from "../../_helpers/utils.ts";
import {ConfigRequestDto} from "../../types_custom.ts";

const createSchema = object({
  name: string().required("Nome é obrigatório"),
  description: string().required("Descrição é obrigatória")
});

export const AddConfig = () => {
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ConfigRequestDto>({
    resolver: yupResolver(createSchema)
  });

  const onSubmit = async (data: ConfigRequestDto) => {
    await post<ConfigRequestDto>(`${apiUrl}/disciplines`, data);
    await queryClient.invalidateQueries({queryKey: ['qryConfigs']});
    toast.success("Configurações adicionada com sucesso")
    onClose();
  };

  return (
    <div>
      <>
        <Button onPress={onOpen} color="primary">
          Nova
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Nova Configuração
                </ModalHeader>
                <ModalBody>
                  <Input {...register("key")} label="Nome" variant="bordered" />
                  {errors.key && <p>{errors.key.message}</p>}
                  <Input {...register("value")} label="Descrição" variant="bordered" />
                  {errors.value && <cite className={"accent-danger"}>{errors.value.message}</cite>}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Fechar
                  </Button>
                  <Button type={"submit"} color="primary">
                    Salvar
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
