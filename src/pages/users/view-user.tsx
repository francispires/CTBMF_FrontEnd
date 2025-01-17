import {useNavigate, useParams} from "react-router-dom";
import {get} from "../../_helpers/api.ts"
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../../components/page-loader.tsx";
import {Button} from "@nextui-org/react";
import {FaArrowLeft} from "react-icons/fa";
import {MyCard} from "../../components/layout/MyCard.tsx";
import {apiUrl} from "../../_helpers/utils.ts";
import {element} from "./users.tsx";
import {IUserResponseDto} from "../../types_custom.ts";

export default function ViewUser() {
  const { id } = useParams();
  const navigation = useNavigate()

  const fetchData = async () => {
    const url = `${apiUrl}/${element}/${id}`
    return await get<IUserResponseDto>(url)
  }

  const { isLoading, isError, data: user } = useQuery({
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

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados do usuário.</span>
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToEnrollments}><FaArrowLeft /> Voltar</Button>

      <div className="flex flex-col items-center w-full">
        <h1 className="text-center my-6 text-lg font-semibold">Detalhes do usuário</h1>

        <MyCard
            className="
            flex flex-col col-span-1 gap-3 text-sm max-w-[600px] w-full h-full
          "
        >

          <div className="flex">
            <img src={user.image} className="block"></img>
          </div>
            <div className="flex">
              <strong className="block">Turma:&nbsp;</strong>
              <span className="block">{user.crewId}</span>
            </div>
          <div className="flex">
            <strong className="block">Aluno:&nbsp;</strong>
            <span className="block">{user.name}</span>
          </div>
          <div className="flex">
              <strong className="block">Email:&nbsp;</strong>
              <span className="block">{user.email}</span>
            </div>
        </MyCard>
      </div>
    </div>
)
}
