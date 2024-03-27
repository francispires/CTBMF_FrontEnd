import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../_helpers/api.ts"
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "../../components/page-loader.tsx";
import {Button, Image} from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { MyCard } from "../../components/layout/MyCard.tsx";
import {apiUrl, getImageUrl} from "../../_helpers/utils.ts";
import {QuizAttemptConfigurationResponseDto} from "../../types_custom.ts";

export default function ViewQuiz() {
  const { id } = useParams();
  const navigation = useNavigate()

  const fetchData = async () => {
    const url = `${apiUrl}/quiz_attempt_configs/${id}`
    const res = await get<QuizAttemptConfigurationResponseDto>(url)

    return res
  }

  const { isLoading, isError, data: config } = useQuery({
    queryKey: ['quiz_attempt_configs'],
    queryFn: fetchData,
  })

  const handleBackToQuizes = () => {
    navigation('/quizzes')
  }

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !config) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToQuizes}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes do Simulado {config.name}</h1>

        <MyCard
          className="
            flex flex-col col-span-1 gap-3 text-sm max-w-[600px] w-full h-full
          "
        >
          <Image
              className={"bg-cover bg-no-repeat bg-center"}
              src={getImageUrl('quiz-attempt-configs',config.image)} alt={config.name} width={600} height={400} />

          <div className="flex">
            <strong className="block">Nome:&nbsp;</strong>
            <span className="block">{config.name}</span>
          </div>
          <div>
            <strong className="block">Descrição:&nbsp;</strong>
            <span className="block">{config.description}</span>
          </div>
          <div className="flex">
            <strong className="block">Questões:&nbsp;</strong>
            <span className="block">{config.questionsCount ?? 0}</span>
          </div>
        </MyCard>
      </div>
    </div>
  )
}
