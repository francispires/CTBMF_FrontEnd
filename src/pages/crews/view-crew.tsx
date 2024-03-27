import {useNavigate, useParams} from "react-router-dom";
import {get} from "../../_helpers/api.ts"
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../../components/page-loader.tsx";
import {Button} from "@nextui-org/react";
import {FaArrowLeft} from "react-icons/fa";
import {MyCard} from "../../components/layout/MyCard.tsx";
import {CrewResponseDto} from "../../types_custom.ts";
import {apiUrl} from "../../_helpers/utils.ts";

export default function ViewCrew() {
  const { id } = useParams();
  const navigation = useNavigate()

  const fetchData = async () => {
    const url = `${apiUrl}/crews/${id}`
    return await get<CrewResponseDto>(url)
  }

  const { isLoading, isError, data: crew } = useQuery({
    queryKey: ['crews'],
    queryFn: fetchData,
  })

  const handleBackToCrews = () => {
    navigation('/crews')
  }

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !crew) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da turma.</span>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToCrews}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes da turma {crew.name}</h1>

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
            <span className="block">{crew.name}</span>
          </div>
          <div>
            <strong className="block">Descrição:&nbsp;</strong>
            <span className="block">{crew.description}</span>
          </div>
          {/*<div className="flex">*/}
          {/*  <strong className="block">Criada em:&nbsp;</strong>*/}
          {/*  <span className="block">{formatDate(String(crew.createdAt))}</span>*/}
          {/*</div>*/}
        </MyCard>
      </div>
    </div>
  )
}
