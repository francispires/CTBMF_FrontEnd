import {
    Button,
    Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import {useQueryClient} from "@tanstack/react-query";
import {post} from "../../_helpers/api.ts";
import {Controller, useForm} from "react-hook-form";
import Select2 from "../select2";
import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {array, boolean, number, object, string} from "yup";
import { ptForm  } from 'yup-locale-pt';
import { setLocale } from 'yup';
setLocale(ptForm);

import {AlternativeRequestDto, QuestionBankRequestDto, QuestionRequestDto} from "../../types_custom.ts";

import ImageUpload from "../image-upload/index.tsx";
import {PlusIcon} from "../icons/PlusIcon.tsx";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const createSchema = object().shape({
  //  board: string().required('Banca é obrigatória'),
    year: number().required('Ano é obrigatório')
        .min(1900, 'Deve ser maior que 1900')
        .max(2050, 'Deve ser menor que 2050'),
    active: boolean().required('Status é obrigatório'),
    score: number().required('Pontuação é obrigatória'),
    text: string().required('Enunciado é obrigatório'),
//    institutionId: string().required('Insituição é obrigatória'),
//     alternatives: array().of(
//         object().shape({
//             questionId: string().required('Questão é obrigatória'),
//             correct: boolean()
//                 .required('Se é correta ou não é obrigatório'),
//             text: string().required('Texto é obrigatório'),
//             id: string().required('ID é obrigatório'),
//         })
//     ).required('Pelo menos uma alternativa correta é obrigatória'),
});
export const AddQuestionBank = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File>();
    const [board, setBoard] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
    const [question, setQuestion] = useState<QuestionRequestDto>(new QuestionRequestDto({
        id: "", year: 0, score: 0, board: "", active: true, alternatives: []
    }));

    setTimeout(()=>{
        setQuestion({
            init() {
            },
            toJSON() {
            },
            institutionId:"0",
            text:"etrasdfasd",
            score:123,
            board:"",
            id:"",
            alternatives:[],
            active:false,
            year:2000
        });
    },3000)

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
    } = useForm<QuestionBankRequestDto>({
        resolver: yupResolver(createSchema)
    });

    const onSubmit = async (data: QuestionBankRequestDto) => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        await post<QuestionBankRequestDto>(`${apiUrl}/question_banks/create`, data as QuestionBankRequestDto, file);
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
                                        Banco de Questões
                                    </ModalHeader>
                                    <ModalBody>
                                        <ImageUpload setFile={setFile} />
                                        <Controller
                                            name="board"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Select2
                                                        setValue={setBoard}
                                                        {...field}
                                                        value={question.board}
                                                        defaultInputValue={question.board}
                                                        valueProp={"value"}
                                                        textProp={"text"}
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
                                        {errors.board && <cite className={"text-danger"}>{errors.board.message}</cite>}
                                        <Input {...register("year")} type={"number"} max={2050} min={1900}
                                            label="Ano"
                                            variant="bordered"
                                        />
                                        {errors.year && <cite className={"text-danger"}>{errors.year.message}</cite>}

                                        <Checkbox checked={question.active} isSelected={isActive} onValueChange={handleSetActive}>
                                            Ativo
                                        </Checkbox>
                                        <input {...register("active")} type={"hidden"} value={isActive.toString()} />
                                        {errors.active && <cite className={"text-danger"}>{errors.active.message}</cite>}

                                        <Input {...register("score")} label="Pontos" variant="bordered" />
                                        {errors.score && <cite className={"text-danger"}>{errors.score.message}</cite>}

                                        <Textarea
                                            height={20} minRows={10} {...register("text")}
                                            label="Enunciado"
                                            variant="bordered" />
                                        {errors.text && <cite className={"text-danger"}>{errors.text.message}</cite>}

                                        <Controller
                                            name="institutionId"
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Select2
                                                        {...field}
                                                        useKey={true}
                                                        setValue={setInstitutionId}
                                                        defaultInputValue={question.institutionId}
                                                        valueProp={"id"}
                                                        textProp={"name"}
                                                        url={"institutions"}
                                                        selectionMode="single"
                                                        className="max-w"
                                                        label="Instituição"
                                                        placeholder="Selecione uma Instituição"
                                                    >
                                                    </Select2>
                                                );
                                            }}
                                        />
                                        {errors.institutionId && <cite className={"text-danger"}>{errors.institutionId?.message}</cite>}
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
                                                data-id={a.id || i}
                                                color={a.correct ? "success" : "danger"}
                                                label={`Alternativa ${i + 1}`}
                                                placeholder="Texto da alternativa"
                                                defaultValue=""
                                                className="mb-3"
                                                onChange={changeAlternative}
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
                                        {errors.alternatives && <cite className={"text-danger"}>{errors.alternatives.message}</cite>}
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
