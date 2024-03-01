import {SortDescriptor} from "@nextui-org/react";
import {QuizConfigCard} from "../components/layout/quiz-config-card.tsx";
import {get} from "../_helpers/api.ts";
import {apiUrl} from "../_helpers/utils.ts";
import {QuizAttemptConfigurationResponseDto} from "../types_custom.ts";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../components/page-loader.tsx";
import {useState} from "react";

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
  )
}
