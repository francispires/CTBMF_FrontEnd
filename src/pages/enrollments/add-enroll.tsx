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
//import {object} from "yup";
import {toast} from "react-toastify";
import {EnrollmentRequestDto} from "../../types_custom.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import Select2 from "../../components/select2";
import {object} from "yup";

const createSchema = object({

});

export const AddEnroll = () => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<EnrollmentRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: EnrollmentRequestDto) => {
        data.startDate = new Date(data.startDate).toISOString();
        data.endDate = new Date(data.endDate).toISOString();
        await post<EnrollmentRequestDto>(`${apiUrl}/enrollments`, data);
        await queryClient.invalidateQueries({queryKey: ['qryEnrollments']});
        toast.success("Matrícula adicionada com sucesso")
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
                                    <Controller
                                        name="studentId"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Select2
                                                    {...field}
                                                    setValue={(s:string)=>{field.onChange(s)}}
                                                    valueProp={"id"}
                                                    textProp={"name"}
                                                    allowsCustomValue={false}
                                                    url={"users"}
                                                    useKey={true}
                                                    selectionMode="single"
                                                    className="max-w"
                                                    label="Aluno"
                                                    placeholder="Selecione um Aluno">
                                                </Select2>
                                            );
                                        }}
                                    />
                                    {errors.studentId && <p>{errors.studentId.message}</p>}
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
                                    <Input {...register("startDate")} label="Início" pattern="YYYY-MM-DDTHH:mm:ss.sssZ" variant="bordered" type={"date"}/>
                                    {errors.startDate && <p>{errors.startDate.message}</p>}
                                    <Input {...register("endDate")} label="Fim" variant="bordered" type={"date"}/>
                                    {errors.endDate && <p>{errors.endDate.message}</p>}
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
