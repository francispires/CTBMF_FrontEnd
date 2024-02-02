import {
    Button, Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { post } from "../../_helpers/api.ts";
import { Controller, useForm } from "react-hook-form";
import Select2 from "../select";
import { yupResolver } from "@hookform/resolvers/yup/src/index.ts";
import { object } from "yup";
import { AlternativeRequestDto, QuestionRequestDto } from "../../types_custom.ts";

import ImageUpload from "../image-upload/index.tsx";
import { PlusIcon } from "../icons/PlusIcon.tsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";


const createSchema = object({});

export const AddQuestion = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File>();
    const [isActive, setIsActive] = useState(true);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedTab, setSelectedTab] = useState("question");
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
    const [question, setQuestion] = useState<QuestionRequestDto>(new QuestionRequestDto({
        id: "", year: 0, score: 0, board: "", active: true, alternatives: []
    }))

    const addAlternative = () => {
        const al =
            new AlternativeRequestDto({
                questionId: "",
                correct: false,
                text: "",
                aiExplanation: "",
                id: alternatives.length.toString()
            });
        setAlternatives([...alternatives, al]);
    }

    const toggleCorrect = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.getAttribute("data-id");
        const index = alternatives.findIndex(x => x.id === id);
        if (index !== -1) {
            const tempArray = alternatives.slice();
            const isCorrect = tempArray[index]["correct"];
            if (!isCorrect) {
                tempArray.map((a) => {
                    a.correct = false;
                });
            }
            tempArray[index]["correct"] = !isCorrect;
            setAlternatives(tempArray);
        } else {
            console.log('no match');
        }
    }

    const handleSetActive = (checked: boolean) => {
        setIsActive(checked);
    }

    const handleOpenModalChange = () => {
        onOpenChange()
        setAlternatives([])
    }

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<QuestionRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: QuestionRequestDto) => {
        const alternativesToSave = alternatives.map((a) => {
            a.id = typeof (parseInt(a.id)) === "number" ? null : a.id;
            return a;
        });
        data.alternatives = alternativesToSave;
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        data.file = file;
        await post<QuestionRequestDto>(`${apiUrl}/questions/create`, data as QuestionRequestDto, file);
        setFile(undefined);
        await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
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
                    onOpenChange={handleOpenModalChange}
                    placement="top-center"
                    className="max-h-[calc(100vh-50px)] overflow-auto"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Questão
                                    </ModalHeader>
                                    <ModalBody>
                                        <ImageUpload setFile={setFile} />
                                        <Controller
                                            name="board"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Select2
                                                        defaultInputValue={question.board}
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

                                        <Input {...register("year")} type={"number"} max={2050} min={1900}
                                            label="Ano"
                                            variant="bordered"
                                        />
                                        {errors.year &&
                                            <cite className={"accent-danger"}>{errors.year.message}</cite>}

                                        <Checkbox checked={question.active} isSelected={isActive} onValueChange={handleSetActive}>
                                            Ativo
                                        </Checkbox>
                                        <input {...register("active")} type={"hidden"} value={isActive} />
                                        {errors.active &&
                                            <cite className={"accent-danger"}>{errors.active.message}</cite>}

                                        <Input {...register("score")} label="Pontos" variant="bordered" />
                                        {errors.score &&
                                            <cite className={"accent-danger"}>{errors.score.message}</cite>}

                                        <Textarea
                                            height={20} minRows={10} {...register("text")}
                                            label="Enunciado"
                                            variant="bordered" />
                                        {errors.image && <p>{errors.image.message}</p>}

                                        <Controller
                                            name="institutionId"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Select2
                                                        defaultInputValue={question.institutionId}
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

                                        <div className="flex items-center gap-2 text-start mt-4 mb-2">
                                            <span className="block">Adicionar alternativas</span>
                                            <button className="focus:outline-none" type="button" onClick={addAlternative}>
                                                <PlusIcon className="text-2xl text-default-400 pointer-events-none" />
                                            </button>
                                        </div>
                                        {alternatives.map((a, i) => (
                                            <Input
                                                type="text"
                                                key={a.id || i}
                                                color={a.correct ? "success" : "danger"}
                                                label={`Alternativa ${i + 1}`}
                                                placeholder="Texto da alternativa"
                                                defaultValue=""
                                                className="mb-3"
                                                endContent={
                                                    a.correct ?
                                                        <button onClick={toggleCorrect} data-id={a.id || i} className="" type="button">
                                                            <FontAwesomeIcon className={"text-success"}
                                                                icon={faCheck} />
                                                        </button> :
                                                        <button onClick={toggleCorrect} data-id={a.id || i} className="" type="button">
                                                            <FontAwesomeIcon className={"text-danger"}
                                                                icon={faCircleXmark} />
                                                        </button>
                                                }
                                            />
                                        ))}

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
