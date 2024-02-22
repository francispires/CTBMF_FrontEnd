import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../_helpers/api";
import { PageLoader } from "../page-loader";
import { FaArrowLeft } from "react-icons/fa";
import { Question } from "../../types_custom";
import { MyCard } from "../layout/MyCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/date";

export default function ViewQuestion() {
  const { id } = useParams();
  const navigation = useNavigate()
  const IMAGE_PLACEHOLDER = 'https://placehold.co/600x400.jpg?text=Sem+imagem'

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/questions/${id}`
    const res = await get<Question>(url)

    return res
  }

  const { isLoading, isError, data: question } = useQuery({
    queryKey: [`viewQuestion-{${id}}`],
    queryFn: fetchData,
  })

  const handleBackToQuestions = () => {
    navigation('/questions')
  }

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

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToQuestions}><FaArrowLeft /> Voltar</Button>

      <span className="block mb-6 text-sm">Questão: {question.questionNumber}</span>

      <div className="w-full">
        <div className="flex lg:flex-row flex-col gap-3">
          <MyCard className="flex flex-col col-span-1 gap-3 text-sm lg:w-96 h-full">
            <img
              src={question.image ? question.image : IMAGE_PLACEHOLDER}
              alt="Questão"
              className="rounded-xl w-full"
              draggable={false}
            />

            <div className="flex">
              <strong className="block">Banca:&nbsp;</strong>
              <span className="block">{question.board}</span>
            </div>
            <div className="flex">
              <strong className="block">Ano:&nbsp;</strong>
              <span className="block">{question.year}</span>
            </div>
            <div className="flex">
              <strong className="block">Criada em:&nbsp;</strong>
              <span className="block">{formatDate(String(question.createdAt))}</span>
            </div>
            <div className="flex ml-auto rounded-xl bg-success/20 p-2">
              <span className="block text-success font-semibold">{question.score} pontos</span>
            </div>
          </MyCard>
          <MyCard className="flex-1 text-sm h-full">
            <strong className="block">Descrição</strong>
            <p>{question.text}</p>

            <strong className="block mt-3">Alternativas</strong>
            {question.alternatives.length ? (
              <>
                {question.alternatives.map((alternative) => (
                  <div key={alternative.id}>
                    {alternative.correct ? (
                      <div className="flex gap-2 items-center rounded-xl p-2 bg-success/20">
                        <FontAwesomeIcon className={"text-success"} icon={faCheck} />
                        <span>{alternative.text}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center rounded-xl p-2 bg-danger/20">
                        <FontAwesomeIcon className={"text-danger"} icon={faCircleXmark} />
                        <span>{alternative.text}</span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <span>Sem alternativas</span>
            )}
          </MyCard>
        </div>
      </div>
    </div>
  )
}
