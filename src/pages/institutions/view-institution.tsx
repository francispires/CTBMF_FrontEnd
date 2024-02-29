import { Button } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../_helpers/api.ts";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "../../components/page-loader.tsx";
import { MyCard } from "../../components/layout/MyCard.tsx";
import { Institution } from "./edit-institution.tsx";
import { formatDate } from "../../utils/date.ts";

export default function ViewInstitution() {
  const { id } = useParams();
  const navigation = useNavigate();

  const handleBackToInstitutions = () => {
    navigation('/institutions')
  }

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/institutions/${id}`
    const res = await get<Institution>(url)

    return res
  }

  const { isLoading, isError, data: institution } = useQuery({
    queryKey: ['institution'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !institution) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={handleBackToInstitutions}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes da instituição</h1>

        <MyCard
          className="
            flex flex-col col-span-1 gap-3 text-sm max-w-[600px] w-full h-full
          "
        >
          <div className="flex">
            <strong className="block">Nome:&nbsp;</strong>
            <span className="block">{institution.name}</span>
          </div>
          <div className="flex">
            <strong className="block">Estado:&nbsp;</strong>
            <span className="block">{institution.state}</span>
          </div>
          <div className="flex">
            <strong className="block">Questões qtd:&nbsp;</strong>
            <span className="block">{institution.questions?.length ?? 0}</span>
          </div>
          <div className="flex">
            <strong className="block">Criada em:&nbsp;</strong>
            <span className="block">{formatDate(String(institution.createdAt))}</span>
          </div>
        </MyCard>
      </div>
    </div>
  )
}
