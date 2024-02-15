import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Input, Spinner, Textarea } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "../../_helpers/api";
import ImageUpload from "../image-upload";
import { PageLoader } from "../page-loader";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import Select2 from "../select2";
import { useState } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  AlternativeRequestDto,
  AnswerResponseDto,
  Discipline,
  Institution,
  ObservationRequest,
  ObservationResponseDto,
  QuestionBank,
  QuizAttempt
} from "../../types_custom";

interface Question {
  id: string,
  image: string | File | null,
  active: boolean,
  alternatives: AlternativeRequestDto[],
  answers: AnswerResponseDto[],
  board: string,
  createdAt: string,
  deleted: boolean,
  disciplines: Discipline[],
  institution: Institution | null,
  institutionId: string | null,
  observationRequests: ObservationRequest[],
  observations: ObservationResponseDto[],
  questionBank: QuestionBank | null,
  questionBankId: string | null,
  questionNumber: number,
  quizAttempts: QuizAttempt[],
  removedAt: string | null,
  score: number,
  text: string,
  updatedAt: string | null,
  year: number,
}

const updateSchema = yup.object().shape({
  board: yup.string(),
  institutionId: yup.string(),
  score: yup.number().typeError("Digite um número válido.").required("Pontos obrigatório."),
  text: yup.string().required("Descrição obrigatória."),
  year: yup.number().typeError("Digite um número válido.").required("Ano obrigatório."),
});

type SchemaQuestion = yup.InferType<typeof updateSchema>

export function EditQuestion() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()

  const [file, setFile] = useState<File>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [board, setBoard] = useState<string | undefined>();
  const [alternatives, setAlternatives] = useState<AlternativeRequestDto[]>([])

  const [activeCustomError, setActiveCustomError] = useState(false)
  const hasCorrectAlternative = alternatives.find((alternative) => alternative.correct === true)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SchemaQuestion>({
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

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/questions/${id}`
    const res = await get<Question>(url)
    setAlternatives(res.alternatives)
    setIsActive(res.active)
    setBoard(res?.board)

    return res
  }

  const { isLoading, isError, data: question } = useQuery({
    queryKey: ['question'],
    queryFn: fetchData,
  })

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

  const changeAlternative = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.currentTarget.getAttribute("data-id");
    const index = alternatives.findIndex(x => x.id === id);
    if (index !== -1) {
      const tempArray = alternatives.slice();
      tempArray[index]["text"] = event.currentTarget.value;
      setAlternatives(tempArray);
    } else {
      console.log('no match');
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

  const onSubmit = async (data: SchemaQuestion) => {
    setActiveCustomError(false)

    if (!hasCorrectAlternative || alternatives.length <= 1) {
      setActiveCustomError(true)
      return
    }

    const updatedQuestion: Question = {
      ...question,
      active: isActive,
      board: board ? board : question.board,
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
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={handleBackToQuestions}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-3xl mx-auto mb-16"
      >
        <ImageUpload setFile={setFile} />
        <Controller
          name="board"
          control={control}
          render={({ field }) => {
            return (
              <Select2
                {...field}
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

        <Checkbox
          checked={isActive}
          isSelected={isActive}
          onValueChange={() => {
            setIsActive(value => !value)
          }}
        >
          Ativo
        </Checkbox>

        <Input {...register("score")} label="Pontos" variant="bordered" defaultValue={String(question.score)} />
        {errors.score && <cite className={"text-danger"}>{errors.score.message}</cite>}

        <Textarea
          height={20} minRows={10} {...register("text")}
          label="Enunciado"
          variant="bordered"
          defaultValue={question.text}
        />
        {errors.text && <cite className={"text-danger"}>{errors.text.message}</cite>}

        <Controller
          name="institutionId"
          control={control}
          render={({ field }) => {
            return (
              <Select2
                {...field}
                useKey={true}
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
        {activeCustomError && <cite className={"text-danger"}>Adicione uma alternativa correta e ao menos uma incorreta.</cite>}

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
