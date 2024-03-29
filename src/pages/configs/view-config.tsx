import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../_helpers/api.ts"
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "../../components/page-loader.tsx";
import { Button } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { MyCard } from "../../components/layout/MyCard.tsx";
import { formatDate } from "../../utils/date.ts";

export default function ViewConfig() {
  const { id } = useParams();
  const navigation = useNavigate()

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/disciplines/${id}`
    const res = await get<Discipline>(url)

    return res
  }

  const { isLoading, isError, data: discipline } = useQuery({
    queryKey: ['discipline'],
    queryFn: fetchData,
  })

  const handleBackToDisciplines = () => {
    navigation('/disciplines')
  }

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !discipline) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToDisciplines}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes da disciplina</h1>

        <MyCard
          className="
            flex flex-col col-span-1 gap-3 text-sm max-w-[600px] w-full h-full
          "
        >
          <div
            className={`
              bg-[url(https://placehold.co/600x400.jpg?text=Sem+imagem)]
              bg-cover bg-no-repeat bg-center p-32
            `}
          />

          <div className="flex">
            <strong className="block">Nome:&nbsp;</strong>
            <span className="block">{discipline.name}</span>
          </div>
          <div>
            <strong className="block">Descrição:&nbsp;</strong>
            <span className="block">{discipline.description}</span>
          </div>
          <div className="flex">
            <strong className="block">Questões:&nbsp;</strong>
            <span className="block">{discipline.questions ?? 0}</span>
          </div>
          <div className="flex">
            <strong className="block">Filhas Qtd:&nbsp;</strong>
            <span className="block">{discipline.childsCount ?? 0}</span>
          </div>
          <div className="flex">
            <strong className="block">Criada em:&nbsp;</strong>
            <span className="block">{formatDate(String(discipline.createdAt))}</span>
          </div>
        </MyCard>
      </div>
    </div>
  )
}
