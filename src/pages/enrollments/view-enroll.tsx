import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../_helpers/api.ts"
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "../../components/page-loader.tsx";
import { Button } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { MyCard } from "../../components/layout/MyCard.tsx";
import { formatDate } from "../../utils/date.ts";
import {apiUrl} from "../../_helpers/utils.ts";
import {element} from "./index.tsx";
import {IEnrollmentResponseDto} from "../../types_custom.ts";

export default function ViewEnroll() {
  const { id } = useParams();
  const navigation = useNavigate()

  const fetchData = async () => {
    const url = `${apiUrl}/${element}/${id}`
    const res = await get<IEnrollmentResponseDto>(url)

    return res
  }

  const { isLoading, isError, data: enroll } = useQuery({
    queryKey: [element],
    queryFn: fetchData,
  })

  const handleBackToEnrollments = () => {
    navigation(`/${element}`)
  }

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !enroll) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToEnrollments}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes da matrícula</h1>

        <MyCard
          className="
            flex flex-col col-span-1 gap-3 text-sm max-w-[600px] w-full h-full
          "
        >
          <div className="flex">
            <strong className="block">Turma:&nbsp;</strong>
            <span className="block">{enroll.crew.name}</span>
          </div>
          <div>
            <strong className="block">Aluno:&nbsp;</strong>
            <span className="block">{enroll.student.name}</span>
          </div>
          <div className="flex">
            <strong className="block">Início:&nbsp;</strong>
            <span className="block">{enroll.startDate}</span>
          </div>
          <div className="flex">
            <strong className="block">Fim:&nbsp;</strong>
            <span className="block">{enroll.endDate}</span>
          </div>
        </MyCard>
      </div>
    </div>
  )
}
