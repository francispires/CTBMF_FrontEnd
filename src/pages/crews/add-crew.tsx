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
import {string, object} from "yup";
import {toast} from "react-toastify";
import {CrewRequestDto, CrewResponseDto} from "../../types_custom.ts";
import {apiUrl} from "../../_helpers/utils.ts";

const createSchema = object({
    name: string().required("Nome é obrigatório"),
    description: string().required("Descrição é obrigatória")
});

export const AddCrew = () => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<CrewResponseDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: CrewRequestDto) => {
        await post<CrewRequestDto>(`${apiUrl}/crews`, data);
        await queryClient.invalidateQueries({queryKey: ['qryCrews']});
        toast.success("Turma adicionada com sucesso")
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
                                    Nova Turma
                                </ModalHeader>
                                <ModalBody>
                                    <Input {...register("name")} label="Nome" variant="bordered"/>
                                    {errors.name && <p>{errors.name.message}</p>}
                                    <Input {...register("description")} label="Descrição" variant="bordered"/>
                                    {errors.description &&
                                        <cite className={"accent-danger"}>{errors.description.message}</cite>}
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
