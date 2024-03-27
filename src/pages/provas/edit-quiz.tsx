import {Button, Input, Selection, Spinner} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import {FaArrowLeft} from "react-icons/fa";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {yupResolver} from "@hookform/resolvers/yup/src/yup.js";
import * as yup from 'yup';
import {get, getById, patch} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import {PageLoader} from "../../components/page-loader.tsx";
import {apiUrl} from "../../_helpers/utils.ts";
import {QuizAttemptConfigurationResponseDto} from "../../types_custom.ts";
import {QuestionPicker} from "../questions/question-picker.tsx";
import {useEffect, useState} from "react";
import ImageUpload from "../../components/image-upload";

const editQuizSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório."),
  description: yup.string().required("Descrição obrigatória."),
  questionsIds: yup.string(),
  image: yup.string().nullable()
});

type EditQuizSchema = yup.InferType<typeof editQuizSchema>;

class QuizAttemptConfigurationRequestDto {
}

export default function EditQuiz() {
  const { id } = useParams();
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>([]));
  const [f, setFile] = useState<File>();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditQuizSchema>({
    resolver: yupResolver(editQuizSchema)
  });

  const setImageUrlWrapper = (url: string) => {
    debugger
    setImageUrl(url);

  }

  const mutation = useMutation({
    mutationFn: async (updatedQuiz: QuizAttemptConfigurationRequestDto) => {
      const url = `${apiUrl}/quiz_attempt_configs/${id}`
      const res = await patch<QuizAttemptConfigurationRequestDto>(url, updatedQuiz);

      if (!res) {
        throw new Error("Erro ao editar o simulado.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryquiz_attempt_configs'] });
      await queryClient.invalidateQueries({ queryKey: ['quiz_attempt_configs'] });
      toast.success("Simulado editado com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar o Simulado.")
    }
  })

  const fetchData = async () => {
    return await getById<QuizAttemptConfigurationResponseDto>('quiz_attempt_configs', id);
  }

  const { isLoading, isError, data: quiz } = useQuery({
    queryKey: ['quiz_attempt_configs'],
    queryFn: fetchData,
  })

  useEffect(() => {
    if (quiz) {
      setSelectedKeys(new Set(quiz?.questions?.map(q => q.id)))
    }
  }, [quiz]);

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados do simulado.</span>
      </div>
    )
  }

  const handleBackToQuiz = () => {
    navigation('/quizzes')
  }

  const onSubmit = async (data: EditQuizSchema) => {

    data.questionsIds = Array.from(selectedKeys).join(",");
    data.image = imageUrl;
    debugger

    const updatedQuiz: QuizAttemptConfigurationRequestDto = {
      ...data,
      id: quiz.id,
      name: data.name ? data.name : quiz.name,
      description: data.description ? data.description : quiz.description,
      image: data.image ? data.image : quiz.image
    }
    try {
      await mutation.mutateAsync(updatedQuiz)
      handleBackToQuiz()
    } catch (error) {
      console.error("Erro ao editar o simulado:", error)
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToQuiz}><FaArrowLeft /> Voltar</Button>

      <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full mb-16"
      >
        <h1 className="text-center font-semibold">Editar Simulado</h1>
        <span className={"text-center text-xl text-secondary"}>{quiz.name}</span>
        <ImageUpload setFile={setFile} setImageUrl={setImageUrlWrapper} actualImageUrl={quiz.image} folderName={"quiz-attempt-configs"}/>

        <Input {...register("name")} label="Nome" variant="bordered" defaultValue={quiz.name}/>
        {errors.name && <cite className={"text-danger"}>{errors.name.message}</cite>}

        <Input {...register("description")} label="Descrição" variant="bordered" defaultValue={quiz.description}/>
        {errors.description && <cite className={"text-danger"}>{errors.description.message}</cite>}
        <QuestionPicker setSelectedKeys={setSelectedKeys} selectedKeys={selectedKeys}/>
        <Button
            type={"submit"}
            color="primary"
            className="my-6 mx-auto max-w-[150px] w-full"
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
