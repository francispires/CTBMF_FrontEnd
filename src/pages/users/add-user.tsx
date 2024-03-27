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
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {toast} from "react-toastify";
import {UserRequestDto} from "../../types_custom.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import Select2 from "../../components/select2";
import {object} from "yup";
import {element} from "./users.tsx";

const createSchema = object({

});

export const AddUser = () => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<UserRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: UserRequestDto) => {
        await post<UserRequestDto>(`${apiUrl}/${element}`, data);
        await queryClient.invalidateQueries({queryKey: [`qry_${element}`]});
        toast.success("Usuário adicionado com sucesso")
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
                                    Nova Matrícula
                                </ModalHeader>
                                <ModalBody>
                                    <Input {...register("name")} label="Nome" variant="bordered"/>
                                    {errors.name && <p>{errors.name.message}</p>}
                                    <Input {...register("email")} label="Email" variant="bordered"/>
                                    {errors.email && <p>{errors.email.message}</p>}
                                    <Controller
                                        name="crewId"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Select2
                                                    {...field}
                                                    setValue={(s:string)=>{field.onChange(s)}}
                                                    valueProp={"id"}
                                                    textProp={"name"}
                                                    useKey={true}
                                                    allowsCustomValue={false}
                                                    url={"crews"}
                                                    selectionMode="single"
                                                    className="max-w"
                                                    label="Turma"
                                                    placeholder="Selecione uma Turma">
                                                </Select2>
                                            );
                                        }}
                                    />
                                    {errors.crewId && <p>{errors.crewId.message}</p>}
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
