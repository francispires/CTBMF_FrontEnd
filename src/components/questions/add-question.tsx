import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Textarea,
    useDisclosure,
} from "@nextui-org/react";
import {useQueryClient} from "@tanstack/react-query";
import {post} from "../../_helpers/api.ts";
import {Controller, useForm} from "react-hook-form";
import Select2 from "../select";
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {object} from "yup";
import {QuestionRequestDto} from "../../types_custom.ts";
import {useState} from "react";

const createSchema = object({});

export const AddQuestion = () => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File>();

    const {
        register,
        handleSubmit,
        control,
        formState: {errors}
    } = useForm<QuestionRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: QuestionRequestDto) => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        data.file = file;
        // const resp = await axios.post(`${apiUrl}/questions`, data, {
        //   headers: {
        //     "content-type": "multipart/form-data"
        //   },
        // });
        // debugger
        await post<QuestionRequestDto>(`${apiUrl}/questions`, data as QuestionRequestDto, file);
        setFile(undefined);
        await queryClient.invalidateQueries({queryKey: ['qryKey']});
        onClose();
    };

    return (
        <div>
            <>
                <Button onPress={onOpen} color="primary">
                    Nova
                </Button>
                <Modal
                    size={"5xl"}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Nova Questão
                                    </ModalHeader>
                                    <ModalBody>
                                        <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])}/>

                                        <Input {...register("board")} label="Banca" variant="bordered"/>
                                        {errors.board &&
                                            <cite className={"accent-danger"}>{errors.board.message}</cite>}

                                        <Controller
                                            name="board"
                                            control={control}
                                            render={({field}) => {
                                                return (
                                                    <Select2
                                                        valueProp={"value"}
                                                        textProp={"text"}
                                                        {...field}
                                                        allowsCustomValue={true}
                                                        url={"questions/boards"}
                                                        selectionMode="single"
                                                        className="max-w"
                                                        label="Banca"
                                                        placeholder="Selecione uma Banca">
                                                    </Select2>
                                                );
                                            }}
                                        />

                                        <Input {...register("year")} label="Ano" variant="bordered"/>
                                        {errors.year && <cite className={"accent-danger"}>{errors.year.message}</cite>}

                                        <Input {...register("active")} label="Ativo" variant="bordered"/>
                                        {errors.active &&
                                            <cite className={"accent-danger"}>{errors.active.message}</cite>}

                                        <Input {...register("score")} label="Pontos" variant="bordered"/>
                                        {errors.score &&
                                            <cite className={"accent-danger"}>{errors.score.message}</cite>}

                                        <Textarea height={20} minRows={10} {...register("text")} label="Enunciado" variant="bordered"/>
                                        {errors.image && <p>{errors.image.message}</p>}

                                        <Controller
                                            name="institutionId"
                                            control={control}
                                            render={({field}) => {
                                                return (
                                                    <Select2
                                                        valueProp={"id"}
                                                        textProp={"name"}
                                                        {...field}
                                                        url={"institutions"}
                                                        selectionMode="single"
                                                        className="max-w"
                                                        label="Instituição"
                                                        placeholder="Selecione uma Instituição">
                                                    </Select2>
                                                );
                                            }}
                                        />
                                        {errors.institutionId && <p>{errors.institutionId?.message}</p>}
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
