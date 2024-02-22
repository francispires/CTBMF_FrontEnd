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
import {useQueryClient} from "@tanstack/react-query";
import {post} from "../../_helpers/api.ts";
import {Controller, useForm} from "react-hook-form";

import {yupResolver} from "@hookform/resolvers/yup/src/index.ts";
import {boolean, number, object, setLocale} from "yup";
import {ptForm} from 'yup-locale-pt';
import {AlternativeRequestDto, DisciplineRequestDto, QuestionRequestDto} from "../../types_custom.ts";

import ImageUpload from "../image-upload/index.tsx";
import {PlusIcon} from "../icons/PlusIcon.tsx";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {toast} from "react-toastify";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import Select2 from "../select2";

setLocale(ptForm);

const createSchema = object().shape({
    //  board: string().required('Banca é obrigatória'),
    year: number().required('Ano é obrigatório')
        .min(1900, 'Deve ser maior que 1900')
        .max(2050, 'Deve ser menor que 2050'),
    active: boolean().required('Status é obrigatório'),
    score: number().required('Pontuação é obrigatória'),
    //text: string().required('Enunciado é obrigatório'),
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
export const AddQuestion = () => {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File>();
    const [board, setBoard] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [text, setText] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState("");
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
    const [question, setQuestion] = useState<QuestionRequestDto>(new QuestionRequestDto({
        id: "", year: 0, score: 0, board: "", active: true, alternatives: [], institutionId: "",isValid:true
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
        formState: {errors}
    } = useForm<QuestionRequestDto>({
        resolver: yupResolver(createSchema)
    });

    //useEffect(() => {reset(question);}, []);

    const onSubmit = async (data: QuestionRequestDto) => {
        data.alternatives = alternatives.map((a) => {
            a.id = typeof (parseInt(String(a.id))) === "number" ? "" : a.id;
            return a;
        });
        data.file = file;
        data.image = image;
        data.board = board;
        data.institutionId = institutionId;
        data.text = text;
        data.discipline = {name: discipline, description: discipline} as DisciplineRequestDto;
        data.image = image;
        debugger
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;
        await post<QuestionRequestDto>(`${apiUrl}/questions/create`, data as QuestionRequestDto, file);
        setFile(undefined);
        await queryClient.invalidateQueries({queryKey: ['qryKey']});
        setAlternatives([]);
        setText("");
        setDiscipline("");
        setBoard("");
        setInstitutionId("");
        setQuestion(new QuestionRequestDto({
            id: "", year: 0, score: 0, board: "", active: true, alternatives: [], institutionId: "",isValid:true
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
                                                <ImageUpload folderName={"questions"} setFile={setFile} setImageUrl={setImage}/>
                                            </div>
                                            <div>
                                                <Controller
                                                    name="discipline"
                                                    control={control}
                                                    render={() => {
                                                        return (
                                                            <Select2
                                                                setValue={setDiscipline}
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
                                                       value={isActive.toString()}/>
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
                                                    style={{minHeight: '100px'}}
                                                />
                                                {errors.text &&
                                                    <cite className={"text-danger"}>{errors.text.message}</cite>}
                                            </div>
                                            <div className={"col-span-2"}>
                                                <div className="flex items-center gap-2 text-start mt-4 mb-2">
                                                    <span className="block">Adicionar alternativas</span>
                                                    <button className="focus:outline-none" type="button"
                                                            onClick={addAlternative}>
                                                        <PlusIcon
                                                            className="text-2xl text-default-400 pointer-events-none"/>
                                                    </button>
                                                </div>
                                                {alternatives.map((a, i) => (
                                                    <div
                                                        key={"asdf" + a.id || i}
                                                        className={"grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12"}>
                                                        <div className={"col-span-10"}>
                                                            <ReactQuill
                                                                theme='snow'
                                                                placeholder={"Alternativa"}
                                                                value={getAlternativeText(a.id || i.toString())}
                                                                onChange={(v: string) => {
                                                                    handleAlternativeChange(a.id || i.toString(), v)
                                                                }}
                                                                style={{minHeight: '100px'}}
                                                                key={a.id || i}
                                                                data-id={a.id || i}
                                                            ></ReactQuill>
                                                        </div>
                                                        <div>
                                                            {
                                                                a.correct ?

                                                                    <button onClick={toggleCorrect} data-id={a.id || i}
                                                                            className="button" type="button">
                                                                        <FontAwesomeIcon className={"text-success"}
                                                                                         icon={faCheck}/>
                                                                    </button> :
                                                                    <button onClick={toggleCorrect} data-id={a.id || i}
                                                                            className="" type="button">
                                                                        <FontAwesomeIcon className={"text-danger"}
                                                                                         icon={faCircleXmark}/>
                                                                    </button>

                                                            }
                                                        </div>
                                                    </div>
                                                ))}
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
