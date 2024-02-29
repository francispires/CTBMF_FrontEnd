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
import {Controller, useForm} from "react-hook-form";
import Select2 from "../../components/select2";
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {string,object} from "yup";
import { toast } from "react-toastify";

const createSchema = object({
  name: string().required("Nome é obrigatório"),
  description: string().required("Descrição é obrigatória")
});

export const AddDiscipline = () => {
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Discipline>({
    resolver: yupResolver(createSchema)
  });

  const onSubmit = async (data: Discipline) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
    await post<Discipline>(`${apiUrl}/disciplines`, data as Discipline);
    await queryClient.invalidateQueries({queryKey: ['qryKey']});
    toast.success("Disciplina adicionada com sucesso")
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
                  Nova Disciplina
                </ModalHeader>
                <ModalBody>
                  <Input {...register("name")} label="Nome" variant="bordered" />
                  {errors.name && <p>{errors.name.message}</p>}
                  <Input {...register("description")} label="Descrição" variant="bordered" />
                  {errors.description && <cite className={"accent-danger"}>{errors.description.message}</cite>}
                  <Controller
                      name="parentId"
                      control={control}
                      render={({ field }) => {
                        return (
                            <Select2
                                valueProp={"id"}
                                setValue={field.onChange}
                                useKey={true}
                                textProp={"name"}
                                url={"disciplines"}
                                selectionMode="single"
                                className="max-w-xs"
                                label="Disciplina Mãe"
                                placeholder="Selecione uma disciplina">
                            </Select2>
                        );
                      }}
                  />
                  {errors.parentId && <p>{errors.parentId?.message}</p>}
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
