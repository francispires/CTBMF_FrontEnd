import { useNavigate } from "react-router-dom";
import { MyCard } from "../components/layout/MyCard";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

const mockedQuestionBank = [
  {
    id: '1',
    name: "Questions 1",
  },
  {
    id: '2',
    name: "Questions 2",
  },
  {
    id: '3',
    name: "Questions 3",
  },
]

export const mockedQuizzAttemptConfiguration = [
  {
    questionBankId: '1',
    id: '1',
    user: "User 1",
    name: "Attempt Config 1",
    quizzAttempts: ['q1', 'q2', 'q3']
  },
  {
    questionBankId: '1',
    id: '2',
    user: "User 2",
    name: "Attempt Config 2",
    quizzAttempts: ['q1']
  },
  {
    questionBankId: '2',
    id: '3',
    user: "User 3",
    name: "Attempt Config 3",
    quizzAttempts: ['q1', 'q2', 'q3', 'q4']
  },
  {
    questionBankId: '2',
    id: '4',
    user: "User 4",
    name: "Attempt Config 4",
    quizzAttempts: ['q1', 'q2']
  },
  {
    questionBankId: '2',
    id: '5',
    user: "User 5",
    name: "Attempt Config 5",
    quizzAttempts: ['q1', 'q2', 'q3']
  },
  {
    questionBankId: '3',
    id: '6',
    user: "User 6",
    name: "Attempt Config 6",
    quizzAttempts: ['q1', 'q2', 'q3', 'q4', 'q5']
  }
]

export default function UserQuestionBank() {
  const navigate = useNavigate()
  const [selectedQuestionbank, setSelectedQuestionBank] = useState<string | null>(null)
  const [attemptConfigs, setAttemptConfigs] = useState<typeof mockedQuizzAttemptConfiguration | null>(null)

  function goToQuizzesList(attemptConfigId: string) {
    navigate(`/quizzes/${attemptConfigId}`)
  }

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const questionBankId = e.target.value

    setSelectedQuestionBank(questionBankId)

    const bankQuizzesAttempt = mockedQuizzAttemptConfiguration.filter((item) =>
      item.questionBankId === questionBankId
    )

    setAttemptConfigs(bankQuizzesAttempt)
  };

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <div className="max-w-xs">
        <h1 className="font-semibold text-xl mb-6">Banco de Questões</h1>
        <Select
          size={"lg"}
          label="Selecione um banco de questões"
          selectionMode="single"
          selectedKeys={selectedQuestionbank ?? undefined}
          items={mockedQuestionBank}
          onChange={handleSelectionChange}
        >
          {mockedQuestionBank.map((item) => (
            <SelectItem key={item.id || JSON.stringify(item)} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {attemptConfigs && !!attemptConfigs.length && (
        <div
          className="
            grid items-center w-full gap-6 border-t pt-8 mt-8
            lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
          "
        >
          {
            attemptConfigs.map((attemptConfig) => (
              <button
                key={attemptConfig.id}
                className="bg-none border-none"
                onClick={() => goToQuizzesList(attemptConfig.id)}
              >
                <MyCard
                  className="border-2 hover:border-primary cursor-pointer"
                >
                  <strong className="block">{attemptConfig.name}</strong>
                  <span>{attemptConfig.user}</span>
                  <div className="w-full border-b" />
                  <span className="p-2 rounded-xl bg-primary/20 text-primary ml-auto">Quizzes: {attemptConfig.quizzAttempts.length ?? 0}</span>
                </MyCard>
              </button>
            ))
          }
        </div>
      )}

      <div className="border-t pt-8 mt-8">
        <h1 className="font-semibold text-xl mb-6">Novos quizzes</h1>
        <div
          className="
            grid items-center w-full gap-6
            lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1
          "
        >

          <button
            className="bg-none border-none"
            onClick={() => goToQuizzesList('1')}
          >
            <MyCard
              className="border-2 hover:border-primary cursor-pointer"
            >
              <strong className="block">Attempt Config 1</strong>
              <span>User 1</span>
              <div className="w-full border-b" />
              <span className="p-2 rounded-xl bg-primary/20 text-primary ml-auto">Quizzes: 3</span>
            </MyCard>
          </button>
          <button
            className="bg-none border-none"
            onClick={() => goToQuizzesList('2')}
          >
            <MyCard
              className="border-2 hover:border-primary cursor-pointer"
            >
              <strong className="block">Attempt Config 2</strong>
              <span>User 2</span>
              <div className="w-full border-b" />
              <span className="p-2 rounded-xl bg-primary/20 text-primary ml-auto">Quizzes: 1</span>
            </MyCard>
          </button>
        </div>
      </div>
    </div>
  )
}
