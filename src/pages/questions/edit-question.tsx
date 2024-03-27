import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Checkbox, Input, Select, SelectItem, SelectSection, Spinner} from "@nextui-org/react";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {get, patch} from "../../_helpers/api.ts";
import ImageUpload from "../../components/image-upload";
import {PageLoader} from "../../components/page-loader.tsx";
import {yupResolver} from "@hookform/resolvers/yup/src/yup.js";
import {Controller, useForm} from "react-hook-form";
import * as yup from 'yup'
import Select2 from "../../components/select2";
import {useEffect, useState} from "react";
import {PlusIcon} from "../../components/icons/PlusIcon.tsx";
import {
    faCheck,
    faCircleXmark,
    faDeleteLeft,
    faTrashArrowUp,
    faTrashCan,
    faTrashRestore
} from "@fortawesome/free-solid-svg-icons";
import {v4 as uuidv4} from 'uuid';
import {FaArrowLeft} from "react-icons/fa";
import {toast} from "react-toastify";

import {
    AlternativeRequestDto,
    AnswerResponseDto, DisciplineRequestDto, DisciplineResponseDto, ObservationRequestDto,
    ObservationResponseDto, QuestionBankRequestDto, QuizAttemptRequestDto,
} from "../../types_custom.ts";
import {abc, apiUrl, toggleCorrectAlternativeReq} from "../../_helpers/utils.ts";
import ReactQuill from "react-quill";

interface Question {
    id: string,
    image: string | File | null,
    active: boolean,
    alternatives: AlternativeRequestDto[],
    answers: AnswerResponseDto[],
    board: string,
    createdAt: string,
    deleted: boolean,
    institution: Institution | null,
    institutionId: string | null,
    observationRequests: ObservationRequestDto[],
    observations: ObservationResponseDto[],
    questionBank: QuestionBankRequestDto | null,
    questionBankId: string | null,
    questionNumber: number,
    quizAttempts: QuizAttemptRequestDto[],
    removedAt: string | null,
    score: number,
    text: string,
    updatedAt: string | null,
    year: number,
    discipline: DisciplineRequestDto,
    disciplineId: string,
}

const updateSchema = yup.object().shape({
    board: yup.string(),
    institutionId: yup.string(),
    score: yup.number(),
    text: yup.string(),
    year: yup.number(),
    discipline: yup.string(),
    disciplineId: yup.string(),
    image: yup.string()
});

type SchemaQuestion = yup.InferType<typeof updateSchema>

