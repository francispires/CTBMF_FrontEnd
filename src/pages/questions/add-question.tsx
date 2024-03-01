import {
    Button,
    Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { post } from "../../_helpers/api.ts";
import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup/src/index.ts";
import { boolean, number, object, setLocale } from "yup";
import { ptForm } from 'yup-locale-pt';
import { AlternativeRequestDto,  QuestionRequestDto } from "../../types_custom.ts";

import ImageUpload from "../../components/image-upload";
import { PlusIcon } from "../../components/icons/PlusIcon.tsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faCircleXmark, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import Select2 from "../../components/select2";
import { abc } from "../../_helpers/utils.ts";
import {v4 as uuidv4} from "uuid";

setLocale(ptForm);

const createSchema = object().shape({
    year: number().required('Ano é obrigatório')
        .min(1900, 'Deve ser maior que 1900')
        .max(2050, 'Deve ser menor que 2050'),
    active: boolean().required('Status é obrigatório'),
    score: number().required('Pontuação é obrigatória')
});
export const AddQuestion = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File>();
    const [board, setBoard] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [isNewDiscipline, setIsNewDiscipline] = useState(false);
    const [text, setText] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState("");
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
    const hasCorrectAlternative = alternatives.find((alternative) => alternative.correct === true)
    const [invalidAlternatives, setInvalidAlternatives] = useState(false)
    const [invalidDiscipline, setInvalidDiscipline] = useState(false)
    const [question, setQuestion] = useState<QuestionRequestDto>(new QuestionRequestDto({
        id: "", year: 0, score: 0, board: "", active: true, alternatives: [], institutionId: "", isValid: true
    }));
    setTimeout(() => {
        setQuestion({
            init() {
            },
            toJSON() {
            },
            id: "",
            institutionId: institutionId,
            text: "",
            score: 0,
            board: board,
            alternatives: [],
            active: false,
            year: 2023,
            isValid: false
        });
    }, 3000)

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

    const handleAlternativeChange = (id: string, value: string) => {
        const index = alternatives.findIndex(x => x.id === id);
        if (index !== -1) {
            const tempArray = alternatives.slice();
            tempArray[index]["text"] = value;
            setAlternatives(tempArray);
        }
    }

    const getAlternativeText = (id: string) => {
        const index = alternatives.findIndex(x => x.id === id);
        if (index !== -1) {
            return alternatives[index]["text"];
        }
    }
    const removeAlternative = (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.getAttribute("data-id");
        if (!id) return;
        const index = alternatives.findIndex(x => x.id === id);
        if (index !== -1) {
            const tempArray = alternatives.slice();
            tempArray.splice(index, 1);
            setAlternatives(tempArray);
        }
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

    //useEffect(() => {reset(question);}, []);

    const onSubmit = async (data: QuestionRequestDto) => {
        if (!hasCorrectAlternative || alternatives.length <= 1) {
            setInvalidAlternatives(true)
            return
        }
        if (!discipline || discipline===""){
            setInvalidDiscipline(true)
            return
        }
        data.alternatives = alternatives.map((a) => {
            a.id = typeof (parseInt(String(a.id))) === "number" ? "" : a.id;
            return a;
        });
        setAlternatives([]);
        data.file = file;
        data.image = image;
        data.board = board;
        data.institutionId = institutionId;
        data.text = text;
        data.discipline =
            isNewDiscipline?
                    { id:uuidv4(), name: discipline, description: discipline }:
                    { id:discipline,name: discipline, description: discipline }
        data.image = image;
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        await post<QuestionRequestDto>(`${apiUrl}/questions/create`, data as QuestionRequestDto, file);
        setFile(undefined);
        await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
        setText("");
        setDiscipline("");
        setBoard("");
        setInstitutionId("");
        setQuestion(new QuestionRequestDto({
            id: "", year: 0, score: 0, board: "", active: true, alternatives: [], institutionId: "", isValid: true
        }));
        toast.success("Questão adicionada com sucesso")
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
                                        <div className={"grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3"}>
                                            <div className={"col-span-2"}>
                                                <ImageUpload folderName={"questions"} setFile={setFile} setImageUrl={setImage} />
                                            </div>
                                            <div>
                                                <Controller
                                                    name="discipline"
                                                    control={control}
                                                    render={() => {
                                                        return (
                                                            <Select2
                                                                setValue={setDiscipline}
                                                                setIsNew={setIsNewDiscipline}
                                                                useKey={true}
                                                                value={question.discipline}
                                                                defaultInputValue={question.discipline}
                                                                valueProp={"id"}
                                                                textProp={"name"}
                                                                allowsCustomValue={true}
                                                                url={"disciplines"}
                                                                selectionMode="single"
                                                                className="max-w"
                                                                label="Disciplina"
                                                                placeholder="Selecione uma Disciplina">
                                                            </Select2>
                                                        );
                                                    }}
                                                />
                                                {invalidDiscipline &&
                                                    <cite className={"text-danger"}>Escolha ou adicione uma disciplina.</cite>}
                                                {errors.discipline &&
                                                    <cite className={"text-danger"}>{errors.discipline.message}</cite>}
                                            </div>
                                            <div>
                                                <Controller
                                                    name="board"
                                                    control={control}
                                                    render={() => {
                                                        return (
                                                            <Select2
                                                                setValue={setBoard}
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
                                                {errors.board &&
                                                    <cite className={"text-danger"}>{errors.board.message}</cite>}
                                            </div>
                                            <div>
                                                <Input {...register("year")} type={"number"} max={2050} min={1900}
                                                    label="Ano"
                                                    variant="bordered"
                                                />
                                                {errors.year &&
                                                    <cite className={"text-danger"}>{errors.year.message}</cite>}
                                            </div>
                                            <div>
                                                <Checkbox checked={question.active} isSelected={isActive}
                                                    onValueChange={handleSetActive}>
                                                    Ativo
                                                </Checkbox>
                                                <input {...register("active")} type={"hidden"}
                                                    value={isActive.toString()} />
                                                {errors.active &&
                                                    <cite className={"text-danger"}>{errors.active.message}</cite>}
                                            </div>
                                            <div>
                                                <Input {...register("score")} type={"number"} min={0} max={2000}
                                                    step={500}
                                                    label="Pontos"
                                                    variant="bordered"
                                                />
                                                {errors.year &&
                                                    <cite className={"text-danger"}>{errors.year.message}</cite>}
                                            </div>
                                            <div>
                                                <Controller
                                                    name="institutionId"
                                                    control={control}
                                                    render={() => {
                                                        return (
                                                            <Select2
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
                                                {errors.institutionId && <cite
                                                    className={"text-danger"}>{errors.institutionId?.message}</cite>}
                                            </div>
                                            <div className={"col-span-2"}>
                                                <ReactQuill
                                                    theme='snow'
                                                    placeholder={"Enunciado"}
                                                    value={text}
                                                    onChange={setText}
                                                    style={{ minHeight: '100px' }}
                                                />
                                                {errors.text &&
                                                    <cite className={"text-danger"}>{errors.text.message}</cite>}
                                            </div>
                                            <div className={"col-span-2"}>
                                                <div className="flex items-center gap-2 text-start mt-4 mb-3">
                                                    <Button
                                                        color={"success"}
                                                        variant={"ghost"}
                                                        className="
                                                            text-success-400 hover:text-default-400 border-success-400
                                                            hover:border-success-400
                                                        "
                                                        type="button"
                                                        onClick={addAlternative}
                                                    >
                                                        <PlusIcon className="text-2xl pointer-events-none" /><span className="block">Adicionar alternativas</span>
                                                    </Button>
                                                </div>
                                                {
                                                    alternatives.map((a, i) => (
                                                    <div
                                                        key={"alternative_" + a.id || i}
                                                        className="
                                                            grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 mb-3
                                                        "
                                                    >
                                                        <div className={"col-span-1 flex items-center"}>
                                                            <span className={"text-2xl"}>{abc[i]}</span>
                                                        </div>
                                                        <div className={"col-span-10"}>
                                                            <ReactQuill
                                                                theme='snow'
                                                                placeholder={"Alternativa"}
                                                                value={getAlternativeText(a.id || i.toString())}
                                                                onChange={(v: string) => {
                                                                    handleAlternativeChange(a.id || i.toString(), v)
                                                                }}
                                                                style={{ minHeight: '80px' }}
                                                                key={a.id || i}
                                                                data-id={a.id || i}
                                                            ></ReactQuill>
                                                        </div>
                                                        <div
                                                            className={"col-span-1 flex flex-col w-1/2 border rounded-r-lg border-gray-400"}>
                                                            <button
                                                                onClick={removeAlternative}
                                                                data-id={a.id || i}
                                                                className="rounded-l-none h-1/3 rounded-r-lg rounded-br-none p-2 bg-gray-500/20 border-none"
                                                                type="button">
                                                                <FontAwesomeIcon className={"text-gray-500"}
                                                                                 icon={faTrashCan}/>
                                                            </button>
                                                            {
                                                                a.correct ?
                                                                    <button
                                                                        onClick={toggleCorrect}
                                                                        data-id={a.id || i}
                                                                        className="rounded-l-none h-full rounded-r-lg rounded-tr-none p-2 bg-success/20 border-none"
                                                                        type="button"
                                                                    >
                                                                        <FontAwesomeIcon className={"text-success"}
                                                                                         icon={faCheck}/>
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        onClick={toggleCorrect}
                                                                        data-id={a.id || i}
                                                                        className="                          rounded-l-none h-full rounded-r-lg p-2  rounded-tr-none                          bg-danger/20 border-none                        "
                                                                        type="button"
                                                                    >
                                                                        <FontAwesomeIcon className={"text-danger"}
                                                                                         icon={faCircleXmark}/>
                                                                    </button>

                                                            }
                                                        </div>
                                                    </div>
                                                    ))}
                                                {invalidAlternatives &&
                                                    <cite className={"text-danger"}>Adicione uma alternativa correta e
                                                        ao menos uma incorreta.</cite>}
                                                {errors.alternatives && <cite
                                                    className={"text-danger"}>{errors.alternatives.message}</cite>}
                                            </div>
                                        </div>
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
