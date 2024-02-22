import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Input, Spinner } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "../../_helpers/api";
import ImageUpload from "../image-upload";
import { PageLoader } from "../page-loader";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import Select2 from "../select2";
import { useEffect, useState } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  AlternativeRequestDto,
  AnswerResponseDto, DisciplineRequestDto, ObservationRequestDto,
  ObservationResponseDto, QuestionBankRequestDto, QuizAttemptRequestDto,
} from "../../types_custom";
import { abc, toggleCorrectAlternativeReq } from "../../_helpers/utils.ts";
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
  discipline: yup.object(),
  disciplineId: yup.string(),
  image: yup.string()
});

type SchemaQuestion = yup.InferType<typeof updateSchema>

export function EditQuestion() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()

  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [board, setBoard] = useState<string | undefined>();
  const [institutionId, setInstitutionId] = useState<string | undefined>();
  const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])
  const [discipline, setDiscipline] = useState("");

  const [activeCustomError, setActiveCustomError] = useState(false)
  const hasCorrectAlternative = alternatives.find((alternative) => alternative.correct === true)
  const { register, handleSubmit, control, formState: { errors } } = useForm<SchemaQuestion>({
    resolver: yupResolver(updateSchema)
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
      await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
      await queryClient.invalidateQueries({ queryKey: ['question'] });
      toast.success("Questão editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a questão.")
    }
  })

  const [text, setText] = useState("");

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
  const { isLoading, isError, data: question } = useQuery({
    queryKey: ['question'],
    queryFn: fetchData,
  })
  useEffect(() => {
    if (question) {
      setText(question.text)
    }
  }, [question]);

  if (isLoading) {
    return (
      <PageLoader />
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

  const onSubmit = async (data: SchemaQuestion) => {
    setActiveCustomError(false)

    if (!hasCorrectAlternative || alternatives.length <= 1) {
      setActiveCustomError(true)
      return
    }

    data.image = imageUrl;
    data.text = text;
    data.institutionId = institutionId;
    data.discipline = { description: discipline, name: discipline };

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

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToQuestions}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-3xl mx-auto mb-16"
      >
        <div className={"grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3"}>

          <div className={"col-span-2"}>
            <ImageUpload setFile={setFile} setImageUrl={setImageUrl} folderName={"questions"} />
          </div>
          <div>
            <Controller
              name="discipline"
              control={control}
              render={() => {
                return (
                  <Select2
                    name="discipline"
                    value={discipline}
                    setValue={setDiscipline}
                    defaultInputValue={question.discipline.name}
                    valueProp={"id"}
                    textProp={"name"}
                    allowsCustomValue={true}
                    url={"disciplines"}
                    selectionMode="single"
                    className="max-w"
                    label="Disciplina"
                    placeholder="Selecione uma Banca">
                  </Select2>
                );
              }}
            />
            {!discipline || !discipline.length && <cite className={"text-danger"}>Disciplina obrigatória.</cite>}
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
            <Input {...register("score")} label="Pontos" variant="bordered" defaultValue={String(question.score)} />
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
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  {...field}
                  value={text}
                  placeholder={"Enunciado"}
                  onChange={(text) => {
                    field.onChange(text);
                    setText(text)
                  }}
                  style={{ minHeight: '100px' }}
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
                <PlusIcon className="text-2xl pointer-events-none" /><span className="block">Adicionar alternativas</span>
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
                    style={{ minHeight: '80px' }}
                    className="text-ellipsis"
                    key={a.id || i}
                    data-id={a.id || i}
                  ></ReactQuill>
                </div>
                <div className={"col-span-1 flex items-center"}>
                  {
                    a.correct ?
                      // <Switch
                      //     endContent={
                      //       <FontAwesomeIcon
                      //           icon={faCheck}/>
                      //     } color="success"></Switch> :
                      // <Switch
                      //     endContent={
                      //       <FontAwesomeIcon
                      //           icon={faCircleXmark}/>
                      //     } color="danger"></Switch>
                      <button
                        onClick={toggleCorrect}
                        data-id={a.id || i}
                        className="
                          rounded-l-none h-full rounded-r-lg p-2 
                          bg-success/20 border-none
                        "
                        type="button"
                      >
                        <FontAwesomeIcon className={"text-success"} icon={faCheck} />
                      </button>
                      :
                      <button
                        onClick={toggleCorrect}
                        data-id={a.id || i}
                        className="
                          rounded-l-none h-full rounded-r-lg p-2 
                          bg-danger/20 border-none
                        "
                        type="button"
                      >
                        <FontAwesomeIcon className={"text-danger"} icon={faCircleXmark} />
                      </button>
                  }
                </div>
              </div>
            ))}
            {activeCustomError &&
              <cite className={"text-danger"}>Adicione uma alternativa correta e ao menos uma incorreta.</cite>}
          </div>
        </div>
        <Button
          type={"submit"}
          color="primary"
          className="mx-auto max-w-[150px] w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Spinner size="sm" color="white" />
          ) : (
            <span>Salvar</span>
          )}
        </Button>
      </form>
    </div>
  )
}