export function EditQuestion() {
    const {id} = useParams();
    const navigation = useNavigate()
    const queryClient = useQueryClient()

    const [file, setFile] = useState<File>();
    const [imageUrl, setImageUrl] = useState("");
    const [isActive, setIsActive] = useState<boolean>(false);
    const [board, setBoard] = useState<string | undefined>();
    const [institutionId, setInstitutionId] = useState<string | undefined>();
    const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
    const [discipline, setDiscipline] = useState("");
    const [isNewDiscipline, setIsNewDiscipline] = useState(false);

    const [invalidDiscipline, setInvalidDiscipline] = useState(false)
    const [invalidAlternatives, setInvalidAlternatives] = useState(false)
    const hasCorrectAlternative = alternatives.find((alternative) => alternative.correct === true)
    const {register, handleSubmit, control, formState: {errors}} = useForm<SchemaQuestion>({
        resolver: yupResolver(updateSchema)
    });

    const fetchDisciplines = async () => {
        const url = `${apiUrl}/disciplines?currentPage=1&pageSize=1000&sort=name`
        return await get<PagedResponse<DisciplineResponseDto>>(url);
    }

    const {isLoading: loadingDisciplines, data: disciplines} = useQuery({
        queryKey: ['disciplines'],
        queryFn: fetchDisciplines
    });
    const mutation = useMutation({
        mutationFn: async (updatedQuestion: Question) => {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
            const url = `${apiUrl}/questions/${id}`
            const res = await patch(url, updatedQuestion, file)

            if (!res) {
                throw new Error('Erro ao atualizar a questão.')
            }

            return res
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['qryKey']});
            await queryClient.invalidateQueries({queryKey: ['question']});
            toast.success("Questão editada com sucesso.")
        },
        onError: () => {
            toast.error("Erro ao editar a questão.")
        }
    })

    const [text, setText] = useState("");
    const [actualDisciplineId, setActualDisciplineId] = useState("");

    const fetchData = async () => {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
        const url = `${apiUrl}/questions/${id}`
        const res = await get<Question>(url)
        setAlternatives(res.alternatives)
        setIsActive(res.active)
        setBoard(res?.board)
        setText(res.text)
        return res
    }
    const {isLoading, isError, data: question} = useQuery({
        queryKey: ['question'],
        queryFn: fetchData,
    })
    useEffect(() => {
        if (question) {
            setText(question.text)
            setActualDisciplineId(question.disciplineId)
        }
    }, [question]);

    if (isLoading) {
        return (
            <PageLoader/>
        )
    }

    if (isError || !question) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-red-400">Ocorreu um erro ao buscar dados da questão.</span>
            </div>
        )
    }

    const addAlternative = () => {
        const al =
            new AlternativeRequestDto({
                questionId: id,
                correct: false,
                text: "",
                aiExplanation: "",
                id: uuidv4()
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
        if (!id) return;
        setAlternatives(toggleCorrectAlternativeReq(alternatives, id));
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

    const onSubmit = async (data: SchemaQuestion) => {
        setInvalidAlternatives(false)
        if (!hasCorrectAlternative || alternatives.length <= 1) {
            setInvalidAlternatives(true)
            return
        }
        const did = discipline || question.discipline.name

        setDiscipline(did);
        if (!did) {
            setInvalidDiscipline(true)
            return;
        }

        data.image = imageUrl;
        data.text = text;
        data.institutionId = institutionId;
        if (!discipline && !question.discipline.name) {
            toast.error("Escolha ou crie uma disciplina.")
            return
        }


        data.discipline =
            isNewDiscipline ?
                {id: uuidv4(), name: discipline, description: discipline} :
                {name: did, description: did}
        const updatedQuestion: Question = {
            ...question,
            active: isActive,
            board: board ? board : question.board,
            discipline: data.discipline ? data.discipline as DisciplineRequestDto : question.discipline,
            year: data.year ? data.year : question.year,
            score: data.score ? data.score : question.score,
            text: data.text ? data.text : question.text,
            institutionId: data.institutionId ? data.institutionId : question.institutionId,
            alternatives: alternatives,
        }
        setAlternatives([]);
        try {
            await mutation.mutateAsync(updatedQuestion)
            handleBackToQuestions()
        } catch (error) {
            console.error("Erro ao editar a questão:", error)
        }
    };

    const handleBackToQuestions = () => {
        navigation('/questions')
    }

    const setDisciplineWrapper = (id: string) => {

        const d = disciplines.queryable.find(d => d.id === id)
        if (d) {
            setDiscipline(d.name)
            setActualDisciplineId(d.id)
        }
    }

    return (
        <div>
            <Button variant="ghost" className="mb-6" onClick={handleBackToQuestions}><FaArrowLeft/> Voltar</Button>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full max-w-3xl mx-auto mb-16"
            >
                <div className={"grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3"}>

                    <div className={"col-span-2"}>
                        <ImageUpload setFile={setFile} setImageUrl={setImageUrl} folderName={"questions"}/>
                    </div>
                    <div>
                        <Controller
                            name="discipline"
                            control={control}
                            render={() => {
                                return (
                                    <>
                                        <Select
                                            label="Conteúdo (Temas específicos)"
                                            placeholder="Conteúdo"
                                            selectedKeys={disciplines && disciplines.queryable.length?[actualDisciplineId]:[]}
                                            selectionMode={"single"}
                                            variant="bordered"
                                            isLoading={loadingDisciplines}
                                            onSelectionChange={(s) => {
                                                setDisciplineWrapper(s.anchorKey)
                                            }}
                                        >
                                            {disciplines && disciplines.queryable.filter(d => d.childsCount > 0).map((discipline) => (
                                                <SelectSection key={discipline.id} showDivider title={discipline.name}>
                                                    {
                                                        discipline.childs.map((subDiscipline) => (
                                                            <SelectItem key={subDiscipline.id}
                                                                        textValue={subDiscipline.name}>
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="flex flex-col">
                                                                        <span
                                                                            className="text-small">{subDiscipline.name}</span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                </SelectSection>
                                            ))}
                                        </Select>
                                    </>
                                );
                            }}
                        />
                        {invalidDiscipline &&
                            <cite className={"text-danger"}>Escolha ou adicione uma disciplina.</cite>}
                        {!discipline || !discipline.length &&
                            <cite className={"text-danger"}>Disciplina obrigatória.</cite>}
                    </div>
                    <div>
                        <Controller
                            name="board"
                            control={control}
                            render={() => {
                                return (
                                    <Select2
                                        name="board"
                                        value={question.board}
                                        setValue={setBoard}
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
                        {!board || !board.length && <cite className={"text-danger"}>Banca obrigatória.</cite>}
                    </div>
                    <div>
                        <Input
                            {...register("year")}
                            type={"number"}
                            max={2050}
                            min={1900}
                            defaultValue={String(question.year)}
                            label="Ano"
                            variant="bordered"
                        />
                        {errors.year && <cite className={"text-danger"}>{errors.year.message}</cite>}
                    </div>
                    <div>
                        <Checkbox
                            checked={isActive}
                            isSelected={isActive}
                            onValueChange={() => {
                                setIsActive(value => !value)
                            }}
                        >
                            Ativo
                        </Checkbox>
                    </div>
                    <div>
                        <Input {...register("score")} label="Pontos" variant="bordered"
                               defaultValue={String(question.score)}/>
                        {errors.score && <cite className={"text-danger"}>{errors.score.message}</cite>}
                    </div>
                    <div>
                        <Controller
                            name="institutionId"
                            control={control}
                            render={() => {
                                return (
                                    <Select2
                                        useKey={true}
                                        value={institutionId}
                                        setValue={setInstitutionId}
                                        defaultInputValue={question.institution?.name}
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
                    </div>
                    <div className={"col-span-2"}>
                        <Controller
                            name="text"
                            control={control}
                            rules={{
                                required: "Defina um Enunciado",
                            }}
                            render={({field}) => (
                                <ReactQuill
                                    theme="snow"
                                    {...field}
                                    value={text}
                                    placeholder={"Enunciado"}
                                    onChange={(text) => {
                                        field.onChange(text);
                                        setText(text)
                                    }}
                                    style={{minHeight: '100px'}}
                                />
                            )}
                        />
                        {errors.text && <cite className={"text-danger"}>{errors.text.message}</cite>}
                    </div>

                    <div className={"col-span-2"}>
                        <div className="flex items-center gap-2 text-start mt-4 mb-3">
                            <Button
                                color={"success"}
                                variant={"ghost"}
                                className="
                  text-success-400 hover:text-default-400 border-success-400
                  hover:border-success-400"
                                type="button"
                                onClick={addAlternative}
                            >
                                <PlusIcon className="text-2xl pointer-events-none"/><span className="block">Adicionar alternativas</span>
                            </Button>
                        </div>

                        {alternatives.map((a, i) => (
                            <div
                                key={"alter" + a.id || i}
                                className="
                  grid md:grid-cols-12 grid-cols-12 2xl:grid-cols-12 mb-3
                "
                            >
                                <div className={"col-span-1 flex items-center"}>
                                    <span className={"text-2xl"}>{abc[i]}</span>
                                </div>
                                <div className={"col-span-10 h-full"}>
                                    <ReactQuill
                                        theme='snow'
                                        placeholder={"Alternativa"}
                                        value={getAlternativeText(a.id || i.toString())}
                                        onChange={(v: string) => {
                                            handleAlternativeChange(a.id || i.toString(), v)
                                        }}
                                        style={{minHeight: '80px'}}
                                        className="text-ellipsis"
                                        key={a.id || i}
                                        data-id={a.id || i}
                                    ></ReactQuill>
                                </div>
                                <div className={"col-span-1 flex flex-col w-1/2 border rounded-r-lg border-gray-400"}>
                                    <button
                                        onClick={removeAlternative}
                                        data-id={a.id || i}
                                        className="rounded-l-none h-1/3 rounded-r-lg rounded-br-none p-2 bg-gray-500/20 border-none"
                                        type="button">
                                        <FontAwesomeIcon className={"text-gray-500"} icon={faTrashCan}/>
                                    </button>
                                    {
                                        a.correct ?
                                            <button
                                                onClick={toggleCorrect}
                                                data-id={a.id || i}
                                                className="rounded-l-none h-full rounded-r-lg rounded-tr-none p-2 bg-success/20 border-none"
                                                type="button">
                                                <FontAwesomeIcon className={"text-success"} icon={faCheck}/>
                                            </button>
                                            :
                                            <button
                                                onClick={toggleCorrect}
                                                data-id={a.id || i}
                                                className="                          rounded-l-none h-full rounded-r-lg p-2  rounded-tr-none                          bg-danger/20 border-none                        "
                                                type="button"
                                            >
                                                <FontAwesomeIcon className={"text-danger"} icon={faCircleXmark}/>
                                            </button>
                                    }
                                </div>
                            </div>
                        ))}
                        {invalidAlternatives &&
                            <cite className={"text-danger"}>Adicione uma alternativa correta e ao menos uma
                                incorreta.</cite>}
                    </div>
                </div>
                <Button
                    type={"submit"}
                    color="primary"
                    className="mx-auto max-w-[150px] w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <Spinner size="sm" color="white"/>
                    ) : (
                        <span>Salvar</span>
                    )}
                </Button>
            </form>
        </div>
    )
}
