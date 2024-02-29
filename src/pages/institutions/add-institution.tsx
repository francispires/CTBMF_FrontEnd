import { useQueryClient } from "@tanstack/react-query";
import { post } from "../../_helpers/api.ts";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/index.ts";
import { InstitutionRequestDto } from "../../types_custom.ts";
import { useState } from "react";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { STATES } from "../../utils/placeholders.ts";

import {
    Button, Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, useDisclosure,
} from "@nextui-org/react";

const createSchema = yup.object({
    name: yup.string().required("Nome é obrigatório"),
    state: yup.string().required("Estado é obrigatório"),
    privateInstitution: yup.boolean().required("Tipo de Instituição é obrigatório"),
    stadual: yup.boolean().required("Tipo de Instituição é obrigatório"),
});

export const AddInstitution = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    const [isPrivate, setIsPrivate] = useState(true);
    const [isStadual, setIsStadual] = useState(false);

    const handleSetPrivate = (checked: boolean) => {
        setIsPrivate(checked);
        setIsStadual(!checked);
    }
    const handleSetStadual = (checked: boolean) => {
        setIsStadual(checked);
        setIsPrivate(!checked);
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<InstitutionRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: InstitutionRequestDto) => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        await post<InstitutionRequestDto>(`${apiUrl}/institutions`, data as InstitutionRequestDto);
        await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
        toast.success('Instituição criada com sucesso.')
        reset();
        onClose();
    };

    return (
        <div>
            <>
                <Button onPress={onOpen} color="primary">
                    Nova
                </Button>
                <Modal
                    size={"2xl"}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Nova Instituição
                                    </ModalHeader>
                                    <ModalBody>
                                        <Input {...register("name")} label="Nome" variant="bordered" />
                                        {errors.name &&
                                            <cite className={"accent-danger"}>{errors.name.message}</cite>}
                                        <Controller
                                            name="state"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Select
                                                        {...field}
                                                        selectionMode="single"
                                                        className="w-1/3"
                                                        label="Estado"
                                                        placeholder="Selecione um Estado">
                                                        {STATES.map((state) => (
                                                            <SelectItem key={state} value={state}>
                                                                {state}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                );
                                            }}
                                        />

                                        {errors.state &&
                                            <cite className={"accent-danger"}>{errors.state.message}</cite>}
                                        <Checkbox isSelected={isPrivate} onValueChange={handleSetPrivate}>
                                            Privada
                                        </Checkbox>
                                        <input {...register("privateInstitution")} type={"hidden"} value={isPrivate.toString()} />

                                        {errors.privateInstitution &&
                                            <cite className={"accent-danger"}>{errors.privateInstitution.message}</cite>}
                                        <Checkbox isSelected={isStadual} onValueChange={handleSetStadual}>
                                            Estadual
                                        </Checkbox>
                                        <input {...register("stadual")} type={"hidden"} value={isStadual.toString()} />
                                        {errors.stadual &&
                                            <cite className={"accent-danger"}>{errors.stadual.message}</cite>}

                                    </ModalBody>

                                    <ModalFooter>
                                        <Button color="danger" variant="flat" onClick={onClose}>
                                            Fechar
                                        </Button>
                                        <Button type={"submit"} onSubmit={handleSubmit(onSubmit)} color="primary">
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
