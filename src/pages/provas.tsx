import {Card, CardFooter, CardHeader, SortDescriptor,Image,Button} from "@nextui-org/react";
import {QuizConfigCard} from "../components/layout/quiz-config-card.tsx";
import {get} from "../_helpers/api.ts";
import {apiUrl} from "../_helpers/utils.ts";
import {QuizAttemptConfigurationResponseDto} from "../types_custom.ts";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../components/page-loader.tsx";
import {useState} from "react";
import {useConfig} from "../_helpers/queries.ts";

export default function Provas() {
  const [paging, setPaging] = useState({ currentPage: 1, pageSize: 10, sort: "", filter: "" } as PagedRequest);
  const [rowCount, setRowCount] = useState(0);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending"
  });


  const fetchData = async (pagination: PagedRequest, sort: string, filter: string) => {
    const url = `${apiUrl}/quiz_attempt_configs?currentPage=${pagination.currentPage}&pageSize=${pagination.pageSize}&sort=${sort}&filter=${filter}`;
    const response = await get<PagedResponse<QuizAttemptConfigurationResponseDto>>(url);
    setRowCount((response as PagedResponse<QuizAttemptConfigurationResponseDto>).rowCount);
    return response;
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ['qryKey', { ...paging, sortDescriptor }],
    queryFn: () => fetchData(paging, "id", "")
  });

  const {data:config} = useConfig();

  if (isLoading) {
    return (
        <PageLoader />
    )
  }
  if (isError || !data) {
    return (
        <div className="flex items-center justify-center h-full">
          <span className="text-red-400">Ocorreu um erro ao buscar dados.</span>
        </div>
    )
  }

  return (
      <div className={"p-3"}>
        <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">Questões separadas cuidadosamente para você destruir as provas reais</p>
            <h4 className="text-white/90 font-medium text-xl">Escolha o seu simulado e comece seus estudos</h4>
          </CardHeader>
          <Image
              removeWrapper
              isZoomed={true}
              alt="Relaxing app background"
              className="z-0 w-full h-full object-cover"
              src={config?.get('quizBackGroundImage')}
          />
        </Card>
        <div
            className="
          grid items-center gap-6
          my-5 max-w-[99rem] items-center
          lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
        >
          {
            data.queryable.map((quizz) => (
                <div
                    key={quizz.id}
                    className="bg-none border-none"
                    onClick={() => {
                    }}
                >
                  <QuizConfigCard config={quizz}
                                  className="border-2 hover:border-primary cursor-pointer"></QuizConfigCard>
                </div>
            ))
          }
        </div>
      </div>

  )
}
