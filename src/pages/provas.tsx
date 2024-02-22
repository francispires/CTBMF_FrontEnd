import { useNavigate, useParams } from "react-router-dom";
import { MyCard } from "../components/layout/MyCard";
import {Button, SortDescriptor} from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { mockedQuizzAttemptConfiguration } from "./user-question-bank";
import {QuizConfigCard} from "../components/layout/quiz-config-card.tsx";
import {get, remove} from "../_helpers/api.ts";
import {apiUrl, parseSortDescriptor} from "../_helpers/utils.ts";
import {QuizAttemptConfigurationResponseDto} from "../types_custom.ts";
import {useQuery} from "@tanstack/react-query";
import {PageLoader} from "../components/page-loader.tsx";
import {useState} from "react";

const quizzes = [
  {
    id: '1',
    quizzAttemptType: 'Simulation',
    score: 999,
    total: 10000,
    image: 'https://nextui.org/images/card-example-2.jpeg',
    questionsCount: 44,
    avgDifficulty: 200,
    questions: ['q1'],
    name: 'Quiz 1',
    description: 'Quiz 1 description'
  },
  {
    id: '2',
    quizzAttemptType: 'Exam',
    score: 100,
    total: 13000,
    image: 'https://nextui.org/images/card-example-6.jpeg',
    questionsCount: 23,
    avgDifficulty: 200,
    name: 'Quiz 2',
    description: 'Quiz 2 description',
    questions: ['q1', 'q2']
  },
  {
    id: '3',
    quizzAttemptType: 'Practice',
    image: 'https://nextui.org/images/card-example-5.jpeg',
    score: 400,
    questionsCount: 32,
    avgDifficulty: 200,
    total: 9000,
    name: 'Quiz 3',
    description: 'Quiz 3 description',
    questions: ['q1', 'q2', 'q3']
  },
]

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
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <div
        className="
          grid items-center w-full gap-6 pt-8 mt-8
          lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
        "
      >
        {
          data.queryable.map((quizz) => (
            <button
              key={quizz.id}
              className="bg-none border-none"
              onClick={() => {}}
            >
              <QuizConfigCard config={quizz} className="border-2 hover:border-primary cursor-pointer"></QuizConfigCard>
            </button>
          ))
        }
      </div>
    </div>
  )
}
